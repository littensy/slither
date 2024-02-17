import React, { forwardRef, Ref } from "@rbxts/react";

import { FrameProps } from "./frame";

export interface CanvasGroupProps extends FrameProps<CanvasGroup> {
	groupColor?: Color3 | React.Binding<Color3>;
	groupTransparency?: number | React.Binding<number>;
}

export const CanvasGroup = forwardRef((props: CanvasGroupProps, ref: Ref<CanvasGroup>) => {
	return (
		<canvasgroup
			ref={ref}
			GroupColor3={props.groupColor}
			GroupTransparency={props.groupTransparency}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency}
			Rotation={props.rotation}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderSizePixel={0}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
		</canvasgroup>
	);
});
