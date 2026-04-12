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

in vec3 vNormal;
in vec3 vWorldPos;

out vec4 fragColor;

vec3 calcPointLight(PointLight light, vec3 normal, vec3 fragPos)
{
    vec3 toLight = light.position - fragPos;
    float dist = length(toLight);
    vec3 lightDir = normalize(toLight);

    float attenuation = clamp(1.0 - (dist / light.radius), 0.0, 1.0);
    attenuation = attenuation * attenuation;

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * light.color * light.intensity;

    return diffuse * attenuation;
}

void main()
{
    vec3 normal = normalize(vNormal);

    vec3 result = uAmbientLightColor * uObjectColor;

    for (int i = 0; i < uLightCount; i++)
    {
        result += calcPointLight(uLights[i], normal, vWorldPos) * uObjectColor;
    }

    fragColor = vec4(result, 1.0);
}