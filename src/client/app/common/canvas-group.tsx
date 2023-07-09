import Roact from "@rbxts/roact";
import { FrameProps } from "./frame";

export interface CanvasGroupProps extends FrameProps<CanvasGroup> {
	groupColor?: Color3 | Roact.Binding<Color3>;
	groupTransparency?: number | Roact.Binding<number>;
}

export function CanvasGroup(props: CanvasGroupProps) {
	return (
		<canvasgroup
			ref={props.ref}
			GroupColor3={props.groupColor}
			GroupTransparency={props.groupTransparency}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderSizePixel={0}
			Event={props.event || {}}
			Change={props.change || {}}
		>
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
			{props.children}
		</canvasgroup>
	);
}
