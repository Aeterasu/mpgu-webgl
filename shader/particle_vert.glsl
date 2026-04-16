#version 300 es
precision mediump float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aVelocity;
layout(location = 2) in float aLifetime;
layout(location = 3) in float aMaxLife;

uniform mat4 uView;
uniform mat4 uProjection;
uniform float uPointSize;

out float vAlpha;
out float vGradientOffset;

void main()
{
    float t  = aLifetime / aMaxLife; // 0 = just spawned, 1 = about to die
    vAlpha = 1.0 - t; // fade out over lifetime

    vGradientOffset += t;

    if (vGradientOffset > 1.0)
    {
        vGradientOffset = 0.0;
    }

    gl_Position = uProjection * uView * vec4(aPosition, 1.0);
    gl_PointSize = uPointSize * (1.0 - t * 0.5); // shrink over time
}