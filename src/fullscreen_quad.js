export class FullscreenQuad
{
	context;
	vao;
	vbo;

	constructor(gl)
	{
		this.context = gl;
		this.setup();
	}

	setup()
	{
		const context = this.context;

		const vertices = new Float32Array([
			-1, -1,  0, 0,
			 1, -1,  1, 0,
			 1,  1,  1, 1,
			-1, -1,  0, 0,
			 1,  1,  1, 1,
			-1,  1,  0, 1,
		]);

		this.vao = context.createVertexArray();
		this.vbo = context.createBuffer();

		context.bindVertexArray(this.vao);
		context.bindBuffer(context.ARRAY_BUFFER, this.vbo);
		context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

		const stride = 4 * 4;

		// slot 0: position - 2 floats
		context.vertexAttribPointer(0, 2, context.FLOAT, false, stride, 0);
		context.enableVertexAttribArray(0);

		// slot 1: uv - 2 floats
		context.vertexAttribPointer(1, 2, context.FLOAT, false, stride, 2 * 4);
		context.enableVertexAttribArray(1);

		context.bindVertexArray(null);
	}

	draw()
	{
		this.context.bindVertexArray(this.vao);
		this.context.drawArrays(this.context.TRIANGLES, 0, 6);
		this.context.bindVertexArray(null);
	}

	destroy()
	{
		this.context.deleteVertexArray(this.vao);
		this.context.deleteBuffer(this.vbo);
	}
}