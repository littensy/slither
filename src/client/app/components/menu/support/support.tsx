import Roact from "@rbxts/roact";
import { useOrientation } from "client/app/hooks";
import { RemProvider } from "client/app/providers/rem-provider";

import { SupportFooter } from "./support-footer";
import { SupportProducts } from "./support-products";

export function Support() {
	const orientation = useOrientation();

	return (
		<>
			<RemProvider key="rem-override" minimumRem={0}>
				<SupportProducts key="products" />
			</RemProvider>

			<SupportFooter key="footer" />
		</>
	);
}
