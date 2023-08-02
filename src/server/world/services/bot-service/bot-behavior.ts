import Object from "@rbxts/object-utils";
import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getCandy, getRandomPointInWorld, getSnake } from "server/world/utils";
import { SnakeEntity, describeSnakeFromScore } from "shared/store/snakes";
import { map } from "shared/utils/math-utils";
import { candyGrid } from "../candy-service";
import { snakeGrid } from "../snake-service";

export enum BehaviorMode {
	Idle,
	Scavenging,
}

const BEHAVIORS = Object.values(BehaviorMode);

export class BotBehavior {
	public readonly id: string;
	private readonly seed: number;
	private readonly cleanup: () => void;

	constructor(id: string) {
		this.id = id;
		this.seed = math.random() * 255;

		this.cleanup = setInterval(() => {
			this.update();
		}, 1);
	}

	public destroy() {
		this.cleanup();
	}

	private idle(snake: SnakeEntity) {
		// prefer points that are further away
		const goal = maxVector(getRandomPointInWorld(), getRandomPointInWorld());
		const head = snake.head;
		const angle = math.atan2(goal.Y - head.Y, goal.X - head.X);

		store.turnSnake(this.id, angle);
	}

	private scavenge(snake: SnakeEntity) {
		const head = snake.head;
		const target = candyGrid.nearest(head, 15, (point) => {
			const candy = getCandy(point.metadata.id);
			return candy !== undefined && !candy.eatenAt;
		});

		const candy = target && getCandy(target.metadata.id);
		if (!candy) {
			return;
		}

		// Yeah... You wanna play with your Mario games?
		const angle = math.atan2(candy.position.Y - head.Y, candy.position.X - head.X);
		store.turnSnake(this.id, angle);
	}

	private flee(snake: SnakeEntity, incomingAngle: Vector2) {
		// Go 180 degrees in opposite direction
		const angle = math.atan2(incomingAngle.Y, incomingAngle.X) + math.rad(180);
		store.turnSnake(snake.id, angle);
		return;
	}

	private update() {
		const snake = getSnake(this.id);
		const behavior = this.getBehavior();

		if (!snake) {
			return;
		}

		const nearbyEnemy = this.directionToNearestEnemy(snake);
		// Do not shorten condition; angle may return as 0
		if (nearbyEnemy !== undefined) {
			this.flee(snake, nearbyEnemy);
			return;
		}

		switch (behavior) {
			case BehaviorMode.Idle: {
				this.idle(snake);
				break;
			}
			case BehaviorMode.Scavenging: {
				this.scavenge(snake);
				break;
			}
		}
	}

	private directionToNearestEnemy(snake: SnakeEntity): Vector2 | undefined {
		const radius = describeSnakeFromScore(snake.score).radius;

		const nearest = snakeGrid.nearest(snake.head, radius * 10 + 3, (hit) => {
			const enemy = getSnake(hit.metadata.id);
			return enemy !== undefined && !enemy.dead && enemy.id !== snake.id;
		});

		const enemy = nearest && getSnake(nearest.metadata.id);
		if (!enemy) {
			return;
		}

		const enemyRadius = describeSnakeFromScore(enemy.score).radius;
		const direction = nearest.position.sub(snake.head);
		const distance = direction.Magnitude;

		if (distance <= 5 * (radius + enemyRadius)) {
			return direction.Unit;
		}

		return undefined;
	}

	private getBehavior() {
		const noise = math.noise(this.seed, time());
		const index = math.round(map(noise, -0.5, 0.5, 0, BEHAVIORS.size() - 1));

		return BEHAVIORS[index] ?? BehaviorMode.Idle;
	}
}

function maxVector(a: Vector2, b: Vector2) {
	return a.Magnitude > b.Magnitude ? a : b;
}
