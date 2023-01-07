import express, { Request, Response } from "express";
import { Video } from "../models/video";
const router = express.Router();

router.get("/videos/search", async (req: Request, res: Response) => {
	try {
		let query = "";
		if (req.query.q) {
			query = req.query.q + "";
		}
		const videos = await Video.find({
			$or: [
				{ title: new RegExp(query, "i") },
				{ description: new RegExp(query, "i") },
			],
		});

		res.json({
			videos,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

export { router as searchVideoRouter };
