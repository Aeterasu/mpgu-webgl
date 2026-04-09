#version 300 es
precision mediump float;

in vec3 vNormal;
in vec3 vWorldPos;

uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uObjectColor;

out vec4 fragColor;

void main()
{
    // ambient - baseline light so nothing is pure black
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * uLightColor;

    // diffuse dot product between normal and light direction
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vWorldPos);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;

    vec3 result = (ambient + diffuse) * uObjectColor;
    fragColor = vec4(result, 1.0);
}