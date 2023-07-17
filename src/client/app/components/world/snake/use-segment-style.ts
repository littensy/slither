import { lerp, map, useEventListener } from "@rbxts/pretty-react-hooks";
import { useBinding } from "@rbxts/roact";
import { RunService } from "@rbxts/services";

function brighten(color: Color3, amount: number) {
	const [h, s, v] = color.ToHSV();
	return Color3.fromHSV(h, lerp(s, 1, -0.25 * amount), lerp(v, 1, amount));
}

function redden(color: Color3) {
	return color.Lerp(Color3.fromRGB(255, 0, 0), 0.3);
}

export function useSegmentStyle(boost: boolean, dead: boolean, tint: Color3, index: number) {
	const [color, setColor] = useBinding(tint);
	const [transparency, setTransparency] = useBinding(0);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		const time = os.clock();
		const alpha = 1 - math.exp(-deltaTime * (dead ? 3 : 5));

		const highlightAlpha = map(math.sin(15 * time - 0.8 * index), -1, 1, -1, 1);
		const highlight = brighten(tint, highlightAlpha);

		const targetColor = dead ? redden(tint) : boost ? highlight : tint;
		const targetTransparency = dead ? 1 : 0;

		setColor(color.getValue().Lerp(targetColor, alpha));
		setTransparency(lerp(transparency.getValue(), targetTransparency, alpha));
	});

	return { color, transparency };
}
