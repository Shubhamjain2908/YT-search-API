import axios from "axios";
import cron from "node-cron";
import { ResourceExhaustedError } from "../errors/resource-exhausted-error";
import { SearchVideoResult } from "../models/dto/search-video";

const API_KEY = process.env.API_KEY?.split(",");
const API_KEYS_MAP = new Map<string, number>();

const createKeyMap = () => {
	// creating key-map
	if (API_KEY) {
		API_KEY?.forEach((key) => {
			API_KEYS_MAP.set(key, 0);
		});
	}
};

createKeyMap();

const searchVideos2 = async (): Promise<void> => {
	console.log("Fetching videos....");
	let items: Array<any>;
	// if (!"useMockResponseYT") {
	const data = await callAPI<SearchVideoResult>(
		"https://www.googleapis.com/youtube/v3/search",
		{
			type: "video",
			order: "date",
			publishedAfter: new Date(),
			q: "searchQuery",
		},
		new Map(API_KEYS_MAP)
	);
	items = data.items;
};

const callAPI = async <T>(
	url: string,
	params: any,
	apiKeysMap?: Map<string, number>
): Promise<T> => {
	let apiKeys = new Map();
	if (!apiKeysMap) {
		apiKeys = new Map(API_KEYS_MAP);
	} else {
		apiKeys = new Map(apiKeysMap);
	}
	console.log("inside callAPI", apiKeys, !apiKeys.size);
	if (!apiKeys.size) {
		throw new ResourceExhaustedError();
	}

	let entity = getMinUsedKeys(apiKeys);
	const key = entity[0];
	const value = entity[1];
	apiKeys.set(key, value + 1);

	try {
		console.log("Calling api from key: ", key);
		const { data } = await axios.get<T>(url, {
			params: {
				...params,
				key: key,
			},
		});
		return data;
	} catch (error: any) {
		console.log(error.response.status);
		// quota exhausted
		if (error.response.status === 400) {
			console.log("Quota exhausted for a key, retrying with other key");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			apiKeys.delete(key);
			return callAPI(url, params, apiKeys);
		} else {
			throw error;
		}
	}
};

const getMinUsedKeys = (keys: Map<string, number>): [string, number] => {
	let minKey = "";
	let minValue = Number.MAX_SAFE_INTEGER;
	for (let [key, value] of keys) {
		if (value < minValue) {
			minValue = value;
			minKey = key;
		}
	}
	// updating the global state
	API_KEYS_MAP.set(minKey, minValue + 1);
	return [minKey, minValue];
};

// rotate keys after every 24 hours
cron.schedule("* * 23 * * *", createKeyMap);

export { callAPI, searchVideos2 };
