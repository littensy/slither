import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { CANDY_TICK_PHASE } from "server/world/constants";
import { getSnake } from "server/world/utils";
import { CANDY_LIMITS, WORLD_TICK } from "shared/constants";
import { getSnakeTracerSkin } from "shared/data/skins";
import { selectCandyCount } from "shared/store/candy";
import {
	describeSnakeFromScore,
	identifySnake,
	selectAliveSnakesById,
	selectSnakeIsBoosting,
} from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";
import { createCandy, populateCandy, removeCandyIfAtLimit } from "./candy-helpers";
import { onCandyTick } from "./candy-tick";

const random = new Random();

export async function initCandyService() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	store.subscribe(
		selectCandyCount("default"),
		(count) => count < CANDY_LIMITS.default,
		(count) => populateCandy(CANDY_LIMITS.default - count),
	);

	store.observe(selectAliveSnakesById, identifySnake, ({ id }) => {
		// while boosting, decrement the snake's score and create candy
		// on the snake's tail
		const disconnect = dropCandyWhileBoosting(id);

		// when the snake dies, create candy on the snake's tracers
		return () => {
			disconnect();
			dropCandyOnDeath(id);
		};
	});

	createScheduler({
		name: "candy",
		tick: WORLD_TICK,
		phase: CANDY_TICK_PHASE,
		onTick: onCandyTick,
	});

	populateCandy(CANDY_LIMITS.default);
}

function dropCandyWhileBoosting(id: string) {
	return store.observeWhile(selectSnakeIsBoosting(id), () => {
		let previousTail = Vector2.zero;

		const dropCandy = () => {
			const snake = getSnake(id);

			if (!snake) {
				return;
			}

			const description = describeSnakeFromScore(snake.score);
			const tail = snake.tracers[snake.tracers.size() - 1];

			if (tail.sub(previousTail).Magnitude < description.radius * 2) {
				return;
			}

			previousTail = tail;

			const candy = createCandy({
				size: random.NextInteger(1, 5),
				position: tail,
				type: "dropping",
			});

			removeCandyIfAtLimit("dropping");

			store.addCandy(candy);
		};

		return setInterval(() => {
			store.incrementSnakeScore(id, random.NextInteger(-5, -3));
			dropCandy();
		}, 0.2);
	});
}

function dropCandyOnDeath(id: string): void {
	const snake = getSnake(id);

	if (!snake) {
		return;
	}

	const tracers = [...snake.tracers, snake.head];
	const tracerRadius = describeSnakeFromScore(snake.score).radius;
	const candyPositions: Vector2[] = [];
	let lastTracer: Vector2 | undefined;

	for (const tracer of tracers) {
		// to prevent candy bunching up in certain areas, don't insert the
		// position of the tracer if it's too close to the last spawned candy
		if (lastTracer && tracer.sub(lastTracer).Magnitude < 0.25 * tracerRadius) {
			continue;
		}

		lastTracer = tracer;

		// create multiple candies on this tracer based on radius
		const amount = math.round(random.NextNumber(1, math.max(tracerRadius, 1)));

		for (const _ of $range(1, amount)) {
			const x = random.NextNumber(-1, 1) * tracerRadius;
			const y = random.NextNumber(-1, 1) * tracerRadius;

			candyPositions.push(tracer.add(new Vector2(x, y)));
		}
	}

	// the total worth of the loot should scale logarithmically with the
	// snake's score, but not exceed the score itself
	const sum = math.min(2048 * math.log10(snake.score / 512 + 1), snake.score);
	const total = candyPositions.size();

	const candies = candyPositions.mapFiltered((position, index) => {
		const skin = getSnakeTracerSkin(snake.skin, index);

		return createCandy({
			position,
			type: "loot",
			size: math.ceil(sum / total),
			color: skin.tint,
		});
	});

	removeCandyIfAtLimit("loot");

	store.populateCandy(candies);
}
