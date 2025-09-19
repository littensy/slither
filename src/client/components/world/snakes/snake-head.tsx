import React, { useEffect, useMemo } from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { Group } from "client/components/ui/group";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useContinuousAngle, useRem, useSpring } from "client/hooks";
import { selectWorldInputAngle } from "client/store/world";
import { getSnakeSkin, getSnakeSkinForTracer } from "shared/constants/skins";
import { subtractRadians } from "shared/utils/math-utils";

import { SNAKE_ANGLE_OFFSET } from "./constants";
import { SnakeEffectBinding, SnakeLineBinding } from "./use-snake-bindings";
import { useTracerStyle } from "./use-tracer-style";

interface SnakeHeadProps extends React.PropsWithChildren {
	readonly angle: number;
	readonly desiredAngle: number;
	readonly line: SnakeLineBinding;
	readonly effects: SnakeEffectBinding;
	readonly skinId: string;
	readonly isClient: boolean;
}

export function SnakeHead({ angle, desiredAngle, line, effects, skinId, isClient, children }: SnakeHeadProps) {
	const inputAngle = useSelectorCreator(selectWorldInputAngle, isClient);

	if (isClient) {
		desiredAngle = inputAngle;
	}

	const skin = getSnakeSkin(skinId);
	const tracerSkin = getSnakeSkinForTracer(skinId, 0);

	const rem = useRem();
	const currentAngle = useContinuousAngle(angle);
	const angleDifference = useContinuousAngle(subtractRadians(desiredAngle, currentAngle));
	const style = useTracerStyle(line, effects, 0, skin.headColor || tracerSkin.tint);

	const [rotation, rotationSpring] = useSpring(math.deg(currentAngle + SNAKE_ANGLE_OFFSET));
	const [look, lookSpring] = useSpring(0);

	const { size, position } = useMemo(() => {
		const size = line.map(({ diameter }) => {
			return new UDim2(0, rem(diameter), 0, rem(diameter));
		});

		const position = line.map(({ toX, toY }) => {
			return new UDim2(0, rem(toX), 0, rem(toY));
		});

		return { size, position };
	}, [rem]);

	useEffect(() => {
		rotationSpring.setGoal(math.deg(currentAngle + SNAKE_ANGLE_OFFSET), springs.world);
		lookSpring.setGoal(math.deg(angleDifference));
	}, [currentAngle, angleDifference]);

	return (
		<Group anchorPoint={new Vector2(0.5, 0.5)} size={size} position={position}>
			<Image
				image={skin.headTexture ?? tracerSkin.texture}
				imageColor={style.color}
				imageTransparency={style.transparency}
				scaleType="Slice"
				sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
				sliceScale={4}
				size={new UDim2(1, 0, 1, 0)}
				rotation={rotation}
			>
				<Image
					image={skin.eyeTextureRight}
					imageTransparency={style.transparency}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
					rotation={look}
				/>

				<Image
					image={skin.eyeTextureLeft}
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
