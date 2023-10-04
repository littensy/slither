import { useCamera, usePrevious, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { useEffect, useMemo, useState } from "@rbxts/roact";
import { useRem } from "client/hooks";
import { CandyEntity, selectCandiesById } from "shared/store/candy";
import { Grid } from "shared/utils/grid";

const MARGIN = 8;

export function useCandyOnScreen(offset: Vector2, scale: number) {
	const rem = useRem();
	const camera = useCamera();

	const grid = useMemo(() => {
		return new Grid<{ id: string }>(5);
	}, []);

	const currentCandies = useSelector(selectCandiesById);
	const previousCandies = usePrevious(currentCandies) || {};

	const [candiesOnScreen, setCandiesOnScreen] = useState<CandyEntity[]>([]);

	useEffect(() => {
		for (const [, candy] of pairs(currentCandies)) {
			const previousCandy = previousCandies[candy.id];

			if (!previousCandy) {
				grid.insert(candy.position, { id: candy.id });
			} else if (candy.position !== previousCandy.position) {
				grid.replace(previousCandy.position, candy.position, { id: candy.id });
			}
		}

		for (const [, candy] of pairs(previousCandies)) {
			if (currentCandies[candy.id] === undefined) {
				grid.remove(candy.position);
			}
		}
	}, [currentCandies]);

	useEffect(() => {
		const viewport = camera.ViewportSize.div(rem(scale));
		const margin = new Vector2(MARGIN, MARGIN).div(scale);

		const boxPosition = viewport.div(2).add(offset).add(margin).mul(-1);
		const boxSize = viewport.add(margin.mul(2));

		const candiesOnScreen = grid.queryBox(boxPosition, boxSize).mapFiltered((point) => {
			return currentCandies[point.metadata.id];
		});

		setCandiesOnScreen(candiesOnScreen);
	}, [currentCandies, offset, scale, rem]);

	useUnmountEffect(() => {
		grid.clear();
	});

	return candiesOnScreen;
}
