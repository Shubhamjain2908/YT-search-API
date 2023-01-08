import { VideoSnippet } from "./video-snippet";

interface VideoDetails {
	items: Array<VideoSnippetItem>;
}

interface VideoSnippetItem {
	snippet: VideoSnippet;
}

export { VideoDetails, VideoSnippetItem };
