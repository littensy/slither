import Roact from "@rbxts/roact";
import { ActButton } from "./act-button";
import { SkinCarousel } from "./skin-carousel";

export function Skins() {
	return (
		<>
			<ActButton key="act-button" />
			<SkinCarousel key="carousel" />
		</>
	);
}
