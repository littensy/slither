import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/store";

import { RemProvider, RemProviderProps } from "./rem-provider";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<ReflexProvider producer={store}>
			<RemProvider baseRem={baseRem} remOverride={remOverride}>
				{children}
			</RemProvider>
		</ReflexProvider>
	);
}
