import { lerp, lerpRadians, map } from "shared/utils/math-utils";

const TAU = 2 * math.pi;

function lerpHue(from: number, to: number, alpha: number) {
	return (lerpRadians(from * TAU, to * TAU, alpha) / TAU) % 1;
}

function lerpHSV(from: Color3, to: Color3, alpha: number) {
	const [fromH, fromS, fromV] = Color3.toHSV(from);
	const [toH, toS, toV] = Color3.toHSV(to);

	return Color3.fromHSV(lerpHue(fromH, toH, alpha), lerp(fromS, toS, alpha), lerp(fromV, toV, alpha));
}

export function blendColorSequence(colors: Color3[], length: number, looped = true): Color3[] {
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

		pattern[index] = lerpHSV(from, to, indexScaled % 1);
	}

	return pattern;
}

export function duplicateSequence<T extends defined>(sequence: T[], repeatCount: number): T[] {
	const pattern: T[] = [];

	for (const _ of $range(0, repeatCount - 1)) {
		for (const value of sequence) {
			pattern.push(value);
		}
	}

	return pattern;
}
