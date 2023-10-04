/// <reference types="@rbxts/testez/globals" />

import { shallowEqual } from "@rbxts/reflex";
import { HttpService } from "@rbxts/services";
import { getRandomBaseSnakeSkin } from "shared/constants/skins";
import { deserializeSnakes, serializeSnakes } from "shared/serdes/handlers/serdes-snake";
import { SnakeEntity, SnakesState } from "shared/store/snakes";
import { fillArray } from "shared/utils/object-utils";

export = () => {
	function generateSnake(id?: string): SnakeEntity {
		return {
			id: id ?? HttpService.GenerateGUID(false),
			name: HttpService.GenerateGUID(false),
			head: new Vector2(math.random(), math.random()),
			angle: math.random() * math.pi * 2,
			desiredAngle: math.random() * math.pi * 2,
			score: math.random(0, 10000),
			boost: math.random() > 0.5,
			tracers: fillArray(10, () => new Vector2(math.random(), math.random())),
			skin: getRandomBaseSnakeSkin().id,
			dead: math.random() > 0.5,
			eliminations: math.random(1, 100),
		};
	}

	function assertSnakeEqual(snake: SnakeEntity, deserialized: SnakeEntity) {
		for (const [key, value] of pairs(snake)) {
			if (key === "tracers") {
				assert(shallowEqual(value, deserialized[key]), "tracers are not equal");
			} else if (key === "angle" || key === "desiredAngle") {
				expect(value).to.be.near(deserialized[key], 0.0001);
			} else {
				expect(value).to.equal(deserialized[key]);
			}
		}
	}

	it("should serialize an entity", () => {
		const state: SnakesState = {
			"1": generateSnake("1"),
		};

		const serialized = serializeSnakes(state);
		const deserialized = deserializeSnakes(serialized);

		for (const [id, snake] of pairs(state)) {
			expect(deserialized[id]).to.be.ok();
			assertSnakeEqual(snake, deserialized[id]!);
		}
	});

	it("should serialize a record of entities", () => {
		const state: SnakesState = {
			"1": generateSnake("1"),
			"2": generateSnake("2"),
			"3": generateSnake("3"),
		};

		const serialized = serializeSnakes(state);
		const deserialized = deserializeSnakes(serialized);

		for (const [id, snake] of pairs(state)) {
			expect(deserialized[id]).to.be.ok();
			assertSnakeEqual(snake, deserialized[id]!);
		}
	});

	it("should compress the data", () => {
		const state: SnakesState = {
			"1": generateSnake("1"),
			"2": generateSnake("2"),
			"3": generateSnake("3"),
		};

		const serialized = serializeSnakes(state);
		const json = HttpService.JSONEncode(state);

		expect(serialized.size() < json.size()).to.equal(true);
	});
};
