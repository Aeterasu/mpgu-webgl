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

        for (const mesh of scene.objects)
        {
            shader.setMat4("uModel", mesh.modelMatrix);

            context.bindVertexArray(mesh.vao);
            context.drawElements(context.TRIANGLES, mesh.indexCount, context.UNSIGNED_SHORT, 0);
            context.bindVertexArray(null);
        }

        shader.unbind();        
    }
}