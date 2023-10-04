import Roact from "@rbxts/roact";
import { Image } from "client/common/image";
import { images } from "shared/assets";
import { fillArray } from "shared/utils/object-utils";

import { BackdropBall } from "./backdrop-ball";

export function Backdrop() {
	return (
		<Image image={images.ui.backdrop} size={new UDim2(1, 0, 1, 0)}>
			{fillArray(20, (index) => (
				<BackdropBall key={`ball-${index}`} />
			))}
		</Image>
	);
}
