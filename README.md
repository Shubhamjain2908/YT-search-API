# YT-search-API

YouTube Video Search API

This is a Node.js + Express + TypeScript + Mongoose + Redis + Axios that allows you to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

The api's are written in [NodeJS](https://nodejs.org/en/).

### Prerequisites

a) Node.js (version 12 or higher)
b) NPM (version 6 or higher)
c) Docker & docker compose (optional, for running the app in a container)
d) MongoDB (mongoose client)

### Installation

a) Clone the repository:

- git clone https://github.com/your-username/youtube-video-search-api.git
- cd youtube-video-search-api
- npm i
- docker compose up

```bash
Set up the environment variables for the server.
Create a file called .env in the root directory of the project or if you are using docker then add the following variables in `docker-compose.yml`
  - NODE_ENV=dev
  - PORT=8080 # choose any port
  - API_KEY=someAPIKey,otherAPIKey,oneMoreAPIKey # added support for multiple keys. You need to generate your API key from [here](https://developers.google.com/youtube/v3/getting-started)
  - MONGO_URI=mongodb://mongo:27017/app
  - SEARCH_QUERY=songs # search query
  - USE_MOCK=false
```

## API documentation

**A) Get Top videos API (Cached) -**

```bash
URL - /videos?page=1&limit=10 (GET)
```

This API will return the list of top 10 stories (ranked by score).

**Response** -

```json
{
	"videos": [
		{
			"videoId": "7198ajkasmdk",
			"title": "React tutorial",
			"description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
			"publishedAt": 1597396352,
			"thumbnails": {
				"default": {
					"url": "https://picsum.photos/200/300"
				}
			}
		}
	]
}
```

_Cached - This API is cached & refresh every time there are some changes in top videos_

**b) search API -**

```bash
URL - /videos/search?page=1&limit=10&q=react (GET)
```

This API will return videos on the bases of search query from our DB.

**Response** -

```json
{
	"videos": [
		{
			"videoId": "7198ajkasmdk",
			"title": "React tutorial",
			"description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
			"publishedAt": 1597396352,
			"thumbnails": {
				"default": {
					"url": "https://picsum.photos/200/300"
				}
			}
		}
	]
}
```
