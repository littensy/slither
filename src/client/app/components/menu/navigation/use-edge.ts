import { useViewport } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { useEffect, useState } from "@rbxts/roact";
import { useRem } from "client/app/hooks";
import { MIN_REM } from "client/app/providers/rem-provider";
import { selectCurrentPage } from "client/store/menu";

/**
 * Returns the edge of the screen to render the navbar on.
 */
export function useEdge() {
	const rem = useRem();
	const page = useSelector(selectCurrentPage);
	const [viewport, setViewport] = useState(Vector2.one);
	const [edge, setEdge] = useState<"top" | "bottom">("top");

	useEffect(() => {
		if (page === "home") {
			const hasSpaceOnTop = rem(1) > MIN_REM || viewport.Y > viewport.X || viewport.Y > rem(48);
			setEdge(hasSpaceOnTop ? "top" : "bottom");
		} else {
			setEdge("top");
		}
	}, [rem, page, viewport]);

	useViewport(setViewport);

	return edge;
}
