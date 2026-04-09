import { Mesh } from "./mesh.js";

export class Cube extends Mesh 
{
	constructor(context) 
	{
		super(context);

		const vertices = 
		[
			// front face (normal 0 0 1)
			-0.5, -0.5, 0.5, 0, 0, 1,
			 0.5, -0.5, 0.5, 0, 0, 1,
			 0.5,  0.5, 0.5, 0, 0, 1,
			-0.5,  0.5, 0.5, 0, 0, 1,

			// back face (normal 0 0 -1)
			-0.5, -0.5, -0.5, 0, 0, -1,
			 0.5, -0.5, -0.5, 0, 0, -1,
			 0.5,  0.5, -0.5, 0, 0, -1,
			-0.5,  0.5, -0.5, 0, 0, -1,

			// left face (normal -1 0 0)
			-0.5, -0.5, -0.5, -1, 0, 0,
			-0.5, -0.5,  0.5, -1, 0, 0,
			-0.5,  0.5,  0.5, -1, 0, 0,
			-0.5,  0.5, -0.5, -1, 0, 0,

			// right face (normal 1 0 0)
			 0.5, -0.5, -0.5, 1, 0, 0,
			 0.5, -0.5,  0.5, 1, 0, 0,
			 0.5,  0.5,  0.5, 1, 0, 0,
			 0.5,  0.5, -0.5, 1, 0, 0,

			// top face (normal 0 1 0)
			-0.5,  0.5,  0.5, 0, 1, 0,
			 0.5,  0.5,  0.5, 0, 1, 0,
			 0.5,  0.5, -0.5, 0, 1, 0,
			-0.5,  0.5, -0.5, 0, 1, 0,

			// bottom face (normal 0 -1 0)
			-0.5, -0.5,  0.5, 0, 1, 0,
			 0.5, -0.5,  0.5, 0, 1, 0,
			 0.5, -0.5, -0.5, 0, 1, 0,
			-0.5, -0.5, -0.5, 0, 1, 0,
		];

		const indices = [];
		for (let face = 0; face < 6; face++)
		{
			const b = face * 4; // base index for this face
			indices.push(
				b, b+1, b+2,
				b, b+2, b+3
			);
		}
		
		this.upload(vertices, indices);
	}
}