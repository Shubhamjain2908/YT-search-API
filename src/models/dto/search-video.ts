interface SearchVideoResult {
	items: Array<Item>;
}

interface Item {
	id: ID;
}

interface ID {
	videoId: string;
}

export { SearchVideoResult, Item };
