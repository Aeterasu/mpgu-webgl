import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { Scene } from "./scene.js";
import { Cube } from "./cube.js";
import { PerspectiveCamera } from "./perspective_camera.js"

import { fetchFile } from "./file_loader.js"

const renderer = new Renderer();
const context = renderer.initRenderer();

let lastTime = 0;
let frameTime = 0;

const vertexSrc = await fetchFile('./shader/vert.glsl');
const fragmentSrc = await fetchFile('./shader/frag.glsl');

const shader = new Shader(context, vertexSrc, fragmentSrc);
const camera = new PerspectiveCamera(60, context.canvas.width / context.canvas.height);

const scene = new Scene(shader);

const cube1 = new Cube(context);
cube1.position = [0, -1, 0]

const cube2 = new Cube(context);
cube2.position = [-3, 1, -2]

const cube3 = new Cube(context);
cube3.position = [2, 2, -1]

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

renderer.setupShader(shader); // TEMP

function frame(time)
{
    // fps counting

    handleFpsCounter(time);

    // actual update logic. messy but will do for now!

    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    cube1.rotation[0] = Math.PI / 6;
    cube1.rotation[1] = time * 0.001;

    cube2.rotation[0] = -Math.PI / 6;
    cube2.rotation[2] = time * -0.001;

    cube3.rotation[1] = -Math.PI / 6;
    cube3.rotation[0] = time * -0.001;

    renderer.renderScene(scene, camera);
    requestAnimationFrame(frame);
}

function handleFpsCounter(time)
{
    const delta = time - lastTime;
    lastTime = time;

    frameTime = frameTime * 0.9 + delta * 0.1;

    const fps = 1000 / frameTime;

    document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
}

requestAnimationFrame(frame);