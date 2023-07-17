import { palette } from "shared/data/palette";

export const GRADIENT = new ColorSequence([
	new ColorSequenceKeypoint(0, palette.red),
	new ColorSequenceKeypoint(0.25, palette.yellow),
	new ColorSequenceKeypoint(0.5, palette.teal),
	new ColorSequenceKeypoint(0.75, palette.blue),
	new ColorSequenceKeypoint(1, palette.mauve),
]);
