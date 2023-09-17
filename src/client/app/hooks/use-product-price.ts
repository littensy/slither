import { useAsync } from "@rbxts/pretty-react-hooks";
import { MarketplaceService } from "@rbxts/services";

export function useProductPrice(productId: number) {
	const [info = "N/A"] = useAsync(() => {
		return Promise.retryWithDelay(
			async () => {
				return MarketplaceService.GetProductInfo(productId, Enum.InfoType.Product).PriceInRobux;
			},
			10,
			5,
		);
	});

	return info;
}
