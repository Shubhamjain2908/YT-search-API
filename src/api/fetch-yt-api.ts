import axios from "axios";
import { SearchVideoResult } from "../models/dto/search-video";
import { VideoDetails } from "../models/dto/video-details";
import { VideoSnippet } from "../models/dto/video-snippet";
import { Video } from "../models/video";
const searchQuery = "songs";

const searchVideos = async (): Promise<void> => {
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

const getVideoDetailsAndSaveToDB = async (videoIds: Array<string>) => {
	try {
		const videoDetails: Array<VideoSnippet[]> = await Promise.all(
			videoIds.map(async (videoId: string) => {
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
						publishedAt: snippet.description,
						thumbnails: snippet.thumbnails,
					};
				});
			})
		);

		console.log(videoDetails);

		// Save the retrieved videos to the database
		const videoModel = videoDetails
			.flatMap((v) => v)
			.map((v) => Video.build(v));

		// upserting all records on the bases of videoId
		await Video.bulkWrite(
			videoModel.map((document) => {
				return {
					updateOne: {
						filter: { videoId: document.videoId }, //filter for videoId
						update: {
							$set: document, //update whole document
						},
						upsert: true, //upsert document
					},
				};
			})
		);
	} catch (error) {
		console.error("Error occurred while fetching video details", error);
	}
};

export { searchVideos };
