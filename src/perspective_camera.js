import { mat4, vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";

export class PerspectiveCamera
{
    view = mat4.create();
    projection = mat4.create();

    constructor(fov, aspect, near = 0.1, far = 1000.0)
    {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.position = vec3.fromValues(0, 0, 5);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);

        this.rebuildProjection();
        this.rebuildView();
    }

    get viewMatrix()
    { 
        return this.view;
    }

    get projectionMatrix()
    { 
        return this.projection;
    }

    setPosition(x, y, z)
    {
        this.position = vec3.fromValues(x, y, z);
        this.rebuildView();
    }

    setAspect(aspect)
    {
        this.aspect = aspect;
        this.rebuildProjection();
    }

    rebuildView()
    {
        mat4.lookAt(this.view, this.position, this.target, this.up);
    }

    rebuildProjection()
    {
        mat4.perspective(
            this.projection,
            this.fov * Math.PI / 180, // rads
            this.aspect,
            this.near,
            this.far
        );
    }
}