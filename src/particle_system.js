export class ParticleSystem
{
    context;
    count;

    // two vaos and two buffers - ping pong between them
    vaos = [null, null];
    buffers = [null, null];

    transformFeedback = null;
    current = 0; // which buffer we're reading from this frame

    updateShader = null;
    renderShader = null;

    position = [0, 0, 0];
    pointSize = 1.0;

    constructor(context, count = 1000)
    {
        this.context = context;
        this.count = count;

        this.setup();
    }

    setup()
    {
        const context = this.context;
        const count = this.count;
        const floats = 8; // vec3 pos + vec3 vel + float life + float maxlife

        // initial data - randomize starting positions and lifetimes
        // so particles don't all spawn at once
        const data = new Float32Array(count * floats);
        for (let i = 0; i < count; i++)
        {
            const b = i * floats;
            data[b + 0] = -32.0 + Math.random() * 64.0; // pos x
            data[b + 1] = Math.random() * 16.0; // pos y
            data[b + 2] = -32.0 + Math.random() * 64.0; // pos z
            data[b + 3] = (Math.random() - 0.5) * 15.0; // vel x
            data[b + 4] = (Math.random() - 0.5) * 15.0; // vel y
            data[b + 5] = (Math.random() - 0.5) * 15.0; // vel z
            data[b + 6] = Math.random() * 1.0; // lifetime (staggered)
            data[b + 7] = 2.0 + Math.random() * 5.0;  // maxlife
        }

        for (let i = 0; i < 2; i++)
        {
            this.vaos[i] = context.createVertexArray();
            this.buffers[i] = context.createBuffer();

            context.bindVertexArray(this.vaos[i]);
            context.bindBuffer(context.ARRAY_BUFFER, this.buffers[i]);

            // only buffer 0 gets initial data — buffer 1 starts empty
            context.bufferData(context.ARRAY_BUFFER, i === 0 ? data : new Float32Array(count * floats), context.DYNAMIC_COPY);

            const stride = floats * 4;

            context.vertexAttribPointer(0, 3, context.FLOAT, false, stride, 0); // pos
            context.enableVertexAttribArray(0);
            context.vertexAttribPointer(1, 3, context.FLOAT, false, stride, 3 * 4); // vel
            context.enableVertexAttribArray(1);
            context.vertexAttribPointer(2, 1, context.FLOAT, false, stride, 6 * 4); // lifetime
            context.enableVertexAttribArray(2);
            context.vertexAttribPointer(3, 1, context.FLOAT, false, stride, 7 * 4); // maxlife
            context.enableVertexAttribArray(3);

            context.bindVertexArray(null);
            context.bindBuffer(context.ARRAY_BUFFER, null);
        }

        // transform feedback object - records which buffer to write into
        this.transformFeedback = context.createTransformFeedback();
    }

    update(deltaTime)
    {
        const context = this.context;
        const read = this.current;
        const write = 1 - this.current;

        this.updateShader.bind();
        this.updateShader.setFloat("uDeltaTime", deltaTime);
        this.updateShader.setVec3("uEmitterPosition", this.position);

        // bind the output buffer to the transform feedback
        context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, this.transformFeedback);
        context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this.buffers[write]);

        // disable rasterization - we only want the vertex shader to run
        context.enable(context.RASTERIZER_DISCARD);

        context.bindVertexArray(this.vaos[read]);

        context.beginTransformFeedback(context.POINTS);
        context.drawArrays(context.POINTS, 0, this.count);
        context.endTransformFeedback();

        context.bindVertexArray(null);

        // re-enable rasterization for the render pass
        context.disable(context.RASTERIZER_DISCARD);

        context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, null);

        this.updateShader.unbind();

        // swap - what we just wrote becomes what we read next frame
        this.current = write;
    }

    destroy()
    {
        const context = this.context;
        this.vaos.forEach(v => context.deleteVertexArray(v));
        this.buffers.forEach(b => context.deleteBuffer(b));
        context.deleteTransformFeedback(this.transformFeedback);
    }

    setCount(newCount)
    {
        if (newCount === this.count)
        {
            return;
        }

        const context = this.context;

        this.vaos.forEach(v => context.deleteVertexArray(v));
        this.buffers.forEach(b => context.deleteBuffer(b));

        this.current = 0;

        this.count = newCount;

        this.setup();
    }
}