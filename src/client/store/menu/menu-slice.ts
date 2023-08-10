import { createProducer } from "@rbxts/reflex";
import { RANDOM_SKIN } from "shared/store/saves";

import { getMenuDirection } from "./menu-utils";

export interface MenuState {
	readonly page: MenuPage;
	readonly open: boolean;
	readonly transition: {
		readonly direction: "left" | "right";
		readonly counter: number;
	};
	readonly skins: {
		readonly current: string;
	};
}

export type MenuPage = "support" | "home" | "skins";

const initialState: MenuState = {
	page: "home",
	open: true,
	transition: {
		direction: "left",
		counter: 0,
	},
	skins: {
		current: RANDOM_SKIN,
	},
};

export const menuSlice = createProducer(initialState, {
	setMenuPage: (state, page: MenuPage) => ({
		...state,
		page,
		transition: {
			direction: getMenuDirection(state.page, page),
			counter: state.transition.counter + 1,
		},
	}),

	setMenuOpen: (state, open: boolean) => ({
		...state,
		open,
	}),

	setMenuSkin: (state, skin: string) => ({
		...state,
		skins: {
			...state.skins,
			current: skin,
		},
	}),
});
