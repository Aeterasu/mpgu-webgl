#version 300 es
precision mediump float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aVelocity;
layout(location = 2) in float aLifetime;
layout(location = 3) in float aMaxLife;

out vec3 vPosition;
out vec3 vVelocity;
out float vLifetime;
out float vMaxLife;

uniform float uDeltaTime;
uniform vec3 uEmitterPosition;

float rand(float seed)
{
    return fract(sin(seed * 127.1 + 311.7) * 43758.5453);
}

void main()
{
    float life = aLifetime + uDeltaTime;

    if (life >= aMaxLife)
    {
        float seed = aPosition.x + aPosition.y * 13.7 + aMaxLife * 7.3 + life;

        vPosition = uEmitterPosition + vec3(
            -32.0 + rand(seed) * 64.0,
            rand(seed + 1.0) * 16.0,
            -32.0 +  rand(seed + 2.0) * 64.0
        );
        vVelocity = vec3(
            (rand(seed) - 0.5) * 15.0,
            (rand(seed + 10.0) - 0.5) * 15.0,
            (rand(seed + 20.0) - 0.5) * 15.0
        );
        vLifetime = 0.0;
        vMaxLife = aMaxLife;
    }
    else
    {
        vPosition = aPosition + aVelocity * uDeltaTime;
        vVelocity = aVelocity; // gravity
        vLifetime = life;
        vMaxLife  = aMaxLife;
    }
}