import React from "@rbxts/react";
import { RemProvider } from "client/providers/rem-provider";

import { SupportFooter } from "./support-footer";
import { SupportPremium } from "./support-premium";
import { SupportProducts } from "./support-products";

export function Support() {
	return (
		<>
			<RemProvider minimumRem={0}>
				<SupportProducts />
			</RemProvider>

			<SupportFooter />
			<SupportPremium />
		</>
	);
}
