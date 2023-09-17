import { MarketplaceService } from "@rbxts/services";
import { runOnce } from "shared/utils/run-once";

export type ProductTag = (typeof tags)[keyof typeof tags];

const tags = {
	"💛 $100": "money_100",
	"❤️ $250": "money_250",
	"💚 $500": "money_500",
	"💙 $1,000": "money_1000",
	"💜 $5,000": "money_5000",
} as const;

export const getProducts = runOnce(async () => {
	const byName = await getAllProducts();
	const byTag = {} as Record<ProductTag, number>;

	for (const [name, id] of byName) {
		const tag = tags[name as never] as ProductTag | undefined;

		if (tag !== undefined) {
			byTag[tag] = id;
		} else {
			warn(`No tag found for product ${name}`);
		}
	}

	return byTag;
});

export async function getProductId(tag: ProductTag) {
	const products = await getProducts();
	const product = products[tag];

	if (product === undefined) {
		throw `No product found for tag ${tag}`;
	}

	return product;
}

export async function getProductTag(id: number) {
	const products = await getProducts();

	for (const [tag, product] of pairs(products)) {
		if (product === id) {
			return tag as ProductTag;
		}
	}

	throw `No product found for id ${id}`;
}

async function getAllProducts() {
	const pages = MarketplaceService.GetDeveloperProductsAsync();
	const products = new Map<string, number>();

	do {
		for (const product of pages.GetCurrentPage()) {
			products.set(product.Name, product.ProductId);
		}

		if (!pages.IsFinished) {
			pages.AdvanceToNextPageAsync();
		}
	} while (!pages.IsFinished);

	return products;
}
