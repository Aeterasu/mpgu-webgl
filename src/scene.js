export class Scene
{
    objects = [];
    lights = [];

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
}