import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { spring } from "@rbxts/ripple";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useMotion } from "client/app/hooks";
import { springs } from "client/app/utils/springs";
import { selectIsMenuOpen } from "client/store/menu";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

export function MenuVignette() {
	const open = useSelector(selectIsMenuOpen);
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		if (open) {
			transitionMotion.to(spring(1, springs.molasses));
		} else {
			transitionMotion.to(spring(0, springs.molasses));
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
