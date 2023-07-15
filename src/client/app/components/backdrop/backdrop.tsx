import Roact from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { images } from "shared/assets";
import { BackdropBlur } from "./backdrop-blur";

export function Backdrop() {
	return (
		<Image image={images.common.backdrop} size={new UDim2(1, 0, 1, 0)}>
			{new Array(20, <BackdropBlur />)}
		</Image>
	);
}
