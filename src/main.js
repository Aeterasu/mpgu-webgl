import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { Mesh } from "./mesh.js"
import { Scene } from "./scene.js";
import { Light } from "./light.js";
import { Texture } from "./texture.js";
import { PerspectiveCamera } from "./perspective_camera.js"
import { Player } from "./player.js"

import { fetchFile } from "./file_loader.js"

const renderer = new Renderer();
const context = renderer.initRenderer();

let lastTime = 0.0;
let frameTime = 0.0;
let deltaTime = 0.0;

const vertexSrc = await fetchFile('./shader/vert.glsl');
const fragmentSrc = await fetchFile('./shader/frag.glsl');

const shader = new Shader(context, vertexSrc, fragmentSrc);
const camera = new PerspectiveCamera(60, context.canvas.width / context.canvas.height);

const scene = new Scene(shader);

const monkeyModel = await fetchFile("./mesh/monkey.obj");
const monkey = await Mesh.fromObj(context, monkeyModel);
monkey.color = [1.0, 1.0, 1.0];

const cubeModel = await fetchFile("./mesh/cube.obj");
const cube1 = await Mesh.fromObj(context, cubeModel);
cube1.position = [-3.0, -2.5, -3.0];

const cube2 = await Mesh.fromObj(context, cubeModel);
cube2.position = [3.0, -2.5, -3.0];

const fumo = await Texture.fromUrl(context, "./texture/fumo.png");
cube1.texture = fumo;

const cinema = await Texture.fromUrl(context, "./texture/cinema.png");
cube2.texture = cinema;

const planeModel = await fetchFile("./mesh/plane.obj");
const plane = await Mesh.fromObj(context, planeModel);
plane.color = [0.5, 0.5, 0.5];
plane.scale = [25.0, 1.0, 25.0];
plane.position = [0.0, -2.5, 0.0];

const player = new Player(canvas);
player.position[2] = 5.0;

scene.setAmbientLightColor([0.0, 0.0, 0.2]);

scene.addMesh(monkey);
scene.addMesh(plane);
scene.addMesh(cube1);
scene.addMesh(cube2);

scene.addLight(new Light([2, 1, -7], [1.0, 0.8, 0.7], 1.0, 24.0));
scene.addLight(new Light([-3, 1, -2], [0.4, 0.6, 1.0], 1.5, 16.0));
scene.addLight(new Light([ 0, 1, 1], [0.2, 1.0, 0.4], 0.8, 16.0));

renderer.setupShader(shader); // TEMP

function frame(time)
{
    // fps counting

    deltaTime = time - lastTime;
    lastTime = time;

    handleFpsCounter(time);

    // actual update logic. messy but will do for now!

    monkey.rotation[0] = 0.0;
    monkey.rotation[1] = time * 0.001;
    monkey.position = [0, -0.5 + Math.sin(time * 0.002) * 0.3, -3];

    cube1.rotation[0] = time * 0.001;
    cube1.rotation[1] = time * 0.001;
    cube1.position[1] = -0.5 + Math.sin(time * 0.003) * 0.3;

    cube2.rotation[0] = time * -0.001;
    cube2.rotation[1] = time * -0.001;
    cube2.position[1] = -0.5 + Math.sin(time * 0.003) * 0.3;

    player.update(deltaTime / 1000.0);

    camera.setPosition(player.position[0], player.position[1], player.position[2]);
    camera.setRotation(player.rotation[0], player.rotation[1], player.rotation[2],)

    renderer.renderScene(scene, camera);
    requestAnimationFrame(frame);
}

function handleFpsCounter(time)
{
    frameTime = frameTime * 0.9 + deltaTime * 0.1;

    const fps = 1000 / frameTime;

    document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
}

requestAnimationFrame(frame);