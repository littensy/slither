import React from "@rbxts/react";

import { FrameProps } from "./frame";

export interface ButtonProps extends FrameProps<TextButton> {
	active?: boolean | React.Binding<boolean>;
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

export function Button(props: ButtonProps) {
	const { onClick, onMouseDown, onMouseEnter, onMouseLeave, onMouseUp } = props;

	const event = {
		Activated: onClick && (() => onClick()),
		MouseButton1Down: onMouseDown && (() => onMouseDown()),
		MouseButton1Up: onMouseUp && (() => onMouseUp()),
		MouseEnter: onMouseEnter && (() => onMouseEnter()),
		MouseLeave: onMouseLeave && (() => onMouseLeave()),
		...props.event,
	};

	return (
		<textbutton
			Active={props.active}
			Text=""
			AutoButtonColor={false}
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
			Event={event}
			Change={props.change}
		>
			{props.children}
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
		</textbutton>
	);
}
