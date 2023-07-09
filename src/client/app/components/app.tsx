import Roact from "@rbxts/roact";
import { PrettyButton } from "../common/pretty-button";
import { Root } from "../common/root";
import { Preloader } from "./preloader";

export function App() {
	return (
		<>
			<Root>
				<PrettyButton size={new UDim2(0, 100, 0, 100)} position={new UDim2(0.5, 0, 0.5, 0)} />
			</Root>
			<Preloader />
		</>
	);
}
