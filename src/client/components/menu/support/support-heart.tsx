import { lerpBinding, useInterval } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { setTimeout } from "@rbxts/set-timeout";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useMotion, useRem } from "client/hooks";
import { images } from "shared/assets";

export function SupportHeart() {
	const rem = useRem();
	const [transition, transitionMotion] = useMotion(0);
	const [pulse, pulseMotion] = useMotion(0);

	const impulse = () => {
		transitionMotion.impulse(-0.02);

		setTimeout(() => {
			transitionMotion.impulse(0.05);
			pulseMotion.set(0);
			pulseMotion.spring(1, springs.molasses);
		}, 0.3);
	};

	useInterval(() => {
		impulse();
	}, 1.5);

	useEffect(() => {
		// set initial goal for impulse
		transitionMotion.spring(0, springs.gentle);
	}, []);

	return (
		<>
			<Image
				image={images.ui.heart_glow}
				imageTransparency={lerpBinding(transition, 0.5, 0)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(16), 0, rem(16))}
				position={new UDim2(0.5, 0, 0.5, 0)}
			/>

			<Image
				image={images.ui.heart_glow}
				imageTransparency={lerpBinding(pulse, 0, 1)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={lerpBinding(pulse, new UDim2(0, rem(6), 0, rem(6)), new UDim2(0, rem(28), 0, rem(28)))}
				position={new UDim2(0.5, 0, 0.5, 0)}
			/>

			<Image
				image={images.ui.heart}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={lerpBinding(transition, new UDim2(0, rem(16), 0, rem(16)), new UDim2(0, rem(18), 0, rem(18)))}
				position={new UDim2(0.5, 0, 0.5, 0)}
			/>
		</>
	);
}
