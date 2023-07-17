import { createProducer } from "@rbxts/reflex";

export interface MenuState {
	readonly page: MenuPage;
	readonly open: boolean;
}

export type MenuPage = "home";

const initialState: MenuState = {
	page: "home",
	open: true,
};

export const menuSlice = createProducer(initialState, {
	setMenuPage: (state, page: MenuPage) => ({
		...state,
		page,
	}),

	setMenuOpen: (state, open: boolean) => ({
		...state,
		open,
	}),
});
