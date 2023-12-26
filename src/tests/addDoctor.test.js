// addDoctor.test.js
const request = require("supertest");
const app = require("./server"); // Припустимо, що ваш серверний файл названий server.js

describe("Doctor registration", () => {
	test("Register a new doctor", async () => {
		const response = await request(app).post("/admin/doctors").send({
			full_name: "Dr. New Doctor",
			specialization: "Pediatrics",
		});

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.full_name).toBe("Dr. New Doctor");
	});

	test("Attempt to register a duplicate doctor", async () => {
		const response = await request(app).post("/admin/doctors").send({
			full_name: "Dr. Existing Doctor",
			specialization: "Surgery",
		});

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.error).toBe(
			"Doctor with the same name already exists."
		);
	});
});
