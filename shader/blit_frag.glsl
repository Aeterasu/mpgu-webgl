#version 300 es
precision mediump float;

uniform sampler2D uScreen;

in vec2 vUV;
out vec4 fragColor;

void main()
{
	fragColor = texture(uScreen, vUV);
}