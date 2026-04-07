class Shader
{
    constructor(context, vertex, fragment)
    {
        this.context = context
        this.vertex = vertex;
        this.fragment = fragment;
        this.program = this.initShaderProgram(context, vertex, fragment);
    }

    // Initialize a shader program, so WebGL knows how to draw our data
    initShaderProgram(gl, vsSource, fsSource) 
    {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
            alert(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
                )}`,
            );

            return null;
        }

        return shaderProgram;
    }

    // creates a shader of the given type, uploads the source and
    loadShader(gl, type, source) 
    {
        const shader = gl.createShader(type);

        // Send the source to the shader object
        gl.shaderSource(shader, source);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
        {
            alert(
                `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
            );

            gl.deleteShader(shader);

            return null;
        }

        return shader;
    }
}

export { Shader };