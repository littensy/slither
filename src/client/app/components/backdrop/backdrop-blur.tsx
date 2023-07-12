import Object from "@rbxts/object-utils";
import { map, useCamera, useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useBinding, useMemo, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { Image } from "client/app/common/image";
import { selectWorldCamera } from "client/store/world";
import { images } from "shared/assets";
import { accents } from "shared/data/palette";

const SEED = 100 * math.random();

/**
 * Constrains a value within a range by applying a modulo operation.
 */
function mod(value: number, min: number, max: number) {
	const range = max - min;
	return ((value - min) % range) + min;
}

export function BackdropBlur() {
	const camera = useCamera();
	const world = useSelector(selectWorldCamera);
	const offset = useRef(world.offset);
	const [timer, setTimer] = useBinding(-100 * math.random());

	const color = useMemo(() => {
		const colors = Object.values(accents);
		return colors[math.random(0, colors.size() - 1)];
	}, []);

	const style = useMemo(() => {
		const position = timer.map((t) => {
			const aspectRatio = camera.ViewportSize.X / camera.ViewportSize.Y;

			const noiseX = map(math.noise(t, SEED), -0.5, 0.5, -3, 4);
			const noiseY = map(math.noise(SEED, t + 100), -0.5, 0.5, -3, 4);

			const x = mod(noiseX + 0.02 * offset.current.X, -1, 2);
			const y = mod(noiseY + 0.02 * offset.current.Y * aspectRatio, -1, 2);

			return new UDim2(x, 0, y, 0);
		});

		const size = timer.map((t) => {
			const diameter = map(math.noise(t + 100, SEED), -0.5, 0.5, 1.25, 2.5);
			return new UDim2(diameter, 0, diameter, 0);
		});

		const rotation = timer.map((t) => {
			return map(math.noise(5 * t - 100, SEED), -0.5, 0.5, -360, 360);
		});

		const transparency = timer.map((t) => {
			return map(math.noise(t + 200, SEED), -0.5, 0.5, 0.3, 0.6);
		});

		return { position, size, rotation, transparency };
	}, []);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		setTimer(timer.getValue() + 0.01 * deltaTime);
		offset.current = offset.current.Lerp(world.offset, 1 - math.exp(-deltaTime * 10));
	});

	return (
		<Image
			image={images.common.blur}
			imageColor={color}
			imageTransparency={style.transparency}
			scaleType="Fit"
			anchorPoint={new Vector2(0.5, 0.5)}
			size={style.size}
			position={style.position}
			rotation={style.rotation}
		/>
	);
}
