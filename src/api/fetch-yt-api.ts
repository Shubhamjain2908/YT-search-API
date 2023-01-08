import { Item, SearchVideoResult } from "../models/dto/search-video";
import { VideoDetails, VideoSnippetItem } from "../models/dto/video-details";
import { VideoSnippet } from "../models/dto/video-snippet";
import { Video, VideoDoc } from "../models/video";
import { mockSearchResult, mockVideoDetailResult } from "./mock-yt-response";
import { callAPI } from "./rate-limit";

const searchQuery = process.env.SEARCH_QUERY || "songs";
const useMockResponseYT = process.env.USE_MOCK === "true";

const searchVideos = async (): Promise<void> => {
	console.log("Fetching videos....");
	let items: Array<any> = await getSearchVideoItems();
	const videos: Array<string> = items.map((v) => v.id.videoId);
	console.log(videos);
	await getVideoDetailsAndSaveToDB(videos);
};

const getSearchVideoItems = async (): Promise<Array<Item>> => {
	let items: Array<Item>;
	if (!useMockResponseYT) {
		const data = await callAPI<SearchVideoResult>(
			"https://www.googleapis.com/youtube/v3/search",
			{
				type: "video",
				order: "date",
				publishedAfter: new Date(),
				q: searchQuery,
			}
		);
		items = data.items;
	} else {
		const result = await mockSearchResult();
		items = result.items;
	}
	return items;
};

const getVideoDetailsAndSaveToDB = async (
	videoIds: Array<string>
): Promise<void> => {
	console.log("Fetching video details....");

	const videoDetails: Array<VideoSnippet[]> = await Promise.all(
		videoIds.map(async (videoId: string) => {
			const items = await getVideoDetailItems(videoId);
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
		})
	);

	// Save the retrieved videos to the database
	const videoModel = videoDetails.flatMap((v) => v).map((v) => Video.build(v));

	if (!videoModel.length) {
		console.log("No video found");
		return;
	}

	saveVideosInDB(videoModel);
};

const getVideoDetailItems = async (
	videoId: string
): Promise<Array<VideoSnippetItem>> => {
	let items: Array<VideoSnippetItem>;
	if (!useMockResponseYT) {
		const data = await callAPI<VideoDetails>(
			"https://www.googleapis.com/youtube/v3/videos",
			{
				part: "snippet",
				id: videoId,
			}
		);
		items = data.items;
	} else {
		const result = await mockVideoDetailResult(videoId);
		items = result.items;
	}
	return items;
};

const saveVideosInDB = (videoModel: Array<VideoDoc>): void => {
	console.log("Saving video in DB....", videoModel);
	try {
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
	} catch (error) {
		console.error("Some error occurred while saving data in DB: ", error);
	}
};

export { searchVideos };
