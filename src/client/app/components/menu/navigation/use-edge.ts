import { useViewport } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/roact";
import { useRem } from "client/app/hooks";
import { MIN_REM } from "client/app/providers/rem-provider";

/**
 * Returns the edge of the screen to render the navbar on.
 */
export function useEdge() {
	const rem = useRem();
	const [viewport, setViewport] = useState(Vector2.one);
	const [edge, setEdge] = useState<"top" | "bottom">("top");

	useEffect(() => {
		const hasSpaceOnTop = rem(1) > MIN_REM || viewport.Y > viewport.X || viewport.Y > rem(54);
		setEdge(hasSpaceOnTop ? "top" : "bottom");
	}, [rem, viewport]);

	useViewport(setViewport);

	return edge;
}
