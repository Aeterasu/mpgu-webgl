#version 300 es
precision mediump float;

in float vAlpha;
in float vGradientOffset;
out vec4 fragColor;

void main()
{
    vec3 color1 = vec3(1.0, 0.0, 0.302);
    vec3 color2 = vec3(0.0, 0.894, 0.212);
    vec3 color3 = vec3(0.161, 0.678, 1.0);

    vec3 finalRGB;

    if (vGradientOffset < 0.5)
    {
        float t = vGradientOffset * 2.0; 
        finalRGB = mix(color1, color2, t);
    }
    else
    {
        float t = (vGradientOffset - 0.5) * 2.0;
        finalRGB = mix(color2, color3, t);
    }

    fragColor = vec4(finalRGB, vAlpha);
}