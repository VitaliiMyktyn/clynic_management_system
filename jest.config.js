module.exports = {
	testEnvironment: "node", // Вказуємо, що тести виконуватимуться в середовищі Node.js
	testRegex: "(/tests/.*\\.(test|spec))\\.js$", // Патерн для знаходження файлів тестів
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy", // Для обробки імпортів CSS
	},
	setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"], // Файл для попереднього налаштування тестового середовища
	transform: {
		"^.+\\.jsx?$": "babel-jest",
	},
	// Додайте інші налаштування Jest, які вам потрібні
};
