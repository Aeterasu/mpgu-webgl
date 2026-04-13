import { mat4, vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";

export class DirectionalLight
{
    color = [1.0, 1.0, 1.0];
    intensity = 1.0;

    rotation  = [0.0, 0.0, 0.0];

    shadowArea = 30.0;
    shadowNear = 0.1;
    shadowFar = 100.0;

    lightView = mat4.create();
    lightProjection = mat4.create();
    lightSpaceMatrix = mat4.create();

    get direction()
    {
        const pitch = this.rotation[0];
        const yaw = this.rotation[1];

        return [
            Math.cos(pitch) * Math.sin(yaw),
            -Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        ];
    }

    buildLightSpaceMatrix()
    {
        const dir = this.direction;

        const dist = this.shadowFar * 0.5;
        const pos = [-dir[0] * dist, -dir[1] * dist, -dir[2] * dist];

        mat4.lookAt(this.lightView, pos, [0, 0, 0], [0, 1, 0]);

        const half = this.shadowArea * 0.5;
        mat4.ortho(
            this.lightProjection,
            -half, half,
            -half, half,
            this.shadowNear,
            this.shadowFar
        );

        mat4.multiply(this.lightSpaceMatrix, this.lightProjection, this.lightView);
    }
}