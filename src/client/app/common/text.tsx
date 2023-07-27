import Roact from "@rbxts/roact";
import { FontFamily, useFontFace, useRem } from "client/app/hooks";
import { FrameProps } from "./frame";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
	font?: FontFamily;
	fontWeight?: Enum.FontWeight;
	fontStyle?: Enum.FontStyle;
	text?: string | Roact.Binding<string>;
	textColor?: Color3 | Roact.Binding<Color3>;
	textSize?: number | Roact.Binding<number>;
	textTransparency?: number | Roact.Binding<number>;
	textWrapped?: boolean | Roact.Binding<boolean>;
	textXAlignment?: Roact.InferEnumNames<Enum.TextXAlignment>;
	textYAlignment?: Roact.InferEnumNames<Enum.TextYAlignment>;
	textTruncate?: Roact.InferEnumNames<Enum.TextTruncate>;
	textScaled?: boolean | Roact.Binding<boolean>;
	textHeight?: number | Roact.Binding<number>;
	textAutoResize?: "X" | "Y" | "XY";
	richText?: boolean | Roact.Binding<boolean>;
}

export function Text(props: TextProps) {
	const rem = useRem();
	const fontFace = useFontFace(props.font, props.fontWeight, props.fontStyle);

	return (
		<textlabel
			Font={Enum.Font.Unknown}
			FontFace={fontFace}
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
			Change={props.change || {}}
			Event={props.event || {}}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</textlabel>
	);
}
