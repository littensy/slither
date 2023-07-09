import { useComposedRef, useDeferState } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { Group } from "./group";

interface RenderInViewProps extends Roact.PropsWithChildren {
	ref?: (rbx?: Frame) => void;
	change?: Roact.JsxInstanceChangeEvents<Frame>;
	event?: Roact.JsxInstanceEvents<Frame>;
	container?: GuiObject;
	containerMargin?: Vector2;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	zIndex?: number | Roact.Binding<number>;
	layoutOrder?: number | Roact.Binding<number>;
}

export function RenderInView({
	ref,
	change = {},
	event = {},
	container,
	containerMargin = Vector2.zero,
	size,
	position,
	anchorPoint,
	zIndex,
	layoutOrder,
	children,
}: RenderInViewProps) {
	const [frame, setFrame] = useState<Frame>();
	const [shouldRender, setShouldRender] = useDeferState(false);

	useEffect(() => {
		if (!frame || !container) return;

		// Set shouldRender to 'true' if any part of the frame is inside the container
		const updateShouldRender = () => {
			const framePosition = frame.AbsolutePosition;
			const frameSize = frame.AbsoluteSize;

			const containerPosition = container.AbsolutePosition.sub(containerMargin.div(2));
			const containerSize = container.AbsoluteSize.add(containerMargin);

			const inFrame =
				framePosition.X + frameSize.X > containerPosition.X &&
				framePosition.X < containerPosition.X + containerSize.X &&
				framePosition.Y + frameSize.Y > containerPosition.Y &&
				framePosition.Y < containerPosition.Y + containerSize.Y;

			setShouldRender(inFrame);
		};

		const connections = [
			frame.GetPropertyChangedSignal("AbsolutePosition").Connect(updateShouldRender),
			frame.GetPropertyChangedSignal("AbsoluteSize").Connect(updateShouldRender),

			container.GetPropertyChangedSignal("AbsolutePosition").Connect(updateShouldRender),
			container.GetPropertyChangedSignal("AbsoluteSize").Connect(updateShouldRender),
		];

		updateShouldRender();

		return () => {
			for (const connection of connections) {
				connection.Disconnect();
			}
		};
	}, [frame, container, containerMargin]);

	return (
		<Group
			ref={useComposedRef(setFrame, ref)}
			change={change}
			event={event}
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			zIndex={zIndex}
			layoutOrder={layoutOrder}
		>
			{shouldRender && children}
		</Group>
	);
}
