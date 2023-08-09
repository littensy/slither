import { blend, lerp } from "@rbxts/pretty-react-hooks";
import Roact, { memo, useMemo } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { getSnakeSkin, getSnakeTracerSkin } from "shared/data/skins";
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
	const tracerSkin = getSnakeTracerSkin(skinId, index);

	const rem = useRem();
	const style = useTracerStyle(line, effects, index, tracerSkin.tint);

	const glowStyle = useMemo(() => {
		const binding = style.boostTimer.map(() => {
			return effects.getValue();
		});

		const transparency = binding.map(({ boost, dead }) => {
			return blend(1 - boost, dead, 0.3);
		});

		const color = style.color.map((color) => {
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
		<Image
			image={tracerSkin.texture}
			imageColor={style.color}
			imageTransparency={style.transparency}
			scaleType="Slice"
			sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			sliceScale={4}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={style.size}
			position={style.position}
			rotation={style.rotation}
			zIndex={-index - 1}
		>
			{style.boostActive && (
				<Image
					key="glow"
					image={images.ui.blur}
					imageColor={glowStyle.color}
					imageTransparency={glowStyle.transparency}
					scaleType="Slice"
					sliceCenter={new Rect(256, 256, 256, 256)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={glowStyle.size}
					position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			)}
		</Image>
	);
}

export const SnakeTracer = memo(SnakeTracerComponent);
