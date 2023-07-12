import { lerp, map, useEventListener } from "@rbxts/pretty-react-hooks";
import { useBinding } from "@rbxts/roact";
import { RunService } from "@rbxts/services";

function brighten(color: Color3, amount: number) {
	const [h, s, v] = color.ToHSV();
	return Color3.fromHSV(h, lerp(s, 1, -0.25 * amount), lerp(v, 1, amount));
}

export function useSegmentColor(boost: boolean, tint: Color3, index: number) {
	const [color, setColor] = useBinding(tint);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		const time = os.clock();
		const alpha = map(math.sin(15 * time - 0.8 * index), -1, 1, -1, 1);
		const highlight = brighten(tint, alpha);

		setColor(color.getValue().Lerp(boost ? highlight : tint, 1 - math.exp(-deltaTime * 5)));
	});

	return color;
}
