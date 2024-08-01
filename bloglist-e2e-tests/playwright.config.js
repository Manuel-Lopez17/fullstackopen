const { defineConfig, devices } = require('@playwright/test');
const { spawn } = require('child_process');
const mongoose = require('mongoose');

let backendProcess;

module.exports = defineConfig({
	projects: [
		{
			name: 'e2e',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],
	globalSetup: async () => {
		// Set NODE_ENV to test
		process.env.NODE_ENV = 'test';

		// Connect to MongoDB
		try {
			await mongoose.connect('mongodb://localhost:27017/bloglist_test');
			console.log('Connected to MongoDB for tests');
		} catch (error) {
			console.error('Error connecting to MongoDB:', error.message);
			throw error;
		}

		// Start backend server
		backendProcess = spawn('npm', ['run', 'start:test'], { stdio: 'inherit', shell: true });

		// Wait for the backend server to be ready
		await new Promise((resolve) => setTimeout(resolve, 5000));
	},
	globalTeardown: async () => {
		// Close the MongoDB connection
		await mongoose.connection.close();

		// Stop backend server
		if (backendProcess) {
			backendProcess.kill();
		}
	},
});
