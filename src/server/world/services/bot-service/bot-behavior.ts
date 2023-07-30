import { store } from "server/store";
import { getRandomPointInWorld, getSnake } from "server/world/utils";

export enum BehaviorMode {
	Idle,
	Scavenging,
}

export class BotBehavior {
	private _behavior: BehaviorMode;
	private _updateCounter: number;

	setBehavior(newBehavior: BehaviorMode) {
		this._behavior = newBehavior;
	}

	update(id: string) {
		const snake = getSnake(id);

		if (!snake) {
			return;
		}

		switch (this._behavior) {
			case BehaviorMode.Idle: {
				// prefer points that are further away
				const goal = maxVector(getRandomPointInWorld(), getRandomPointInWorld());
				const head = snake.head;
				const angle = math.atan2(goal.Y - head.Y, goal.X - head.X);

				store.turnSnake(id, angle);
				break;
			}
			case BehaviorMode.Scavenging: {
				// TODO: Scavenge for *nearby* candies, especially
				// high value candies (from dead snakes)
				// Requires creation of new utilities
				break;
			}
		}
		/*
		if (++this._updateCounter === 5) {
			this._updateCounter = 0;
			this.setBehavior(BehaviorMode.Scavenging)
		}
		*/
	}

	constructor(initialBehavior: BehaviorMode) {
		this._behavior = initialBehavior;
		this._updateCounter = 0;
	}
}

function maxVector(a: Vector2, b: Vector2) {
	return a.Magnitude > b.Magnitude ? a : b;
}
