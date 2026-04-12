export class Texture
{
    constructor(context)
    {
        this.context = context;
        this.texture = context.createTexture();
    }

    static async fromUrl(context, url)
    {
        const texture = new Texture(context);

        const image = await new Promise((resolve, reject) =>
        {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
            img.src = url;
        });

        texture.upload(image);
        return texture;
    }

    upload(image)
    {
        const context = this.context;

        context.bindTexture(context.TEXTURE_2D, this.texture);

        context.texImage2D(
            context.TEXTURE_2D,
            0, // mip level
            context.RGBA, // internal format
            context.RGBA, // source format
            context.UNSIGNED_BYTE, // source type
            image // the actual image data
        );

        context.generateMipmap(context.TEXTURE_2D);

        // sampling
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);

        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.REPEAT);

        context.bindTexture(context.TEXTURE_2D, null);
    }

    bind(unit = 0)
    {
        const context = this.context;
        context.activeTexture(context.TEXTURE0 + unit);
        context.bindTexture(context.TEXTURE_2D, this.texture);
    }

    unbind(unit = 0)
    {
        const context = this.context;
        context.activeTexture(context.TEXTURE0 + unit);
        context.bindTexture(context.TEXTURE_2D, null);
    }

    destroy()
    {
        this.context.deleteTexture(this.texture);
    }
}