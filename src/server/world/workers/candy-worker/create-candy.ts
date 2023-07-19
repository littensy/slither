import { getRandomPointInWorld } from "server/world/utils/world-utils";
import { getRandomAccent } from "shared/data/palette";
import { CandyEntity } from "shared/store/candy";

const random = new Random();
let nextCandyId = 0;

export function createCandy(patch?: Partial<CandyEntity>): CandyEntity {
	return {
		id: `candy-${nextCandyId++}`,
		type: "static",
		size: math.round(1 + random.NextInteger(1, 10) ** 0.5),
		position: getRandomPointInWorld(0.9),
		color: getRandomAccent(),
		...patch,
	};
}
