import { blend, mapBinding } from "@rbxts/pretty-react-hooks";
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
	richText?: boolean | Roact.Binding<boolean>;
	underlay?: boolean;
	underlayTransparency?: number | Roact.Binding<number>;
	underlayColor?: Color3 | Roact.Binding<Color3>;
	underlayOffset?: UDim2 | Roact.Binding<UDim2>;
}

export function Text(props: TextProps) {
	const propsWithoutChildren = {
		...props,
		children: undefined,
		ref: undefined,
	};

	const rem = useRem();
	const fontFace = useFontFace(props.font || "FredokaOne", props.fontWeight, props.fontStyle);

	return (
		<frame
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
		>
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
			{props.underlay && (
				<Text
					{...propsWithoutChildren}
					underlay={false}
					textColor={props.underlayColor || new Color3()}
					textTransparency={mapBinding(props.textTransparency ?? 0, (t) => blend(t, 0.7))}
					anchorPoint={new Vector2()}
					size={new UDim2(1, 0, 1, 0)}
					position={props.underlayOffset || new UDim2(0, 0, 0, 3)}
					zIndex={0}
					backgroundTransparency={1}
				/>
			)}
			<textlabel
				ref={props.ref}
				Font={Enum.Font.Unknown}
				FontFace={fontFace}
				Text={props.text}
				TextColor3={props.textColor}
				TextSize={props.textSize ?? rem}
				TextTransparency={props.textTransparency}
				TextWrapped={props.textWrapped}
				TextXAlignment={props.textXAlignment}
				TextYAlignment={props.textYAlignment}
				TextTruncate={props.textTruncate}
				TextScaled={props.textScaled}
				LineHeight={props.textHeight}
				RichText={props.richText}
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundTransparency={1}
				Event={props.event || {}}
				Change={props.change || {}}
			>
				{props.children}
			</textlabel>
		</frame>
	);
}
