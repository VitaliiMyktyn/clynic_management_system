// adminAuth.test.js
const request = require("supertest");
const app = require("./server");

describe("Admin authorization", () => {
	test("Successful login", async () => {
		const response = await request(app)
			.post("/admin/login")
			.send({ password: "adminPassword" }); // Припустимо, що пароль правильний

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
	});

	test("Failed login", async () => {
		const response = await request(app)
			.post("/admin/login")
			.send({ password: "wrongPassword" });

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(false);
	});
});
