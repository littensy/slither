import Object from "@rbxts/object-utils";
import { map, useCamera, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useMemo } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { Image } from "client/components/ui/image";
import { useSeed } from "client/hooks";
import { images } from "shared/assets";
import { accents } from "shared/constants/palette";

interface BackdropBallProps {
	readonly smoothOffset: React.Binding<Vector2>;
}

/**
 * Constrains a value within a range by applying a modulo operation.
 */
function mod(value: number, min: number, max: number) {
	const range = max - min;
	return ((value - min) % range) + min;
}

export function BackdropBall({ smoothOffset }: BackdropBallProps) {
	const camera = useCamera();
	const seed = useSeed();
	const [timer, setTimer] = useBinding(0);

	const color = useMemo(() => {
		const colors = Object.values(accents);
		return colors[math.random(0, colors.size() - 1)];
	}, []);

	const style = useMemo(() => {
		const position = timer.map((t) => {
			const aspectRatio = camera.ViewportSize.X / camera.ViewportSize.Y;
			const offset = smoothOffset.getValue();

			const noiseX = map(math.noise(t, seed), -0.5, 0.5, -3, 4);
			const noiseY = map(math.noise(seed, t + 100), -0.5, 0.5, -3, 4);

			const x = mod(noiseX + 0.02 * offset.X, -1, 2);
			const y = mod(noiseY + 0.02 * offset.Y * aspectRatio, -1, 2);

			return new UDim2(x, 0, y, 0);
		});

		const size = timer.map((t) => {
			const diameter = map(math.noise(t + 100, seed), -0.5, 0.5, 1, 2);
			return new UDim2(diameter, 0, diameter, 0);
		});

		const transparency = timer.map((t) => {
			return map(math.noise(5 * t + 200, seed), -0.5, 0.5, 0.3, 0.8);
		});

		return { position, size, transparency };
	}, []);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		setTimer(timer.getValue() + 0.01 * deltaTime);
	});

	return (
		<Image
			image={images.ui.blur}
			imageColor={color}
			imageTransparency={style.transparency}
			scaleType="Fit"
			anchorPoint={new Vector2(0.5, 0.5)}
			size={style.size}
			position={style.position}
		/>
	);
}
