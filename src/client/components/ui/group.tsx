import React, { forwardRef } from "@rbxts/react";

interface GroupProps extends React.PropsWithChildren {
	ref?: React.Ref<Frame>;
	event?: React.InstanceEvent<Frame>;
	change?: React.InstanceChangeEvent<Frame>;
	size?: UDim2 | React.Binding<UDim2>;
	position?: UDim2 | React.Binding<UDim2>;
	anchorPoint?: Vector2 | React.Binding<Vector2>;
	rotation?: number | React.Binding<number>;
	clipsDescendants?: boolean | React.Binding<boolean>;
	layoutOrder?: number | React.Binding<number>;
	visible?: boolean | React.Binding<boolean>;
	zIndex?: number | React.Binding<number>;
}

export const Group = forwardRef((props: GroupProps, ref: React.Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			Size={props.size || UDim2.fromScale(1, 1)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			ClipsDescendants={props.clipsDescendants}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			BackgroundTransparency={1}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
		</frame>
	);
});
