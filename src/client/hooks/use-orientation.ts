import { useViewport } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";

export function useOrientation() {
	const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");

	useViewport((viewport) => {
		setOrientation(viewport.Y > viewport.X ? "portrait" : "landscape");
	});

	return orientation;
}
