import { lerpBinding, useViewport } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Group } from "client/components/ui/group";
import { Image } from "client/components/ui/image";
import { Text } from "client/components/ui/text";
import { useRem, useSpring } from "client/hooks";
import { selectSnakeFromWorldSubject } from "client/store/world";
import { images } from "shared/assets";

import { useLeader } from "./utils";

const ANGLE_FIX = math.rad(-90);
const MIN_RANGE = 20;

export function Compass() {
	const rem = useRem();
	const viewport = useViewport();
	const leader = useLeader();
	const subject = useSelector(selectSnakeFromWorldSubject);

	const [displacement, displacementSpring] = useSpring(new Vector2());
	const [visible, visibleSpring] = useSpring(0);

	const style = useMemo(() => {
		const rotation = displacement.map((vector) => {
			return math.deg(math.atan2(vector.Y, vector.X) - ANGLE_FIX);
		});

		const position = composeBindings(displacement, viewport, (vector, bounds) => {
			const angle = math.atan2(vector.Y, vector.X) + ANGLE_FIX;
			const directionX = math.sin(angle) * bounds.Magnitude * -0.5;
			const directionY = math.cos(angle) * bounds.Magnitude * 0.5;

			return UDim2.fromScale(
				math.clamp(directionX / bounds.X + 0.5, 0, 1),
				math.clamp(directionY / bounds.Y + 0.5, 0, 1),
			);
		});

		return { rotation, position };
	}, []);

	useEffect(() => {
		if (subject && leader && subject !== leader) {
			displacementSpring.setGoal(leader.head.sub(subject.head));

			if (leader.head.sub(subject.head).Magnitude > MIN_RANGE) {
				visibleSpring.setGoal(1);
				return;
			}
		}

		visibleSpring.setGoal(0);
	}, [subject, leader]);

	return (
		<Group>
			<uipadding
				PaddingTop={new UDim(0, rem(6))}
				PaddingBottom={new UDim(0, rem(6))}
				PaddingLeft={new UDim(0, rem(6))}
				PaddingRight={new UDim(0, rem(6))}
			/>

			<Group anchorPoint={new Vector2(0.5, 0.5)} size={new UDim2(0, rem(6), 0, rem(6))} position={style.position}>
				<Text
					text="👑"
					textSize={rem(3)}
					textTransparency={lerpBinding(visible, 1, 0)}
					size={new UDim2(1, 0, 1, 0)}
				/>

				<Group rotation={style.rotation}>
					<Image
						image={images.ui.leader_pointer}
						imageTransparency={lerpBinding(visible, 1, 0)}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={new UDim2(0, rem(1.5), 0, rem(1.5))}
						position={new UDim2(0.5, 0, 0, 0)}
					/>
				</Group>
			</Group>
		</Group>
	);
}
