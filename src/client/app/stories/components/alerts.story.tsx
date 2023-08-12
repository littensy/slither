import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { sendAlert } from "client/alert";
import { InputCapture } from "client/app/common/input-capture";
import { Alerts } from "client/app/components/alerts";
import { Menu } from "client/app/components/menu";
import { Backdrop } from "client/app/components/world/backdrop";
import { RootProvider } from "client/app/providers/root-provider";
import { palette } from "shared/data/palette";

export = hoarcekat(() => {
	const modes = ["info", "success", "warning", "error", "awesome"] as const;

	const alert = () => {
		const mode = modes[math.random(0, modes.size() - 1)];

		switch (mode) {
			case "info":
				sendAlert({ emoji: "ℹ️", color: palette.blue, message: "This is an info alert." });
				break;
			case "success":
				sendAlert({ emoji: "✅", color: palette.green, message: "This is a success alert." });
				break;
			case "warning":
				sendAlert({ emoji: "⚠️", color: palette.yellow, message: "This is a warning alert." });
				break;
			case "error":
				sendAlert({ emoji: "🚨", color: palette.red, message: "This is an error alert." });
				break;
			case "awesome":
				sendAlert({ emoji: "🎉", color: palette.mauve, message: "This is an awesome alert." });
				break;
		}
	};

	return (
		<RootProvider>
			<Backdrop />
			<Alerts />
			<Menu />
			<InputCapture
				onInputBegan={(_, input) => {
					if (input.KeyCode === Enum.KeyCode.F) {
						alert();
					}
				}}
			/>
		</RootProvider>
	);
});
