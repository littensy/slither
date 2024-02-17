import React, { useEffect, useState } from "@rbxts/react";

import { fonts } from "../../constants/fonts";
import { Group } from "./group";
import { TextProps } from "./text";

interface TextFieldProps extends TextProps<TextBox> {
	text?: string;
	placeholderText?: string | React.Binding<string>;
	placeholderColor?: Color3 | React.Binding<Color3>;
	clearTextOnFocus?: boolean | React.Binding<boolean>;
	multiLine?: boolean | React.Binding<boolean>;
	textEditable?: boolean | React.Binding<boolean>;
}

export function TextField(props: TextFieldProps) {
	const [childRef, setChildRef] = useState<Frame | undefined>(undefined);

	useEffect(() => {
		if (childRef && childRef.Parent?.IsA("TextBox")) {
			childRef.Parent.Text = props.text ?? "";
		}
	}, [childRef, props.text]);

	return (
		<textbox
			PlaceholderText={props.placeholderText}
			PlaceholderColor3={props.placeholderColor}
			ClearTextOnFocus={props.clearTextOnFocus}
			MultiLine={props.multiLine}
			TextEditable={props.textEditable}
			Font={Enum.Font.Unknown}
			FontFace={props.font || fonts.inter.regular}
			TextColor3={props.textColor}
			TextSize={props.textSize}
			TextTransparency={props.textTransparency}
			TextWrapped={props.textWrapped}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			TextTruncate={props.textTruncate}
			TextScaled={props.textScaled}
			AutomaticSize={props.textAutoResize}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
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
			<Group ref={setChildRef} />
		</textbox>
	);
}
