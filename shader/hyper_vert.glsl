#version 300 es
precision mediump float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform int uJitter;
uniform float uJitterResolution;

uniform float uTime;

out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec3 vWorldEye;

vec4 snapToGrid(vec4 clipPos, float resolution)
{
    vec2 ndc = clipPos.xy / clipPos.w;
    vec2 snapped = floor(ndc * resolution + 0.5) / resolution;
    return vec4(snapped * clipPos.w, clipPos.zw);
}

void main()
{
    vec4 worldPos = uModel * vec4(aPosition, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = mat3(transpose(inverse(uModel))) * aNormal;

    vWorldEye = (inverse(uView) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    vec4 clipPos = uProjection * uView * worldPos;

    if (uJitter == 1)
    {
        clipPos = snapToGrid(clipPos, uJitterResolution);
    }

    gl_Position = clipPos;
}