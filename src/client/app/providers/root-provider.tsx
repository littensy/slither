import { ReflexProvider } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { store } from "client/store";
import { RemProvider, RemProviderProps } from "./rem-provider";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride: override, children }: RootProviderProps) {
	return (
		<ReflexProvider producer={store}>
			<RemProvider baseRem={baseRem} remOverride={override}>
				{children}
			</RemProvider>
		</ReflexProvider>
	);
}
