import axios from "axios";
import { SearchVideoResult } from "../models/dto/search-video";
import { VideoDetails } from "../models/dto/video-details";
import { VideoSnippet } from "../models/dto/video-snippet";
import { Video, VideoDoc } from "../models/video";

const searchQuery = "songs";

const searchVideos = async (): Promise<void> => {
	console.log("Fetching videos....");
	try {
		const {
			data: { items },
		} = await axios.get<SearchVideoResult>(
			"https://www.googleapis.com/youtube/v3/search",
			{
				params: {
					key: process.env.API_KEY,
					type: "video",
					order: "date",
					publishedAfter: new Date(),
					q: searchQuery,
				},
			}
		);
		const videos: Array<string> = items.map((v) => v.id.videoId);

		console.log(videos);

		await getVideoDetailsAndSaveToDB(videos);
	} catch (error) {
		console.error("Error occurred while searching for videos", error);
	}
};

const getVideoDetailsAndSaveToDB = async (
	videoIds: Array<string>
): Promise<void> => {
	console.log("Fetching video details....");
	try {
		const videoDetails: Array<VideoSnippet[]> = await Promise.all(
			videoIds.map(async (videoId: string) => {
				try {
					const {
						data: { items },
					} = await axios.get<VideoDetails>(
						"https://www.googleapis.com/youtube/v3/videos",
						{
							params: {
								key: process.env.API_KEY,
								part: "snippet",
								id: videoId,
							},
						}
					);
					return items.map((v) => {
						const snippet = v.snippet;
						return {
							videoId: videoId,
							title: snippet.title,
							description: snippet.description,
							publishedAt: snippet.publishedAt,
							thumbnails: snippet.thumbnails,
						};
					});
				} catch (error: any) {
					console.error(
						`Error occurred while fetching video details for: ${videoId}`,
						error.response?.data
					);
					return [];
				}
			})
		);

		// Save the retrieved videos to the database
		const videoModel = videoDetails
			.flatMap((v) => v)
			.map((v) => Video.build(v));

		saveVideosInDB(videoModel);
	} catch (error: any) {
		console.error("Error occurred while fetching all videos", error);
	}
};

const saveVideosInDB = (videoModel: Array<VideoDoc>) => {
	console.log("Saving video in DB....", videoModel);

	// upserting all records on the bases of videoId
	const bulkOps = videoModel.map((update) => ({
		updateOne: {
			filter: { videoId: update.videoId },
			// Where field is the field you want to update
			update: {
				$set: {
					description: update.description,
					title: update.title,
					publishedAt: update.publishedAt,
					thumbnails: update.thumbnails,
				},
			},
			upsert: true,
		},
	}));

	Video.collection
		.bulkWrite(bulkOps)
		.then((results) => console.log(results))
		.catch((err) => console.log(err));
};

export { searchVideos };
