import { Spring, lerpBinding, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { selectIsMenuOpen } from "client/store/menu";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

export function MenuVignette() {
	const open = useSelector(selectIsMenuOpen);
	const [transition, setTransition] = useMotor(0);

	useEffect(() => {
		if (open) {
			setTransition(new Spring(1, { frequency: 0.5 }));
		} else {
			setTransition(new Spring(0, { frequency: 0.5 }));
		}
	}, [open]);

	return (
		<Image
			image={images.ui.vignette}
			imageColor={palette.black}
			imageTransparency={lerpBinding(transition, 1, 0)}
			backgroundColor={palette.black}
			backgroundTransparency={lerpBinding(transition, 1, 0.8)}
			scaleType="Crop"
			size={new UDim2(1, 0, 1, 0)}
		/>
	);
}
