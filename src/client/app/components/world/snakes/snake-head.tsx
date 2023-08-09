import { spring } from "@rbxts/ripple";
import Roact, { useEffect, useMemo, useState } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { Group } from "client/app/common/group";
import { Image } from "client/app/common/image";
import { useContinuousAngle, useMotion, useRem } from "client/app/hooks";
import { springs } from "client/app/utils/springs";
import { images } from "shared/assets";
import { getSnakeSkin, getSnakeTracerSkin } from "shared/data/skins";
import { subtractRadians } from "shared/utils/math-utils";
import { SNAKE_ANGLE_OFFSET } from "./constants";
import { SnakeEffectBinding, SnakeLineBinding } from "./use-snake-bindings";
import { useTracerStyle } from "./use-tracer-style";

interface SnakeHeadProps extends Roact.PropsWithChildren {
	readonly angle: number;
	readonly desiredAngle: number;
	readonly line: SnakeLineBinding;
	readonly effects: SnakeEffectBinding;
	readonly skinId: string;
	readonly offsetSmooth: Roact.Binding<Vector2>;
	readonly isSubject: boolean;
}

export function SnakeHead({
	angle,
	desiredAngle,
	line,
	effects,
	skinId,
	offsetSmooth,
	isSubject,
	children,
}: SnakeHeadProps) {
	const skin = getSnakeSkin(skinId);
	const tracerSkin = getSnakeTracerSkin(skinId, 0);

	const rem = useRem();
	const currentAngle = useContinuousAngle(angle);
	const angleDifference = useContinuousAngle(subtractRadians(desiredAngle, currentAngle));
	const style = useTracerStyle(line, effects, 0, tracerSkin.tint);

	const [isSubjectDelayed, setIsSubjectDelayed] = useState(false);
	const [rotation, rotationMotion] = useMotion(math.deg(currentAngle + SNAKE_ANGLE_OFFSET));
	const [look, lookMotion] = useMotion(0);

	const { size, position } = useMemo(() => {
		const size = line.map(({ diameter }) => {
			return new UDim2(0, rem(diameter), 0, rem(diameter));
		});

		// if this is the subject, we calculate the position based
		// on the actual offset because there is a slight desync
		const position = isSubjectDelayed
			? offsetSmooth.map(({ X, Y }) => new UDim2(0, rem(-X), 0, rem(-Y)))
			: line.map(({ fromX, fromY }) => new UDim2(0, rem(fromX), 0, rem(fromY)));

		return { size, position };
	}, [rem, isSubjectDelayed]);

	useEffect(() => {
		rotationMotion.spring(math.deg(currentAngle + SNAKE_ANGLE_OFFSET), springs.world);
		lookMotion.spring(math.deg(angleDifference));
	}, [currentAngle, angleDifference]);

	useEffect(() => {
		// wait a while if setting a new subject to avoid centering
		// the head before the camera is done moving
		return setTimeout(
			() => {
				setIsSubjectDelayed(isSubject);
			},
			isSubject ? 1 : 0,
		);
	}, [isSubject]);

	return (
		<Group anchorPoint={new Vector2(0.5, 0.5)} size={size} position={position}>
			<Image
				key="head"
				image={tracerSkin.texture}
				imageColor={style.color}
				imageTransparency={style.transparency}
				scaleType="Slice"
				sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
				sliceScale={4}
				size={new UDim2(1, 0, 1, 0)}
				rotation={rotation}
			>
				<Image
					key="eye-right"
					image={images.skins.snake_eye_right}
					imageTransparency={style.transparency}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
					rotation={look}
				/>

				<Image
					key="eye-left"
					image={images.skins.snake_eye_left}
					imageTransparency={style.transparency}
					anchorPoint={new Vector2(1, 0)}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
					rotation={look}
				/>
			</Image>

			{children}
		</Group>
	);
}
