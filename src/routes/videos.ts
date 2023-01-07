import express, { Request, Response } from "express";
import { Video } from "../models/video";
const router = express.Router();

router.get("/videos", async (req: Request, res: Response) => {
	try {
		let page = 1;
		if (req.query.page) {
			page = parseInt(req.query.page + "");
		}
		let limit = 10;
		if (req.query.limit) {
			limit = parseInt(req.query.limit + "");
		}
		const videos = await getVideosCollection(page, limit);
		res.send(videos);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

const getVideosCollection = async (page: number, limit: number) => {
	return await Video.find()
		.sort({ publishedAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);
};

export { router as showVideoRouter };
