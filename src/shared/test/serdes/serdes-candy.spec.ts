/// <reference types="@rbxts/testez/globals" />

import { HttpService } from "@rbxts/services";
import { getRandomAccent } from "shared/constants/palette";
import { deserializeCandy, serializeCandy } from "shared/serdes/handlers/serdes-candy";
import { CandyEntity, CandyState } from "shared/store/candy";

export = () => {
	function generateCandy(id?: string): CandyEntity {
		return {
			id: id ?? HttpService.GenerateGUID(false),
			type: math.random(0, 2),
			size: math.random(),
			position: new Vector2(math.random(), math.random()),
			color: getRandomAccent(),
		};
	}

	function assertCandyEqual(candy: CandyEntity, deserialized: CandyEntity) {
		for (const [key, value] of pairs(candy)) {
			if (key === "size") {
				expect(value).to.be.near(deserialized[key]);
			} else {
				expect(value).to.equal(deserialized[key]);
			}
		}
	}

	it("should serialize an entity", () => {
		const state: CandyState = {
			"1": generateCandy("1"),
		};

		const serialized = serializeCandy(state);
		const deserialized = deserializeCandy(serialized);

		for (const [id, candy] of pairs(state)) {
			expect(deserialized[id]).to.be.ok();
			assertCandyEqual(candy, deserialized[id]!);
		}
	});

	it("should serialize a record of entities", () => {
		const state: CandyState = {
			"1": generateCandy("1"),
			"2": generateCandy("2"),
			"3": generateCandy("3"),
		};

		const serialized = serializeCandy(state);
		const deserialized = deserializeCandy(serialized);

		for (const [id, candy] of pairs(state)) {
			expect(deserialized[id]).to.be.ok();
			assertCandyEqual(candy, deserialized[id]!);
		}
	});

	it("should compress the data", () => {
		const state: CandyState = {
			"1": generateCandy("1"),
			"2": generateCandy("2"),
			"3": generateCandy("3"),
		};

		const serialized = serializeCandy(state);
		const json = HttpService.JSONEncode(state);

		expect(serialized.size() < json.size()).to.equal(true);
	});
};
