export const API_ENDPOINTS = {
	MENU: "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json",
	MENU_IMAGE(imageFileName) {
		return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;
	},
};

export const COLORS = {
	apple: { blue: "#007AFF" },
	brand: {
		green: "#495E57",
		yellow: "#F4CE14",
		coral: "#EE8872",
		lightHighlight: "#EDEFEE",
		darkHighlight: "#333333",
		neutralHighlight: "rgba(179,179,179,0.2)",
	},
};

const FONTS = {
	MARAKAZI: "Marakazi Text",
	KARLA: "Karla Regular",
};
export const brandFont = (textType = "default") => {
	switch (textType) {
		case "heading":
		case "sentence-styled":
		case "leading":
			return FONTS.MARAKAZI;
		default:
			return FONTS.KARLA;
	}
};

export const MENU_CATEGORIES = [
	"Starters",
	"Desserts",
	"Mains",
	"Drinks",
	"Chef's specials",
	"Sauces",
];

export const ORDER_STATES = {
	PENDING: 1,
	COOKING: 2,
	DELIVERED: 3,
};
