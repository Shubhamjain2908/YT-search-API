import express, { Request, Response } from "express";
import { Video } from "../models/video";
const router = express.Router();

router.get("/videos/search", async (req: Request, res: Response) => {
	try {
		let query = "";
		if (req.query.q) {
			query = req.query.q + "";
		}
		let page = 1;
		if (req.query.page) {
			page = parseInt(req.query.page + "");
		}
		let limit = 10;
		if (req.query.limit) {
			limit = parseInt(req.query.limit + "");
		}
		const videos = await Video.find({
			$text: { $search: query },
		})
			.sort({ publishedAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		res.json({
			videos,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

export { router as searchVideoRouter };
