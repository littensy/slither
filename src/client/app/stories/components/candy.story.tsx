import { hoarcekat, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Backdrop } from "client/app/components/backdrop";
import { Candy } from "client/app/components/candy";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { getRandomAccent } from "shared/data/palette";

export = hoarcekat(() => {
	useMountEffect(() => {
		store.populateCandy(
			new Array(50, 0).map((_, index) => ({
				id: `${index}`,
				position: new Vector2(math.random(-50, 50), math.random(-25, 25)),
				size: math.random(1, 50),
				color: getRandomAccent(),
				type: "static",
			})),
		);
	});

	return (
		<RootProvider>
			<Backdrop />
			<Candy />
		</RootProvider>
	);
});
