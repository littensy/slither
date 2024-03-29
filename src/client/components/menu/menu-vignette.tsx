import { lerpBinding } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useMotion } from "client/hooks";
import { selectIsMenuOpen } from "client/store/menu";
import { images } from "shared/assets";
import { palette } from "shared/constants/palette";

export function MenuVignette() {
	const open = useSelector(selectIsMenuOpen);
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		if (open) {
			transitionMotion.spring(1, springs.molasses);
		} else {
			transitionMotion.spring(0, springs.molasses);
		}
	}, [open]);

	return (
		<Image
			image={images.ui.vignette}
			imageColor={palette.crust}
			imageTransparency={lerpBinding(transition, 1, 0)}
			backgroundColor={palette.crust}
			backgroundTransparency={lerpBinding(transition, 1, 0.8)}
			scaleType="Crop"
			size={new UDim2(1, 0, 1, 0)}
		/>
	);
}
