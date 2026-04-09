export class Scene
{
    objects = [];
    light = null;

    addMesh(mesh)
    {
        this.objects.push(mesh);
    }

    removeMesh(mesh)
    { 
        this.objects = this.objects.filter(o => o !== mesh);
    }

    setLight(light)
    {
        this.light = light;
    }
}