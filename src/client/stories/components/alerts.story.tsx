import "client/app/react-config";

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { sendAlert } from "client/alerts";
import { Alerts } from "client/components/alerts";
import { Menu } from "client/components/menu";
import { InputCapture } from "client/components/ui/input-capture";
import { Backdrop } from "client/components/world/backdrop";
import { RootProvider } from "client/providers/root-provider";
import { palette } from "shared/constants/palette";

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
				sendAlert({
					emoji: "🎉",
					color: palette.mauve,
					colorSecondary: palette.blue,
					message: "This is an awesome alert.",
				});
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
