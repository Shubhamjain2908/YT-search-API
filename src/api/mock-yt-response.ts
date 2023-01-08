import { faker } from "@faker-js/faker";
import { SearchVideoResult } from "../models/dto/search-video";
import { VideoDetails } from "../models/dto/video-details";

const mockSearchResult = async (): Promise<SearchVideoResult> => {
	return Promise.resolve({
		items: [
			{
				id: {
					videoId: faker.git.shortSha(),
				},
			},
			{
				id: {
					videoId: faker.git.shortSha(),
				},
			},
			{
				id: {
					videoId: faker.git.shortSha(),
				},
			},
			{
				id: {
					videoId: faker.git.shortSha(),
				},
			},
			{
				id: {
					videoId: faker.git.shortSha(),
				},
			},
		],
	});
};

const mockVideoDetailResult = async (
	videoId: string
): Promise<VideoDetails> => {
	return Promise.resolve({
		items: [
			{
				snippet: {
					videoId,
					publishedAt: faker.date.recent(),
					title: faker.company.catchPhrase(),
					description:
						faker.company.catchPhraseDescriptor() + faker.lorem.sentence(),
					thumbnails: {
						default: {
							url: faker.image.sports(),
						},
						medium: {
							url: faker.image.business(),
						},
						high: {
							url: faker.image.animals(),
						},
					},
				},
			},
		],
	});
};

export { mockSearchResult, mockVideoDetailResult };
