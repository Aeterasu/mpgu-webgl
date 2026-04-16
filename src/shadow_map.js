export class ShadowMap
{
    context;
    fbo;
    depthTexture;

    width = 1024;
    height = 1024;

    constructor(context, width = 1024, height = 1024)
    {
        this.context = context;
        this.width = width;
        this.height = height;

        this.setup();
    }

    setup()
    {
        this.depthTexture = this.context.createTexture();
        this.context.bindTexture(this.context.TEXTURE_2D, this.depthTexture);

        this.context.texImage2D(
            this.context.TEXTURE_2D,
            0,
            this.context.DEPTH_COMPONENT32F, // 32-bit float depth
            this.width,
            this.height,
            0,
            this.context.DEPTH_COMPONENT,
            this.context.FLOAT,
            null
        );

        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);

        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);

        this.context.bindTexture(this.context.TEXTURE_2D, null);

        this.fbo = this.context.createFramebuffer();
        this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.fbo);
        this.context.framebufferTexture2D(
            this.context.FRAMEBUFFER,
            this.context.DEPTH_ATTACHMENT,
            this.context.TEXTURE_2D,
            this.depthTexture,
            0
        );

        // explicitly tell webgl we're not writing color here
        this.context.drawBuffers([this.context.NONE]);
        this.context.readBuffer(this.context.NONE);

        if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) !== this.context.FRAMEBUFFER_COMPLETE)
        {
            throw new Error("Shadow map framebuffer incomplete");
        }

        this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
    }

    bindForWriting()
    {
        this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.fbo);
        this.context.viewport(0, 0, this.width, this.height);
        this.context.clear(this.context.DEPTH_BUFFER_BIT);
    }

    unbindForWriting()
    {
        this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
    }

    bindForReading(unit = 1)
    {
        this.context.activeTexture(this.context.TEXTURE0 + unit);
        this.context.bindTexture(this.context.TEXTURE_2D, this.depthTexture);
    }

    destroy()
    {
        this.context.deleteTexture(this.depthTexture);
        this.context.deleteFramebuffer(this.fbo);
    }
}