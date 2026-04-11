class Light
{
    position = [0, 0, 0];
    color = [1, 1, 1];
    intensity = 1.0;
    radius = 16.0;

    constructor(position, color, intensity, radius)
	{
		this.position = position;
        this.color = color;
        this.intensity = intensity;
        this.radius = radius;
    }
}

export { Light };