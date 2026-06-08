import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js"
import { Light } from "./light.js";
import { DirectionalLight } from "./directional_light.js";
import { Texture } from "./texture.js";
import { Shader } from "./shader.js";
import { ParticleSystem } from "./particle_system.js";

import { fetchFile } from "./file_loader.js"

let sun = null;
let mesh = null;
let particles = null;

export async function generateWinterScene(renderer, shaderLit, shaderUnlit)
{
    const context = renderer.context;
    const scene = new Scene();

    scene.useShadows = true;
    
    const sceneFile = await fetchFile("./mesh/winter_scene.obj");
    const mesh = await Mesh.fromObj(context, sceneFile);
    const texture = await Texture.fromUrl(context, "./texture/winter_scene_texture.png");
    mesh.texture = texture;
    mesh.color = [1.0, 1.0, 1.0];
    mesh.position = [0.0, 6.0, 26.0];
    mesh.shader = shaderLit;

    scene.ambientLightColor = [1.0, 0.9, 0.85];

    sun = new DirectionalLight();
    sun.color = [1.0, 1.0, 1.0];
    sun.intensity = 1.0;
    sun.rotation = [0.6, 0.4, 0.0];

    scene.directionalLight = sun;

    const updateVert = await fetchFile('./shader/particle_update_vert.glsl');
    const updateFrag = await fetchFile('./shader/particle_update_frag.glsl');
    const updateShader = new Shader(context, updateVert, updateFrag,
        ['vPosition', 'vVelocity', 'vLifetime', 'vMaxLife']
    );

    const particleVert = await fetchFile('./shader/particle_vert.glsl');
    const particleFrag = await fetchFile('./shader/particle_frag.glsl');
    const particleShader = new Shader(context, particleVert, particleFrag);

    particles = new ParticleSystem(context, particleAmount);
    particles.updateShader = updateShader;
    particles.renderShader = particleShader;
    particles.position = [0, 4.5, 0];

    scene.addParticles(particles);
    scene.addMesh(mesh);

    scene.update = update;

    renderer.setPixelArt(true, 2)
    renderer.setPolygonJitter(true, 150);

    // particle count

    const particleAmountInput = document.getElementById("particleAmount");

    particleAmountInput.addEventListener("input", (e) => {
        const v = parseInt(e.target.value);

        if (!Number.isNaN(v))
        {
            particleAmount = v;
            particles.setCount(particleAmount);
        }
    });

    renderer.setPixelArt(true, 2)
    renderer.setPolygonJitter(true, 150);

    return scene;
}

function update(time, delta)
{
    particles.update(delta / 1000.0);
    //console.log(self.sceneMesh);
}