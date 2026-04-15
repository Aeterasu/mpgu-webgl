import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js"
import { Light } from "./light.js";
import { DirectionalLight } from "./directional_light.js";
import { Texture } from "./texture.js";
import { Shader } from "./shader.js";
import { ParticleSystem } from "./particle_system.js";

import { fetchFile } from "./file_loader.js"

let monkey = null;
let cube1 = null;
let cube2 = null;

let sun = null;

let particles = null;

let tiles = [];

export async function generateTestScene(renderer, shaderLit, shaderUnlit)
{
    const context = renderer.context;
    const scene = new Scene();

    scene.useShadows = true;

    const monkeyModel = await fetchFile("./mesh/monkey.obj");
    monkey = await Mesh.fromObj(context, monkeyModel);
    monkey.color = [1.0, 1.0, 1.0];
    monkey.assignShader(shaderLit);
    
    const cubeModel = await fetchFile("./mesh/cube.obj");
    cube1 = await Mesh.fromObj(context, cubeModel);
    cube1.position = [-3.0, -2.5, -3.0];
    cube1.assignShader(shaderUnlit);
    
    cube2 = await Mesh.fromObj(context, cubeModel);
    cube2.position = [3.0, -2.5, -3.0];
    cube2.assignShader(shaderUnlit);
    
    const fumo = await Texture.fromUrl(context, "./texture/fumo.png");
    cube1.texture = fumo;
    cube2.texture = fumo;

    const tileTexture = await Texture.fromUrl(context, "./texture/tile.png");
    
    const tileModel = await fetchFile("./mesh/tile.obj");

    let x = 32;
    let y = 32;
    let midX = x / 2;
    let midY = y / 2;

    for (let i = 0; i < x; i++)
    {
        for (let j = 0; j < y; j++)
        {            
            const tile = await Mesh.fromObj(context, tileModel);
            tile.position = [i * 2.0 - midX * 2.0, -2.5, j * 2.0 - midY * 2.0];
            tile.texture = fumo;

            tile.rotation[1] = Math.PI / 2.0 * Math.floor(Math.random() * 4.0);

            tiles.push(tile);
            tile.id = i + j;

            tile.color = [0.4, 0.4, 0.4];
            
            tile.shader = shaderLit;

            tile.texture = tileTexture;
            
            scene.addMesh(tile);
        }
    }

    scene.ambientLightColor = [0.1, 0.1, 0.1];

    scene.addMesh(monkey);
    scene.addMesh(cube1);
    scene.addMesh(cube2);

    scene.addLight(new Light([2, 1, -7], [1.0, 0.8, 0.7], 8.0, 24.0));
    scene.addLight(new Light([-5, 1, -2], [0.4, 0.6, 1.0], 6.5, 16.0));
    scene.addLight(new Light([7, 1, 4], [0.2, 1.0, 0.4], 1.8, 16.0));

    sun = new DirectionalLight();
    sun.color = [1.0, 1.0, 1.0];
    sun.intensity = 1.0;
    sun.rotation = [0.6, 0.4, 0.0];

    scene.directionalLight = sun;

    const updateVert = await fetchFile('./shader/particle_update_vert.glsl');
    const updateFrag = await fetchFile('./shader/particle_update_frag.glsl');
    const updateShader = new Shader(context, updateVert, updateFrag,
        ['vPosition', 'vVelocity', 'vLifetime', 'vMaxLife'] // must match shader out names
    );

    const particleVert = await fetchFile('./shader/particle_vert.glsl');
    const particleFrag = await fetchFile('./shader/particle_frag.glsl');
    const particleShader = new Shader(context, particleVert, particleFrag);

    particles = new ParticleSystem(context, 1_000);
    particles.updateShader = updateShader;
    particles.renderShader = particleShader;
    particles.position = [0, 6.5, 0];

    scene.addParticles(particles);

    scene.update = update;

    renderer.setPixelArt(true, 3)
    renderer.setPolygonJitter(true, 200);

    return scene;
}

function update(time, delta)
{
    monkey.rotation[0] = 0.0;
    monkey.rotation[1] = time * 0.001;
    monkey.position = [0, -0.5 + Math.sin(time * 0.002) * 0.3, -3];

    cube1.rotation[0] = time * 0.001;
    cube1.rotation[1] = time * 0.001;
    cube1.position[1] = -0.5 + Math.sin(time * 0.003) * 0.3;

    cube2.rotation[0] = time * -0.001;
    cube2.rotation[1] = time * -0.001;
    cube2.position[1] = -0.5 + Math.sin(time * 0.003) * 0.3;

    particles.update(delta / 1000.0);

    for (const tile of tiles)
    {
        tile.position[1] = -2.5 + Math.sin((time + tile.id * 250.0) * 0.003) * 0.2;
    }
}