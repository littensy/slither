import BitBuffer from "@rbxts/bitbuffer2";
import { SnakesState } from "shared/store/snakes";
import { countProperties } from "shared/utils/object-utils";

import { readArray, readVector2, writeArray, writeVector2 } from "../utils";

export function serializeSnakes(state: SnakesState): string {
	const buffer = new BitBuffer();

	buffer.WriteUInt(16, countProperties(state));

	for (const [, snake] of pairs(state)) {
		buffer.WriteString(snake.id);
		buffer.WriteString(snake.name);
		writeVector2(buffer, snake.head);
		buffer.WriteFloat32(snake.angle);
		buffer.WriteFloat32(snake.desiredAngle);
		buffer.WriteUInt(32, snake.score);
		buffer.WriteBool(snake.boost);
		writeArray(buffer, snake.tracers, writeVector2);
		buffer.WriteString(snake.skin);
		buffer.WriteBool(snake.dead);
	}

	return buffer.ToString();
}

export function deserializeSnakes(data: string): SnakesState {
	const state: Writable<SnakesState> = {};
	const buffer = BitBuffer.FromString(data);
	const size = buffer.ReadUInt(16);

	for (const _ of $range(1, size)) {
		const id = buffer.ReadString();

		state[id] = {
			id,
			name: buffer.ReadString(),
			head: readVector2(buffer),
			angle: buffer.ReadFloat32(),
			desiredAngle: buffer.ReadFloat32(),
			score: buffer.ReadUInt(32),
			boost: buffer.ReadBool(),
			tracers: readArray(buffer, readVector2),
			skin: buffer.ReadString(),
			dead: buffer.ReadBool(),
		};
	}

	return state;
}
