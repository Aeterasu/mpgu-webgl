export class Scene
{
    objects = [];
    lights = [];
    ambientLightColor = [0.0, 0.0, 0.0];
    directionalLight = null;

    setAmbientLightColor(color)
    {
        this.ambientLightColor = color;
    }

    addMesh(mesh)
    {
        this.objects.push(mesh);
    }

    removeMesh(mesh)
    { 
        this.objects = this.objects.filter(o => o !== mesh);
    }

    addLight(light)
    {
        this.lights.push(light);
    }

    removeLight(light)
    { 
        this.lights = this.lights.filter(o => o !== light);
    }

    setDirectionalLight(light)
    {
        this.directionalLight = light;
    }
}