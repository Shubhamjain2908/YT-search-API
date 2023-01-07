import mongoose from "mongoose";

interface Url {
	url: string;
}

interface Thumbnails {
	default: Url;
	medium: Url;
	high: Url;
}

interface VideoAttrs {
	title: string;
	description: string;
	publishedAt: Date;
	thumbnails: Thumbnails;
}

interface VideoDoc extends mongoose.Document {
	title: string;
	description: string;
	publishedAt: Date;
	thumbnails: Thumbnails;
}

interface VideoModel extends mongoose.Model<VideoDoc> {
	build(attrs: VideoAttrs): VideoDoc;
}

const videoSchema = new mongoose.Schema(
	{
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
			required: true,
		},
		createdAt: {
			type: mongoose.Schema.Types.Date,
		},
		updatedAt: {
			type: mongoose.Schema.Types.Date,
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

videoSchema.statics.build = (attrs: VideoAttrs) => {
	return new Video(attrs);
};

const Video = mongoose.model<VideoDoc, VideoModel>("Video", videoSchema);

export { Video, VideoDoc };
