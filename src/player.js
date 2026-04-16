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
		this.up = false;
		this.down = false;

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
			if (e.code === "Space")
			{
				this.up = true;
			}
			if (e.code === "ShiftLeft")
			{
				this.down = true;
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
			if (e.code === "Space")
			{
				this.up = false;
			}
			if (e.code === "ShiftLeft")
			{
				this.down = false;
			}
		});

		this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

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

			const maxPitch = Math.PI / 2 - 0.01;
			this.rotation[0] = Math.max(-maxPitch, Math.min(maxPitch, this.rotation[0]));
		});
	}

	update(deltaTime)
	{
		const forward = this.getForwardVector();
		const right = this.getRightVector();

		let move = [0, 0, 0];

		if (this.forward)
		{
			move[0] += forward[0];
			move[1] += forward[1];
			move[2] += forward[2];
		}

		if (this.backward)
		{
			move[0] -= forward[0];
			move[1] -= forward[1];
			move[2] -= forward[2];
		}

		if (this.left)
		{
			move[0] -= right[0];
			move[1] -= right[1];
			move[2] -= right[2];
		}

		if (this.right)
		{
			move[0] += right[0];
			move[1] += right[1];
			move[2] += right[2];
		}

		if (this.up)
		{
			move[1] += 1;
		}

		if (this.down)
		{
			move[1] -= 1;
		}

		const length = Math.hypot(move[0], move[1], move[2]);
		if (length > 0)
		{
			move[0] /= length;
			move[1] /= length;
			move[2] /= length;
		}

		this.position[0] += move[0] * this.moveSpeed * deltaTime;
		this.position[1] += move[1] * this.moveSpeed * deltaTime;
		this.position[2] += move[2] * this.moveSpeed * deltaTime;
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