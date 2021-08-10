export default class SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables (Convention: all instance variables: mVariables)
        this.mCompiledShader = null;
        // reference to the compiled shader in webgl context
        this.mShaderVertexPositionAttribute = null;
        // reference to SquareVertexPosition in shader
        /**
         * @type {WebGLRenderingContext}
         */
        let gl = GameEngine.Core.getGL();
        // start of constructor code
        //
        // Step A: load and compile vertex and fragment shaders
        let vertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
        let fragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = gl.createProgram();
        gl.attachShader(this.mCompiledShader, vertexShader);
        gl.attachShader(this.mCompiledShader, fragmentShader);
        gl.linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) throw new Error('Error linking shader');
        // Step D: Gets a reference to the aSquareVertexPosition attribute
        this.mShaderVertexPositionAttribute = gl.getAttribLocation(this.mCompiledShader, 'aSquareVertexPosition');

        // Step E: Activates the vertex buffer loaded in Engine.Core_VertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, GameEngine.VertexBuffer.getGLVertexRef());

        /// Step F: Describe the characteristic of the vertex position attribute
        gl.vertexAttribPointer(
            this.mShaderVertexPositionAttribute,
            3, // each element is a 3-float (x,y.z)
            gl.FLOAT, // data type is FLOAT
            false, // if the content is normalized vectors
            0, // number of bytes to skip in between elements
            0,
        ); // offsets to the first element
        // Step G: Gets a reference to the uniform variable uPixelColor in the //     fragment shader
        this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, 'u_pixelColor');
        this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, 'uModelTransform');
        this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, 'uViewProjTransform');
    }

    /**
     * Returns a complied shader from a shader in the dom.
     * @param {string} filePath
     * @param {string} shaderType
     * @returns
     */
    _compileShader(filePath, shaderType) {
        let gl = GameEngine.Core.getGL();
        let shaderSource = GameEngine.ResourceMap.retrieveAsset(filePath);

        let compiledShader = gl.createShader(shaderType);

        // Step C: Compile the created shader
        gl.shaderSource(compiledShader, shaderSource);
        gl.compileShader(compiledShader);

        // Step D: check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
            throw new Error('A shader compiling error occurred: ' + gl.getShaderInfoLog(compiledShader));
        } else return compiledShader;
    }
    activateShader(pixelColor, vpMatrix) {
        let gl = GameEngine.Core.getGL();
        gl.useProgram(this.mCompiledShader);
        gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
        console.log(this.mPixelColor);
        gl.uniform4fv(this.mPixelColor, pixelColor);
        gl.uniformMatrix4fv(this.mViewProjTransform, false, vpMatrix);
    }
    getShader() {
        return this.mCompiledShader;
    }
}
// Loads per-object model transform to the vertex shader
SimpleShader.prototype.loadObjectTransform = function (modelTransform) {
    var gl = GameEngine.Core.getGL();
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};
