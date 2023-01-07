import mongoose from "mongoose";
import cron from "node-cron";
import { searchVideos } from "./api/fetch-yt-api";
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
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB!!!");
	} catch (err) {
		console.error("Startup error => ", err);
	}

	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`YT Service: Listening on port ${port}!`);
	});

	// Call the searchVideos function continuously in the background with a 10 second interval
	cron.schedule("*/10 * * * * *", searchVideos);
};

start();
