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

uniform float uTime;
uniform vec3 uCameraPos;

uniform sampler2D uShadowMap;
uniform mat4 uLightSpaceMatrix;

uniform vec3 uDirLightDirection;
uniform vec3 uDirLightColor;
uniform float uDirLightIntensity;
uniform int uHasDirLight;

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

float calcShadow(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
{
    vec3 proj = fragPosLightSpace.xyz / fragPosLightSpace.w;

    proj = proj * 0.5 + 0.5;

    if (proj.z > 1.0)
    {
        return 0.0;
    }

    float closestDepth = texture(uShadowMap, proj.xy).r;
    float currentDepth = proj.z;

    // bias prevents shadow acne aka self-shadowing artifacts
    // steeper angle = more bias needed
    float bias = max(0.005 * (1.0 - dot(normal, lightDir)), 0.001);

    return currentDepth - bias > closestDepth ? 1.0 : 0.0;
}

void main()
{
    vec3 baseColor = uHasTexture == 1
        ? texture(uTexture, vUV).rgb * uObjectColor
        : uObjectColor;

    vec3 normal = normalize(vNormal);
    vec3 result = uAmbientLightColor * baseColor;

    for (int i = 0; i < uLightCount; i++)
    {
        result += calcPointLight(uLights[i], normal, vWorldPos) * baseColor;
    }

    if (uHasDirLight == 1)
    {
        vec3 lightDir = normalize(-uDirLightDirection);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diff * uDirLightColor * uDirLightIntensity;

        vec4 fragPosLightSpace = uLightSpaceMatrix * vec4(vWorldPos, 1.0);
        float shadow = calcShadow(fragPosLightSpace, normal, lightDir);

        result += (1.0 - shadow) * diffuse * baseColor;
    }

    fragColor = vec4(result, 1.0);
}