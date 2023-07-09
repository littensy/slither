import { mapBinding, useBindingState } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo, useState } from "@rbxts/roact";
import { CanvasGroup, CanvasGroupProps } from "./canvas-group";
import { Frame } from "./frame";
import { Group } from "./group";

type CanvasOrFrameProps = CanvasGroupProps & {
	ref?: Roact.RefPropertyOrFunction<Frame | CanvasGroup>;
	event?: Roact.JsxInstanceEvents<Frame | CanvasGroup>;
	change?: Roact.JsxInstanceChangeEvents<Frame | CanvasGroup>;
	directChildren?: Roact.Element;
};

const EPSILON = 0.03;

export function CanvasOrFrame(props: CanvasOrFrameProps) {
	const propsWithoutChildren = {
		...props,
		children: undefined,
	};

	const isCanvasBinding = useMemo(() => {
		return mapBinding(props.groupTransparency, (t = 0) => t > EPSILON);
	}, [props.groupTransparency]);

	const isCanvas = useBindingState(isCanvasBinding);

	const [canvas, canvasRef] = useState<CanvasGroup>();
	const [frame, frameRef] = useState<Frame>();

	const portalTarget = useMemo(() => {
		const frame = new Instance("Frame");
		frame.Name = "smart-canvas-target";
		frame.Size = UDim2.fromScale(1, 1);
		frame.BackgroundTransparency = 1;
		return frame;
	}, []);

	useEffect(() => {
		portalTarget.Parent = isCanvas ? canvas : frame;
	}, [isCanvas, canvas, frame]);

	useEffect(() => {
		return () => {
			portalTarget.Destroy();
		};
	}, []);

	return (
		<>
			<Roact.Portal target={portalTarget}>{props.children}</Roact.Portal>

			<Group>
				<CanvasGroup {...propsWithoutChildren} visible={isCanvas} ref={canvasRef}>
					{props.directChildren}
				</CanvasGroup>
				<Frame {...propsWithoutChildren} visible={!isCanvas} ref={frameRef}>
					{props.directChildren}
				</Frame>
			</Group>
		</>
	);
}
