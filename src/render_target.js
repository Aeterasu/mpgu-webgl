export class RenderTarget
{
	context;
	fbo;
	colorTexture;
	depthBuffer;

	width;
	height;

	constructor(gl, width, height)
	{
		this.context = gl;
		this.width = width;
		this.height = height;

		this.setup();
	}

	setup()
	{
		const context = this.context;

		// Color texture — this is what the scene gets rendered into
		this.colorTexture = context.createTexture();
		context.bindTexture(context.TEXTURE_2D, this.colorTexture);
		context.texImage2D(
			context.TEXTURE_2D, 0, context.RGBA,
			this.width, this.height,
			0, context.RGBA, context.UNSIGNED_BYTE, null
		);

		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
		context.bindTexture(context.TEXTURE_2D, null);

		this.depthBuffer = context.createRenderbuffer();
		context.bindRenderbuffer(context.RENDERBUFFER, this.depthBuffer);
		context.renderbufferStorage(
			context.RENDERBUFFER, context.DEPTH_COMPONENT16,
			this.width, this.height
		);

		context.bindRenderbuffer(context.RENDERBUFFER, null);

		this.fbo = context.createFramebuffer();
		context.bindFramebuffer(context.FRAMEBUFFER, this.fbo);
		context.framebufferTexture2D(
			context.FRAMEBUFFER, context.COLOR_ATTACHMENT0,
			context.TEXTURE_2D, this.colorTexture, 0
		);

		context.framebufferRenderbuffer(
			context.FRAMEBUFFER, context.DEPTH_ATTACHMENT,
			context.RENDERBUFFER, this.depthBuffer
		);

		if (context.checkFramebufferStatus(context.FRAMEBUFFER) !== context.FRAMEBUFFER_COMPLETE)
		{
			throw new Error("RenderTarget framebuffer failure");
		}

		context.bindFramebuffer(context.FRAMEBUFFER, null);
	}

	bindForWriting()
	{
		const context = this.context;
		context.bindFramebuffer(context.FRAMEBUFFER, this.fbo);
		context.viewport(0, 0, this.width, this.height);
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
	}

	bindColorForReading(unit = 0)
	{
		const context = this.context;
		context.activeTexture(context.TEXTURE0 + unit);
		context.bindTexture(context.TEXTURE_2D, this.colorTexture);
	}

	destroy()
	{
		const context = this.context;
		context.deleteTexture(this.colorTexture);
		context.deleteRenderbuffer(this.depthBuffer);
		context.deleteFramebuffer(this.fbo);
	}
}