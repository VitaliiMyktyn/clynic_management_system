// appointmentBooking.test.js
const request = require("supertest");
const app = require("./server");

describe("Appointment booking", () => {
	test("Book an appointment", async () => {
		const response = await request(app).post("/api/appointments").send({
			first_name: "John",
			last_name: "Doe",
			middle_name: "M",
			date_of_birth: "1990-01-01",
			email_address: "john.doe@example.com",
			address: "123 Main St",
			insurance_number: "ABC123",
			phone_number: "1234567890",
			doctor_id: 1,
			appointment_date: "2023-12-20",
			appointment_time: "10:00:00",
		});

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
	});

	test("No available appointments", async () => {
		const response = await request(app)
			.get("/api/appointments/availableTimes")
			.query({ doctor_id: 1, date: "2023-12-22" });

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(0);
	});
});
