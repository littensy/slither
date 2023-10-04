import { useBindingListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { Portal, useMemo, useState } from "@rbxts/roact";

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

	const [visible, setVisible] = useState(true);
	const [frame, frameRef] = useState<Frame>();
	const [canvas, canvasRef] = useState<CanvasGroup>();

	const container = useMemo(() => {
		const container = new Instance("Frame");
		container.Size = new UDim2(1, 0, 1, 0);
		container.BackgroundTransparency = 1;
		return container;
	}, []);

	const update = (renderMode: "canvas" | "frame") => {
		container.Parent = renderMode === "canvas" ? canvas : frame;

		if (canvas) {
			canvas.Visible = renderMode === "canvas";
		}
	};

	useBindingListener(props.groupTransparency, (t = 0) => {
		update(t > EPSILON ? "canvas" : "frame");
		setVisible(t < 1);
	});

	useUnmountEffect(() => {
		container.Destroy();
	});

	return (
		<Group>
			<Portal key="static-portal" target={container}>
				{props.children}
			</Portal>

			<CanvasGroup key="canvas" {...propsWithoutChildren} ref={canvasRef}>
				{props.directChildren}
			</CanvasGroup>

			<Frame key="frame" {...propsWithoutChildren} visible={visible} ref={frameRef}>
				{props.directChildren}
			</Frame>
		</Group>
	);
}
