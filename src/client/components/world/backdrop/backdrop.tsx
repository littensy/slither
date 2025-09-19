import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useSpring } from "client/hooks";
import { selectWorldCamera } from "client/store/world";
import { images } from "shared/assets";
import { fillArray } from "shared/utils/object-utils";

import { BackdropBall } from "./backdrop-ball";

export function Backdrop() {
	const world = useSelector(selectWorldCamera);
	const [smoothOffset, smoothOffsetSpring] = useSpring(world.offset);

	useEffect(() => {
		smoothOffsetSpring.setGoal(world.offset, springs.world);
	}, [world.offset]);

	return (
		<Image image={images.ui.backdrop} size={new UDim2(1, 0, 1, 0)}>
			{fillArray(20, (index) => (
				<BackdropBall key={`ball-${index}`} smoothOffset={smoothOffset} />
			))}
		</Image>
	);
}
