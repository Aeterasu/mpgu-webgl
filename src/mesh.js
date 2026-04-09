import { mat4, vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";

export class Mesh 
{
	position = vec3.fromValues(0, 0, 0);
	rotation = vec3.fromValues(0, 0, 0);
	scale = vec3.fromValues(1, 1, 1);
	color = [1.0, 1.0, 1.0];
	
	#modelMatrix = mat4.create(); // identity

	constructor(context)
	{
		this.context = context;

		this.vao = context.createVertexArray(); // vertex array object
		this.vbo = context.createBuffer(); // vertex buffer object
		this.ebo = context.createBuffer(); // element buffer object

		this.indexCount = 0;
	}

	upload(vertices, indices)
	{
		const context = this.context;

		context.bindVertexArray(this.vao);

		context.bindBuffer(context.ARRAY_BUFFER, this.vbo);
		context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.DYNAMIC_DRAW);

		context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.ebo);
		context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.DYNAMIC_DRAW);

		const stride = 6 * 4; // 6 floats per vertex 4 bytes each

		// slot 0: position. 3 floats, starts at byte 0
		context.vertexAttribPointer(0, 3, context.FLOAT, false, stride, 0);
		context.enableVertexAttribArray(0);

		// slot 1: normal. 3 floats, starts at byte 12 after the 3 position floats
		context.vertexAttribPointer(1, 3, context.FLOAT, false, stride, 3 * 4);
		context.enableVertexAttribArray(1);

		context.bindVertexArray(null);

		this.indexCount = indices.length;
	}

	destroy() 
	{
		this.context.deleteVertexArray(this.vao);
		this.context.deleteBuffer(this.vbo);
		this.context.deleteBuffer(this.ebo);
	}

	get modelMatrix()
	{
		mat4.identity(this.#modelMatrix);
		mat4.translate(this.#modelMatrix, this.#modelMatrix, this.position);
		mat4.rotateX(this.#modelMatrix, this.#modelMatrix, this.rotation[0]);
		mat4.rotateY(this.#modelMatrix, this.#modelMatrix, this.rotation[1]);
		mat4.rotateZ(this.#modelMatrix, this.#modelMatrix, this.rotation[2]);
		mat4.scale(this.#modelMatrix, this.#modelMatrix, this.scale);
		return this.#modelMatrix;
	}
}