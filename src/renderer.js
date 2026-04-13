import { ShadowMap } from "./shadow_map.js";

export class Renderer
{
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

		this.shadowMap = new ShadowMap(this.context);

		return this.context;
	}

	setupShadowShader(shader)
	{
		this.shadowShader = shader;
	}

	renderScene(scene, camera)
	{
		const context = this.context;
		const dirLight = scene.directionalLight;
		
		if (dirLight && this.shadowShader && scene.useShadows)
		{
			dirLight.buildLightSpaceMatrix();
			
			this.shadowMap.bindForWriting();
			context.viewport(0, 0, this.shadowMap.width, this.shadowMap.height);
			
			// front face culling during shadow pass reduces peter panning
			context.cullFace(context.FRONT);
			
			this.shadowShader.bind();
			this.shadowShader.setMat4("uLightSpaceMatrix", dirLight.lightSpaceMatrix);
			
			for (const mesh of scene.objects)
			{
				if (mesh.castShadows)
				{
					this.shadowShader.setMat4("uModel", mesh.modelMatrix);
					context.bindVertexArray(mesh.vao);
					context.drawElements(context.TRIANGLES, mesh.indexCount, context.UNSIGNED_SHORT, 0);
					context.bindVertexArray(null);
				}
			}
			
			this.shadowShader.unbind();
			context.cullFace(context.BACK);
			
			context.bindFramebuffer(context.FRAMEBUFFER, null);
			context.viewport(0, 0, context.canvas.width, context.canvas.height);
		}
		
			context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
			
		let activeShader = null;

		const sorted = [...scene.objects].sort((a, b) => {
			if (a.shader === b.shader)
			{
				return 0;
			}

			return a.shader < b.shader ? -1 : 1;
		});

		for (const mesh of scene.objects)
		{
			const shader = mesh.shader;
			
			if (!shader)
			{
				continue;
			}

			if (shader !== activeShader)
			{
				if (activeShader) activeShader.unbind();
				shader.bind();
				activeShader = shader;

				shader.setMat4("uView", camera.viewMatrix);
				shader.setMat4("uProjection", camera.projectionMatrix);
				shader.setVec3("uAmbientLightColor", scene.ambientLightColor);

				// directional light + shadow map
				if (dirLight)
				{
					shader.setInt  ("uHasDirLight",        1);
					shader.setVec3 ("uDirLightDirection",  dirLight.direction);
					shader.setVec3 ("uDirLightColor",      dirLight.color);
					shader.setFloat("uDirLightIntensity",  dirLight.intensity);
					shader.setMat4 ("uLightSpaceMatrix",   dirLight.lightSpaceMatrix);

					this.shadowMap.bindForReading(1); // unit 1
					shader.setInt("uShadowMap", 1);
				}
				else
				{
					shader.setInt("uHasDirLight", 0);
				}

				// Point lights
				const lights = scene.lights;
				shader.setInt("uLightCount", lights.length);

				for (let i = 0; i < lights.length; i++)
				{
					const l = lights[i];
					const prefix = `uLights[${i}]`;

					shader.setVec3 (`${prefix}.position`, l.position);
					shader.setVec3 (`${prefix}.color`, l.color);
					shader.setFloat(`${prefix}.intensity`, l.intensity);
					shader.setFloat(`${prefix}.radius`, l.radius);
				}
			}

			shader.setMat4("uModel", mesh.modelMatrix);
			shader.setVec3("uObjectColor", mesh.color);

			if (mesh.texture)
			{
				mesh.texture.bind(0);
				shader.setInt("uTexture", 0);
				shader.setInt("uHasTexture", 1);
			}
			else
			{
				shader.setInt("uHasTexture", 0);
			}

			context.bindVertexArray(mesh.vao);
			context.drawElements(context.TRIANGLES, mesh.indexCount, context.UNSIGNED_SHORT, 0);
			context.bindVertexArray(null);

			if (mesh.texture)
			{
				mesh.texture.unbind(0);
			}
		}

		if (activeShader)
		{
			activeShader.unbind();
		}
	}
}