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

		this.position = [0, 0, 0];
		this.rotation = [0, 0, 0];
		this.up = [0, 1, 0];

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
		this.position = [x, y, z];
		this.rebuildView();
	}

	setRotation(pitch, yaw, roll)
	{
		this.rotation[0] = pitch;
		this.rotation[1] = yaw;
		this.rotation[2] = roll;

		this.rebuildView();
	}

	setAspect(aspect)
	{
		this.aspect = aspect;
		this.rebuildProjection();
	}

	rebuildView()
	{
		const pitch = this.rotation[0];
		const yaw = this.rotation[1];

		const cosPitch = Math.cos(pitch);
		const sinPitch = Math.sin(pitch);
		const cosYaw = Math.cos(yaw);
		const sinYaw = Math.sin(yaw);

		const forward = vec3.fromValues(
			cosPitch * sinYaw,
			sinPitch,
			-cosPitch * cosYaw
		);

		const target = vec3.create();
		vec3.add(target, this.position, forward);

		mat4.lookAt(this.view, this.position, target, this.up);
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