import bodyParser, { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middleware/error-handler";
import { searchVideoRouter } from "./routes/search";
import { showVideoRouter } from "./routes/videos";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test", // Must be on https connection except on test env
	})
);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(showVideoRouter);
app.use(searchVideoRouter);

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
