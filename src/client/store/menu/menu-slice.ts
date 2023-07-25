import { createProducer } from "@rbxts/reflex";
import { getMenuDirection } from "./menu-utils";

export interface MenuState {
	readonly page: MenuPage;
	readonly open: boolean;
	readonly transition: {
		readonly direction: "left" | "right";
		readonly counter: number;
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
});
