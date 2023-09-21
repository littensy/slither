import { map } from "shared/utils/math-utils";

export function blendColorSequence(colors: Color3[], length: number, looped = false) {
	if (looped) {
		colors = [...colors, colors[0]];
	}

	const pattern = new Array<Color3>(length);
	const colorCount = colors.size();

	for (const index of $range(0, length - 1)) {
		const indexScaled = map(index, 0, length - 1, 0, colorCount - 1);
		const indexInArray = math.floor(indexScaled);

		const from = colors[indexInArray];
		const to = colors[(indexInArray + 1) % colorCount];

		pattern.push(from.Lerp(to, indexScaled % 1));
	}

	return pattern;
}
