import Roact, { useState } from "@rbxts/roact";
import { FrameProps } from "./frame";

interface ViewportFrameProps extends FrameProps<ViewportFrame> {
	camera?: CFrame | Roact.Binding<CFrame>;
	fieldOfView?: number | Roact.Binding<number>;
	ambient?: Color3 | Roact.Binding<Color3>;
	lightColor?: Color3 | Roact.Binding<Color3>;
	lightDirection?: Vector3 | Roact.Binding<Vector3>;
	imageColor?: Color3 | Roact.Binding<Color3>;
	imageTransparency?: number | Roact.Binding<number>;
	useWorldModel?: boolean;
}

export function ViewportFrame(props: ViewportFrameProps) {
	const [currentCamera, setCurrentCamera] = useState<Camera>();

	return (
		<viewportframe
			ref={props.ref}
			CurrentCamera={currentCamera}
			Ambient={props.ambient}
			LightColor={props.lightColor}
			LightDirection={props.lightDirection}
			ImageColor3={props.imageColor}
			ImageTransparency={props.imageTransparency}
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
			<camera ref={setCurrentCamera} CFrame={props.camera} FieldOfView={props.fieldOfView} />
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
			{props.useWorldModel ? <worldmodel>{props.children}</worldmodel> : <>{props.children}</>}
		</viewportframe>
	);
}
