export class Renderer
{
	context;
	shader;

	initRenderer()
	{
		this.canvas = document.getElementById("canvas");
		this.context = this.canvas.getContext("webgl2");

		if (!this.context)
		{
			throw new Error("WebGL not supported");
		}
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.context.viewport(0, 0, canvas.width, canvas.height);
		
		this.context.clearColor(0.0, 0.0, 0.0, 1.0);
		this.context.clear(this.context.COLOR_BUFFER_BIT);

		this.context.enable(this.context.DEPTH_TEST);
		this.context.depthFunc(this.context.LEQUAL);
		
		this.context.enable(this.context.CULL_FACE);
		this.context.cullFace(this.context.BACK);
		this.context.frontFace(this.context.CCW);

		return this.context;
	}

	setupShader(shader)
	{
		this.shader = shader;
	}

	renderScene(scene, camera)
	{
		const context = this.context;
		const shader = this.shader;

		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

		shader.bind();
		shader.setMat4("uView", camera.viewMatrix);
		shader.setMat4("uProjection", camera.projectionMatrix);

		const lights = scene.lights;
		shader.setInt("uLightCount", lights.length);

		for (let i = 0; i < lights.length; i++)
		{
			const l = lights[i];
			const prefix = `uLights[${i}]`;

			shader.setVec3(`${prefix}.position`, l.position);
			shader.setVec3(`${prefix}.color`, l.color);
			shader.setFloat(`${prefix}.intensity`, l.intensity);
			shader.setFloat(`${prefix}.radius`, l.radius);
		}

		for (const mesh of scene.objects)
		{
			shader.setMat4("uModel", mesh.modelMatrix);
			shader.setVec3("uObjectColor", mesh.color);
			shader.setVec3("uAmbientLightColor", scene.ambientLightColor);

			context.bindVertexArray(mesh.vao);
			context.drawElements(context.TRIANGLES, mesh.indexCount, context.UNSIGNED_SHORT, 0);
			context.bindVertexArray(null);
		}

		shader.unbind();        
	}
}