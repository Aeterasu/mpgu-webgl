#version 300 es
precision mediump float;

uniform vec3 uCameraPos;

uniform vec3  uBaseColor;

uniform vec3 uGradientBasis;
uniform vec3 uGradientBasisDistort;
uniform float uGradientBasisSpeed;

uniform float uRefractionSplit;
uniform float uRefractionSplitPower;
uniform float uRefractionAffect;

uniform float uTime;

in vec3 vWorldPos;
in vec3 vNormal;

out vec4 fragColor;

#define PI 3.14159265358979

void main()
{
    vec3 normal  = normalize(vNormal);
    vec3 lookDir = normalize(vWorldPos - uCameraPos);

    float lookDot = pow(
        abs(dot(lookDir, normal)),
        uRefractionSplitPower
    );

    vec3 reflectionDir = reflect(lookDir, normal);

    vec3 gradientDirection = uGradientBasis * reflectionDir;

    if (uGradientBasisDistort != vec3(0.0))
    {
        gradientDirection += sin(uGradientBasisDistort * PI * reflectionDir);
    }

    float gradient =
          gradientDirection.x
        + gradientDirection.y
        + gradientDirection.z
        + uGradientBasisSpeed * uTime;

    vec3 refraction = 0.5 + 0.5 * sin(
          vec3(-1.0, 0.0, 1.0)
        * (1.0 - lookDot)
        * uRefractionSplit
        + gradient
    );

    vec3 color = uBaseColor * (1.0 - refraction * uRefractionAffect);

    fragColor = vec4(color, 1.0);
}