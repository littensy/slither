import { MarketplaceService, Players } from "@rbxts/services";

type ProductHandler = (player: Player) => void;

const productHandlers = new Map<number, ProductHandler>();

export async function initProcessReceiptService() {
	MarketplaceService.ProcessReceipt = (receipt) => {
		const player = Players.GetPlayerByUserId(receipt.PlayerId);
		const handler = productHandlers.get(receipt.ProductId);

		if (!player || !handler) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const [success, message] = pcall(handler, player);

		if (!success) {
			warn(message);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	};
}

export function createProduct(id: number, handler: ProductHandler) {
	productHandlers.set(id, handler);
}
