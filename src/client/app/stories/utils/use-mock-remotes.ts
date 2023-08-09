import { useEffect } from "@rbxts/roact";
import { store } from "client/store";
import { LOCAL_USER } from "shared/constants";
import { getSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { selectPlayerBalance } from "shared/store/saves";

export function useMockRemotes() {
	useEffect(() => {
		const connections = [
			remotes.snake.move.test.onFire((angle) => {
				store.turnSnake(LOCAL_USER, angle);
			}),

			remotes.snake.boost.test.onFire((boost) => {
				store.boostSnake(LOCAL_USER, boost);
			}),

			remotes.snake.spawn.test.onFire(() => {
				store.addSnake(LOCAL_USER);
			}),

			remotes.save.setSkin.test.onFire((skin) => {
				store.setPlayerSkin(LOCAL_USER, skin);
			}),

			remotes.save.buySkin.test.onFire((skinId) => {
				const balance = store.getState(selectPlayerBalance(LOCAL_USER)) ?? 0;
				const skin = getSnakeSkin(skinId);

				if (balance >= skin.price) {
					store.givePlayerSkin(LOCAL_USER, skinId);
					store.givePlayerBalance(LOCAL_USER, -skin.price);
				}
			}),
		];

		return () => {
			connections.forEach((connection) => connection());
		};
	}, []);
}
