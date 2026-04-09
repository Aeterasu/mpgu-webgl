export class Player
{
    constructor(canvas)
    {
        this.canvas = canvas;

        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];

        this.moveSpeed = 8.0;
        this.mouseSensitivity = 0.002;

        this.forward = false;
        this.backward = false;
        this.pointerLocked = false;

        this.initInput();
    }

    initInput()
    {
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button === 0)
            {
                this.forward = true;
            }
            if (e.button === 2)
            {
                this.backward = true;
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (e.button === 0)
            {
                this.forward = false;
            }
            if (e.button === 2)
            {
                this.backward = false;
            }
        });

        // not too fond of context menus
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

        // pointer lock
        this.canvas.addEventListener("click", () => {
            this.canvas.requestPointerLock();
        });

        document.addEventListener("pointerlockchange", () => {
            this.pointerLocked = document.pointerLockElement === this.canvas;
        });

        document.addEventListener("mousemove", (e) => {
            if (!this.pointerLocked)
            {
                return;
            }

            const dx = e.movementX;
            const dy = e.movementY;

            this.rotation[1] += dx * this.mouseSensitivity;
            this.rotation[0] -= dy * this.mouseSensitivity;

            // clamp pitch to avoid flipping
            const maxPitch = Math.PI / 2 - 0.01;
            this.rotation[0] = Math.max(-maxPitch, Math.min(maxPitch, this.rotation[0]));
        });
    }

    update(deltaTime)
    {
        const dir = this.getForwardVector();
    
        if (this.forward)
        {
            this.position[0] += dir[0] * this.moveSpeed * deltaTime;
            //this.position[1] += dir[1] * this.moveSpeed * deltaTime;
            this.position[2] += dir[2] * this.moveSpeed * deltaTime;
        }

        if (this.backward)
        {
            this.position[0] -= dir[0] * this.moveSpeed * deltaTime;
            //this.position[1] -= dir[1] * this.moveSpeed * deltaTime;
            this.position[2] -= dir[2] * this.moveSpeed * deltaTime;
        }
    }

    getForwardVector()
    {
        const pitch = this.rotation[0];
        const yaw = this.rotation[1];

        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);

        return [
            cosPitch * sinYaw,
            sinPitch,
            cosPitch * cosYaw * -1
        ];
    }
}