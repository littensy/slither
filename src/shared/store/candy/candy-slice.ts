import { createProducer } from "@rbxts/reflex";
import { assign, mapProperties, mapProperty } from "shared/utils/object-utils";

export interface CandyState {
	readonly [id: string]: CandyEntity | undefined;
}

export interface CandyEntity {
	readonly id: string;
	readonly size: number;
	readonly position: Vector2;
	readonly color: Color3;
	readonly type: CandyType;
	readonly eatenAt?: Vector2;
}

export enum CandyType {
	Default,
	Loot,
	Dropping,
}

const initialState: CandyState = {};

export const candySlice = createProducer(initialState, {
	populateCandy: (state, candy: CandyEntity[]) => {
		return assign(
			state,
			candy.reduce<{ [id: string]: CandyEntity }>((map, candy) => {
				map[candy.id] = candy;
				return map;
			}, {}),
		);
	},

	addCandy: (state, candy: CandyEntity) => {
		return assign(state, { [candy.id]: candy });
	},

	removeCandy: (state, id: string) => {
		return mapProperty(state, id, () => undefined);
	},

	setCandyEatenAt: (state, id: string, eatenAt: Vector2) => {
		return mapProperty(state, id, (candy) => ({
			...candy,
			eatenAt,
		}));
	},

	bulkRemoveStaleCandy: (state, candyType: CandyType, amount: number) => {
		const staleIds = new Set<string>();
		const candyList: CandyEntity[] = [];
		let candyListSize = 0;

		// reconstruct a list of candy, lower id = older
		for (const [id, candy] of pairs(state)) {
			if (candy.type !== candyType) {
				continue;
			}

			const insertAt = candyList.findIndex((otherCandy) => {
				return tonumber(otherCandy.id)! > tonumber(id)!;
			});

			if (insertAt !== -1) {
				candyList.insert(insertAt, candy);
			} else {
				candyList.push(candy);
			}

			candyListSize += 1;
		}

		// pick the amount of candy to remove, oldest first
		for (const index of $range(0, math.min(amount, candyListSize) - 1)) {
			staleIds.add(candyList[index].id);
		}

		return mapProperties(state, (candy) => {
			return !staleIds.has(candy.id) ? candy : undefined;
		});
	},
});
