import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { PerspectiveCamera } from "./perspective_camera.js"
import { Player } from "./player.js"

import { fetchFile } from "./file_loader.js"

import { generateTestScene } from "./test_scene.js";
import { generateWinterScene } from "./winter_scene.js";

const renderer = new Renderer();
const context = renderer.initRenderer();

let lastTime = 0.0;
let frameTime = 0.0;
let deltaTime = 0.0;

const vertexSrc = await fetchFile('./shader/vert.glsl');
const fragmentSrc = await fetchFile('./shader/frag.glsl');
const fragmentUnlitSrc = await fetchFile('./shader/frag_unlit.glsl');

const shadowVertSrc = await fetchFile('./shader/shadow_vert.glsl');
const shadowFragSrc = await fetchFile('./shader/shadow_frag.glsl');
const shadowShader = new Shader(context, shadowVertSrc, shadowFragSrc);
renderer.setupShadowShader(shadowShader);

const blitVert = await fetchFile('./shader/blit_vert.glsl');
const blitFrag = await fetchFile('./shader/blit_frag.glsl');
const blitShader = new Shader(context, blitVert, blitFrag);
renderer.setupBlitShader(blitShader);

const shaderLit = new Shader(context, vertexSrc, fragmentSrc);
const shaderUnlit = new Shader(context, vertexSrc, fragmentUnlitSrc);
const camera = new PerspectiveCamera(60, context.canvas.width / context.canvas.height);

const player = new Player(canvas);
player.position = [0.0, 15.0, 40.0];
player.rotation = [-0.5, 0.0, 0.0];

const scenes = {
    demo: await generateTestScene(renderer, shaderLit, shaderUnlit),
    winter: await generateWinterScene(renderer, shaderLit, shaderUnlit),
};

let scene = scenes.demo;

window.setScene = async(name) =>
{
    scene = scenes[name];

    if (name === 'demo')
    {
        renderer.context.clearColor(0.0, 0.0, 0.0, 1.0);
    }
    else if (name === 'winter')
    {
        renderer.context.clearColor(0.18, 0.37, 0.36, 1.0);
    }

    document.getElementById('btnDemoScene').classList.toggle('active', name === 'demo');
    document.getElementById('btnWinterScene').classList.toggle('active', name === 'winter');
};

document.getElementById('btnDemoScene').classList.add('active');

function frame(time)
{
    // fps counting

    deltaTime = time - lastTime;
    lastTime = time;

    handleFpsCounter(time);

    player.update(deltaTime / 1000.0);

    if (!scene)
    {
        return;
    }

    if (scene.update)
    {
        scene.update(time, deltaTime);
    }

    camera.setPosition(player.position[0], player.position[1], player.position[2]);
    camera.setRotation(player.rotation[0], player.rotation[1], player.rotation[2],)

    renderer.renderScene(scene, camera);
    requestAnimationFrame(frame);

    let resizeTimeout = null;

    window.addEventListener("resize", () =>
    {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() =>
        {
            const aspect = renderer.resize();
            camera.setAspect(aspect);
        }, 100);
    });
}

function handleFpsCounter(time)
{
    frameTime = frameTime * 0.9 + deltaTime * 0.1;

    const fps = 1000 / frameTime;

    document.getElementById("fps").textContent = "FPS: " + fps.toFixed(0);
}

requestAnimationFrame(frame);