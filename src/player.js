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
		this.left = false;
		this.right = false;
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

		document.addEventListener("keydown", (e) => {
			if (e.code === "KeyW")
			{
				this.forward = true;
			}
			if (e.code === "KeyS")
			{
				this.backward = true;
			}
			if (e.code === "KeyA")
			{
				this.left = true;
			}
			if (e.code === "KeyD")
			{
				this.right = true;
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.code === "KeyW")
			{
				this.forward = false;
			}
			if (e.code === "KeyS")
			{
				this.backward = false;
			}
			if (e.code === "KeyA")
			{
				this.left = false;
			}
			if (e.code === "KeyD")
			{
				this.right = false;
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
		const forward = this.getForwardVector();
		const right = this.getRightVector();

		let moveX = 0;
		let moveZ = 0;

		if (this.forward)
		{
			moveX += forward[0];
			moveZ += forward[2];
		}

		if (this.backward)
		{
			moveX -= forward[0];
			moveZ -= forward[2];
		}

		if (this.left)
		{
			moveX -= right[0];
			moveZ -= right[2];
		}

		if (this.right)
		{
			moveX += right[0];
			moveZ += right[2];
		}

		const length = Math.hypot(moveX, moveZ);
		if (length > 0)
		{
			moveX /= length;
			moveZ /= length;
		}

		this.position[0] += moveX * this.moveSpeed * deltaTime;
		this.position[2] += moveZ * this.moveSpeed * deltaTime;
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

	getRightVector()
	{
		const yaw = this.rotation[1];

		const cosYaw = Math.cos(yaw);
		const sinYaw = Math.sin(yaw);

		return [
			cosYaw,
			0,
			sinYaw
		];
	}
}