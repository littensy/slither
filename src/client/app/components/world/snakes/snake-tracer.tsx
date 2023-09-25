import { blend, lerp } from "@rbxts/pretty-react-hooks";
import Roact, { memo, useMemo } from "@rbxts/roact";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { getSnakeSkin, getSnakeSkinForTracer } from "shared/data/skins";

import { SnakeEffectBinding, SnakeLineBinding } from "./use-snake-bindings";
import { useTracerStyle } from "./use-tracer-style";

interface SnakeTracerProps {
	readonly line: SnakeLineBinding;
	readonly effects: SnakeEffectBinding;
	readonly skinId: string;
	readonly index: number;
}

function SnakeTracerComponent({ line, effects, skinId, index }: SnakeTracerProps) {
	const skin = getSnakeSkin(skinId);
	const tracerSkin = getSnakeSkinForTracer(skinId, index);

	const rem = useRem();
	const style = useTracerStyle(line, effects, index, tracerSkin.tint, tracerSkin.boostTint);

	const glowStyle = useMemo(() => {
		const binding = style.boostTimer.map(() => {
			return effects.getValue();
		});

		const transparency = binding.map(({ boost, dead }) => {
			return blend(1 - boost, dead, 0.3);
		});

		const color = (style.boostColor || style.color).map((color) => {
			return color.Lerp(new Color3(), 0.1);
		});

		const size = binding.map(({ boost, dead }) => {
			const alpha = lerp(boost, 0, dead);
			const diameter = line.getValue().diameter;
			return new UDim2(1, 0, 1, 0).Lerp(new UDim2(1, rem(diameter + 5), 1, rem(diameter + 5)), alpha);
		});

		const visible = binding.map(({ boost, dead }) => {
			const alpha = lerp(boost, 0, dead);
			return alpha > 0;
		});

		return { transparency, color, size, visible };
	}, [style, rem, skin]);

	return (
		<imagelabel
			Image={tracerSkin.texture}
			ImageColor3={style.color}
			ImageTransparency={style.transparency}
			ScaleType="Slice"
			SliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			SliceScale={4}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={style.size}
			Position={style.position}
			Rotation={style.rotation}
			ZIndex={-index - 1}
		>
			{style.boostActive && (
				<imagelabel
					key="glow"
					Image={images.ui.blur}
					ImageColor3={glowStyle.color}
					ImageTransparency={glowStyle.transparency}
					ScaleType="Slice"
					SliceCenter={new Rect(256, 256, 256, 256)}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={glowStyle.size}
					Position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			)}
		</imagelabel>
	);
}

export const SnakeTracer = memo(SnakeTracerComponent);
