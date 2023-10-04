import { palette } from "shared/constants/palette";

const generate = (colors: Color3[]) => {
	const sequence: ColorSequenceKeypoint[] = [];
	const length = colors.size();

	colors.forEach((color, index) => {
		sequence.push(new ColorSequenceKeypoint(index / (length - 1), color));
	});

	return new ColorSequence(sequence);
};

export const gradient = generate([palette.red, palette.yellow, palette.teal, palette.blue, palette.mauve]);

export const gradientPinched = generate([
	palette.red,
	palette.red,
	palette.yellow,
	palette.teal,
	palette.blue,
	palette.mauve,
	palette.mauve,
]);
