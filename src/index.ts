import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
	console.log("YT service starting...");

	if (!process.env.API_KEY) {
		throw new Error("API_KEY must be defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}
	if (!process.env.REDIS_URI) {
		throw new Error("REDIS_URI must be defined");
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB!!!");
	} catch (err) {
		console.error("Startup error => ", err);
	}

	app.listen(3000, () => {
		console.log("YT Service: Listening on port 3000!");
	});
};

start();
