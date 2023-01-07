import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test", // Must be on https connection except on test env
	})
);

app.all("*", async () => {
	throw new NotFoundError();
});

export { app };
