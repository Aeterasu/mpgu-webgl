import { Renderer } from "./renderer.js"
import { Shader } from "./shader.js"

const vertexSrc = await fetchFile('./shader/vert.glsl');
const fragmentSrc = await fetchFile('./shader/frag_random.glsl');

let renderer = new Renderer();
let glContext = renderer.glContext;

let shader = new Shader(glContext, vertexSrc, fragmentSrc);
let shaderProgram = shader.program;

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: glContext.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
        modelViewMatrix: glContext.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        projectionMatrix: glContext.getUniformLocation(shaderProgram, "uProjectionMatrix"),
    },
};

const buffers = renderer.initBuffers(glContext);
renderer.drawScene(programInfo, buffers);

async function fetchFile(url) 
{
    const res = await fetch(url);

    if (!res.ok) 
    {
        throw new Error(`Failed to load file: ${url}`);
    }

    return await res.text();
}