// deleteDoctor.test.js
const request = require("supertest");
const app = require("./server");

describe("Doctor deletion", () => {
	test("Delete a doctor", async () => {
		const response = await request(app)
			.delete("/admin/doctors")
			.send({ doctorIds: [1, 2, 3] }); // Припустимо, що ці ідентифікатори існують

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveLength(3);
	});
});
