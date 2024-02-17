import { getBindingValue, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { Binding, useMemo, useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";
import { palette } from "shared/constants/palette";

interface TransitionProps extends React.PropsWithChildren {
	groupColor?: Color3 | Binding<Color3>;
	groupTransparency?: number | Binding<number>;
	anchorPoint?: Vector2 | Binding<Vector2>;
	size?: UDim2 | Binding<UDim2>;
	position?: UDim2 | Binding<UDim2>;
	rotation?: number | Binding<number>;
	clipsDescendants?: boolean | Binding<boolean>;
	layoutOrder?: number | Binding<number>;
	zIndex?: number | Binding<number>;
	event?: React.InstanceEvent<Frame | CanvasGroup>;
	change?: React.InstanceChangeEvent<Frame | CanvasGroup>;
	directChildren?: React.ReactNode;
	children?: React.ReactNode;
}

const EPSILON = 0.03;

export function Transition({
	groupColor,
	groupTransparency,
	anchorPoint,
	size = new UDim2(1, 0, 1, 0),
	position,
	rotation,
	clipsDescendants,
	layoutOrder,
	zIndex,
	event,
	change,
	children,
	directChildren,
}: TransitionProps) {
	const [frame, setFrame] = useState<Frame>();
	const [canvas, setCanvas] = useState<CanvasGroup>();

	const container = useMemo(() => {
		const container = new Instance("Frame");
		container.Size = new UDim2(1, 0, 1, 0);
		container.BackgroundTransparency = 1;
		return container;
	}, []);

	useEventListener(RunService.Heartbeat, () => {
		const transparency = getBindingValue(groupTransparency) ?? 0;
		const color = getBindingValue(groupColor) || palette.white;

		pcall(() => {
			if (transparency > EPSILON || color !== palette.white) {
				container.Parent = canvas;
			} else {
				container.Parent = frame;
			}
		});
	});

	useUnmountEffect(() => {
		container.Destroy();
	});

	return (
		<frame
			BackgroundTransparency={1}
			AnchorPoint={anchorPoint}
			Size={size}
			Position={position}
			Rotation={rotation}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
		>
			{createPortal(<>{children}</>, container)}

			<canvasgroup
				ref={setCanvas}
				Change={change}
				Event={event}
				GroupTransparency={groupTransparency}
				GroupColor3={groupColor}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</canvasgroup>

			<frame
				ref={setFrame}
				Change={change}
				Event={event}
				ClipsDescendants={clipsDescendants}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</frame>
		</frame>
	);
}
