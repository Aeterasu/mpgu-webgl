import { mat4, vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";

class Light
{
    position = vec3.fromValues(0, 0, 0);
    color = [1.0, 1.0, 1.0];
    intensity = 1.0

    constructor(position, color, intensity)
	{
		this.position = position;
        this.color = color;
        this.intensity = intensity;
	}
}

export { Light };