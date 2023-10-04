import Roact from "@rbxts/roact";

import { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
	image: string;
	imageColor?: Color3 | Roact.Binding<Color3>;
	imageTransparency?: number | Roact.Binding<number>;
	imageRectOffset?: Vector2 | Roact.Binding<Vector2>;
	imageRectSize?: Vector2 | Roact.Binding<Vector2>;
	scaleType?: Roact.InferEnumNames<Enum.ScaleType>;
	sliceScale?: number | Roact.Binding<number>;
	sliceCenter?: Rect | Roact.Binding<Rect>;
	tileSize?: UDim2 | Roact.Binding<UDim2>;
}

export function Image(props: ImageProps) {
	return (
		<imagelabel
			Image={props.image}
			ImageColor3={props.imageColor}
			ImageTransparency={props.imageTransparency}
			ImageRectOffset={props.imageRectOffset}
			ImageRectSize={props.imageRectSize}
			ScaleType={props.scaleType}
			SliceScale={props.sliceScale}
			SliceCenter={props.sliceCenter}
			TileSize={props.tileSize}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
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
		</imagelabel>
	);
}
