import Roact from "@rbxts/roact";
import { RemProvider } from "client/app/providers/rem-provider";

import { SupportFooter } from "./support-footer";
import { SupportProducts } from "./support-products";
import { SupportPremium } from "./support-premium";

export function Support() {
	return (
		<>
			<RemProvider key="rem-override" minimumRem={0}>
				<SupportProducts key="products" />
			</RemProvider>

			<SupportFooter key="footer" />
			<SupportPremium key="premium" />
		</>
	);
}
