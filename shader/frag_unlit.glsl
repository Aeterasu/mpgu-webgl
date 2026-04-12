#version 300 es
precision mediump float;

#define MAX_LIGHTS 16

struct PointLight
{
    vec3 position;
    vec3 color;
    float intensity;
    float radius;
};

uniform PointLight uLights[MAX_LIGHTS];
uniform int uLightCount;

uniform vec3 uObjectColor;
uniform vec3 uAmbientLightColor;

uniform sampler2D uTexture;
uniform int uHasTexture;

in vec3 vNormal;
in vec3 vWorldPos;
in vec2 vUV;

out vec4 fragColor;

void main()
{
    vec3 result = uHasTexture == 1
        ? texture(uTexture, vUV).rgb * uObjectColor
        : uObjectColor;

    fragColor = vec4(result, 1.0);
}