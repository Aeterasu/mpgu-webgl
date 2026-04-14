import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js"
import { Light } from "./light.js";
import { DirectionalLight } from "./directional_light.js";
import { Texture } from "./texture.js";

import { fetchFile } from "./file_loader.js"

export async function generateAutumnScene(renderer, shaderLit, shaderUnlit)
{
    const context = renderer.context;
    const scene = new Scene();

    scene.ambientLightColor = [0.06, 0.03, 0.01];

    const sun = new DirectionalLight();
    sun.color = [1.0, 1.0, 1.0];
    sun.intensity = 1.0;
    sun.rotation = [0.8, 0.4, 0.0];

    scene.directionalLight = sun;

    const pavementFile = await fetchFile("./mesh/park_pavement.obj");
    const pavement = await Mesh.fromObj(context, pavementFile);
    pavement.assignShader(shaderLit);
    pavement.position = [0.0, -2.5, 0.0];
    pavement.texture = await Texture.fromUrl(context, "./texture/tile.png");

    scene.addMesh(pavement);

    renderer.setPixelArt(true, 2)
    renderer.setPolygonJitter(true, 200);

    return scene;
}