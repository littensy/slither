import { useBindingListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { Portal, useEffect, useMemo, useState } from "@rbxts/roact";
import { CanvasGroup, CanvasGroupProps } from "./canvas-group";
import { Frame } from "./frame";
import { Group } from "./group";

type CanvasOrFrameProps = CanvasGroupProps & {
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

	const [renderMode, setRenderMode] = useState<"canvas" | "frame">("canvas");
	const [visible, setVisible] = useState(true);
	const [frame, frameRef] = useState<Frame>();
	const [canvas, canvasRef] = useState<CanvasGroup>();

	const container = useMemo(() => {
		const container = new Instance("Frame");
		container.Size = new UDim2(1, 0, 1, 0);
		container.BackgroundTransparency = 1;
		return container;
	}, []);

	useBindingListener(props.groupTransparency, (t = 0) => {
		setRenderMode(t > EPSILON ? "canvas" : "frame");
		setVisible(t < 1);
	});

	useEffect(() => {
		container.Parent = renderMode === "canvas" ? canvas : frame;
	}, [renderMode, canvas, frame]);

	useUnmountEffect(() => {
		container.Destroy();
	});

	return (
		<Group>
			<Portal target={container}>{props.children}</Portal>

			<CanvasGroup {...propsWithoutChildren} visible={visible} ref={canvasRef}>
				{props.directChildren}
			</CanvasGroup>

			<Frame {...propsWithoutChildren} visible={visible} ref={frameRef}>
				{props.directChildren}
			</Frame>
		</Group>
	);
}
