import { Linear, Spring, useMotor, useProperty } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { setInterval } from "@rbxts/set-timeout";
import { useRem } from "client/app/hooks";
import { Text, TextProps } from "./text";

interface TextTruncatedProps extends TextProps {}

const GRADIENT = new NumberSequence([
	new NumberSequenceKeypoint(0, 0),
	new NumberSequenceKeypoint(0.75, 0),
	new NumberSequenceKeypoint(1, 1),
]);

export function TextTruncated(props: TextTruncatedProps) {
	const textProps = { ...props, children: undefined };

	const rem = useRem();
	const [bounds = Vector2.one, size = Vector2.one, change] = useProperty("TextBounds", "AbsoluteSize");
	const [offset, setOffset] = useMotor(0);

	const distance = size.X - bounds.X - 2 * rem;

	useEffect(() => {
		setOffset(new Spring(0));

		if (bounds.X < size.X + rem) {
			return;
		}

		let toggle = false;

		return setInterval(() => {
			toggle = !toggle;

			if (toggle) {
				setOffset(new Linear(distance, { velocity: 5 * rem }));
			} else {
				setOffset(new Linear(0, { velocity: 5 * rem }));
			}
		}, 5);
	}, [bounds, size, rem]);

	return (
		<Text {...textProps} clipsDescendants change={{ ...props.change, ...change }}>
			<uigradient key="truncate-gradient" Transparency={GRADIENT} />
			<uipadding key="truncate-offset" PaddingLeft={offset.map((x) => new UDim(0, math.round(x)))} />
			{props.children}
		</Text>
	);
}
