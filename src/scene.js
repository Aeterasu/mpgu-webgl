export class Scene
{
    objects = [];

    add(mesh)
    {
        this.objects.push(mesh); 
    }

    remove(mesh)
    { 
        this.objects = this.objects.filter(o => o !== mesh);
    }
}