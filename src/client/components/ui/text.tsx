import React from "@rbxts/react";
import { useRem } from "client/hooks";

import { fonts } from "../../constants/fonts";
import { FrameProps } from "./frame";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
	font?: Font;
	text?: string | React.Binding<string>;
	textColor?: Color3 | React.Binding<Color3>;
	textSize?: number | React.Binding<number>;
	textTransparency?: number | React.Binding<number>;
	textWrapped?: boolean | React.Binding<boolean>;
	textXAlignment?: React.InferEnumNames<Enum.TextXAlignment>;
	textYAlignment?: React.InferEnumNames<Enum.TextYAlignment>;
	textTruncate?: React.InferEnumNames<Enum.TextTruncate>;
	textScaled?: boolean | React.Binding<boolean>;
	textHeight?: number | React.Binding<number>;
	textAutoResize?: "X" | "Y" | "XY";
	richText?: boolean | React.Binding<boolean>;
	maxVisibleGraphemes?: number | React.Binding<number>;
}

export function Text(props: TextProps) {
	const rem = useRem();

	return (
		<textlabel
			Font={Enum.Font.Unknown}
			FontFace={props.font || fonts.inter.regular}
			Text={props.text}
			TextColor3={props.textColor}
			TextSize={props.textSize ?? rem(1)}
			TextTransparency={props.textTransparency}
			TextWrapped={props.textWrapped}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			TextTruncate={props.textTruncate}
			TextScaled={props.textScaled}
			LineHeight={props.textHeight}
			RichText={props.richText}
			MaxVisibleGraphemes={props.maxVisibleGraphemes}
			Size={props.size}
			AutomaticSize={props.textAutoResize}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			Change={props.change}
			Event={props.event}
		>
			{props.children}
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
		</textlabel>
	);
}
