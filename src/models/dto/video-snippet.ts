interface VideoSnippet {
	videoId: string;
	publishedAt: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
}

interface Thumbnails {
	default: Default;
	medium: Default;
	high: Default;
}

interface Default {
	url: string;
}

export { VideoSnippet };
