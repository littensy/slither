import { useEffect } from "@rbxts/react";
import { store } from "client/store";
import { USER_NAME } from "shared/constants/core";
import { getSnakeSkin } from "shared/constants/skins";
import { remotes } from "shared/remotes";
import { selectPlayerBalance } from "shared/store/saves";

export function useMockRemotes() {
	useEffect(() => {
		const connections = [
			remotes.snake.move.test.onFire((angle) => {
				store.turnSnake(USER_NAME, angle);
			}),

			remotes.snake.boost.test.onFire((boost) => {
				store.boostSnake(USER_NAME, boost);
			}),

			remotes.snake.spawn.test.onFire(() => {
				store.addSnake(USER_NAME);
			}),

			remotes.save.setSkin.test.onFire((skin) => {
				store.setPlayerSkin(USER_NAME, skin);
			}),

			remotes.save.buySkin.test.onFire((skinId) => {
				const balance = store.getState(selectPlayerBalance(USER_NAME)) ?? 0;
				const skin = getSnakeSkin(skinId);

				if (balance >= skin.price) {
					store.givePlayerSkin(USER_NAME, skinId);
					store.givePlayerBalance(USER_NAME, -skin.price);
				}
			}),
		];

		return () => {
			connections.forEach((connection) => connection());
		};
	}, []);
}
