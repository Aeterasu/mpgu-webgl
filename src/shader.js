export class Shader 
{
    context;
    program;
    uniformCache = {};

    constructor(context, vertSrc, fragSrc) 
    {
        this.context = context;
        this.program = this.compile(vertSrc, fragSrc);
    }

    compile(vertSrc, fragSrc)
    {
        const context = this.context;

        const vert = this.compileShader(context.VERTEX_SHADER, vertSrc);
        const frag = this.compileShader(context.FRAGMENT_SHADER, fragSrc);

        const program = context.createProgram();
        context.attachShader(program, vert);
        context.attachShader(program, frag);
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS))
        {
            throw new Error("Shader program link fail: " + context.getProgramInfoLog(program));
        }

        context.deleteShader(vert);
        context.deleteShader(frag);

        return program;
    }

    compileShader(type, src)
    {
        const context = this.context;
        const shader = context.createShader(type);

        context.shaderSource(shader, src);
        context.compileShader(shader);

        if (!context.getShaderParameter(shader, context.COMPILE_STATUS))
        {
            throw new Error("Shader compile fail: " + context.getShaderInfoLog(shader));
        }

        return shader;
    }

    bind()
    { 
        this.context.useProgram(this.program);
    }

    unbind()
    { 
        this.context.useProgram(null);
    }

    setUniformMatrix4fv(name, matrix) 
    {
        const loc = this.context.getUniformLocation(this.program, name);
        this.context.uniformMatrix4fv(loc, false, matrix);
    }

    destroy()
    { 
        this.context.deleteProgram(this.program);
    }

    locateUniform(name)
    {
        if (!(name in this.uniformCache))
        {
            this.uniformCache[name] = this.context.getUniformLocation(this.program, name);
        }

        return this.uniformCache[name];
    }

    setMat4(name, matrix)
    {
        this.context.uniformMatrix4fv(this.locateUniform(name), false, matrix);
    }

    setInt(name, value)
    {
        this.context.uniform1i(this.locateUniform(name), value);
    }

    setFloat(name, value)
    {
        this.context.uniform1f(this.locateUniform(name), value);
    }

    setVec3(name, value)
    {
        this.context.uniform3fv(this.locateUniform(name), value);
    }
}