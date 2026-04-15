export class Scene
{
    objects = [];
    lights = [];
    particles = [];
    ambientLightColor = [0.0, 0.0, 0.0];
    directionalLight = null;

    useShadows = false;

    constructor()
    {
        this.objects = [];
        this.lights = [];
        this.particles = [];
        this.ambientLightColor = [0.0, 0.0, 0.0];
        this.directionalLight = null;
        this.useShadows = false;
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

    addParticles(particleSystem)
    {
        this.particles.push(particleSystem);
    }

    removeParticles(particleSystem)
    {
        this.particles = this.particles.filter(o => o !== particleSystem);
    }
}