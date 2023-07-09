import Roact from "@rbxts/roact";

interface GroupProps extends Roact.PropsWithChildren {
	ref?: Roact.RefPropertyOrFunction<Frame>;
	event?: Roact.JsxInstanceEvents<Frame>;
	change?: Roact.JsxInstanceChangeEvents<Frame>;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	clipsDescendants?: boolean | Roact.Binding<boolean>;
	layoutOrder?: number | Roact.Binding<number>;
	visible?: boolean | Roact.Binding<boolean>;
	zIndex?: number | Roact.Binding<number>;
}

export function Group(props: GroupProps) {
	return (
		<frame
			ref={props.ref}
			Size={props.size || UDim2.fromScale(1, 1)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			ClipsDescendants={props.clipsDescendants}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			BackgroundTransparency={1}
			Event={props.event || {}}
			Change={props.change || {}}
		>
			{props.children}
		</frame>
	);
}
