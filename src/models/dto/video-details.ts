import { VideoSnippet } from "./video-snippet";

interface VideoDetails {
	items: Array<Video>;
}

interface Video {
	snippet: VideoSnippet;
}

export { VideoDetails };
