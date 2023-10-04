import Roact, { forwardRef, Ref } from "@rbxts/roact";

import { FrameProps } from "./frame";

export interface CanvasGroupProps extends FrameProps<CanvasGroup> {
	groupColor?: Color3 | Roact.Binding<Color3>;
	groupTransparency?: number | Roact.Binding<number>;
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
			Event={props.event || {}}
			Change={props.change || {}}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</canvasgroup>
	);
});
