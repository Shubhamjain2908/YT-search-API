import mongoose from "mongoose";
import { VideoSnippet } from "./dto/video-snippet";
interface VideoDoc extends mongoose.Document {
	videoId: string;
	publishedAt: string;
	title: string;
	description: string;
	thumbnails: object;
}

interface VideoModel extends mongoose.Model<VideoDoc> {
	build(attrs: VideoSnippet): VideoDoc;
}

const videoSchema = new mongoose.Schema(
	{
		videoId: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		publishedAt: {
			type: String,
			required: true,
		},
		thumbnails: {
			type: Object,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				ret._id = undefined;
			},
		},
	}
);

videoSchema.statics.build = (attrs: VideoSnippet) => {
	return new Video(attrs);
};

const Video = mongoose.model<VideoDoc, VideoModel>("Video", videoSchema);

export { Video, VideoDoc };
