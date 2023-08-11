import BitBuffer from "@rbxts/bitbuffer2";
import { SnakeEntity, SnakesState } from "shared/store/snakes";

import { readArray, readVector2, writeArray, writeVector2 } from "../utils";

export interface SnakesStateSerialized {
	[id: string]: string;
}

export function serializeSnakes(state: SnakesState): SnakesStateSerialized {
	const snakes: SnakesStateSerialized = {};

	for (const [id, snake] of pairs(state)) {
		snakes[id] = serializeSnakeEntity(snake);
	}

	return snakes;
}

export function deserializeSnakes(state: SnakesStateSerialized): SnakesState {
	const snakes: Writable<SnakesState> = {};

	for (const [id, snake] of pairs(state)) {
		snakes[id] = deserializeSnakeEntity(snake, id as string);
	}

	return snakes;
}

export function serializeSnakeEntity(snake: SnakeEntity): string {
	const buffer = new BitBuffer();

	buffer.WriteString(snake.name);
	writeVector2(buffer, snake.head);
	buffer.WriteFloat32(snake.angle);
	buffer.WriteFloat32(snake.desiredAngle);
	buffer.WriteUInt(32, snake.score);
	buffer.WriteBool(snake.boost);
	writeArray(buffer, snake.tracers, writeVector2);
	buffer.WriteString(snake.skin);
	buffer.WriteBool(snake.dead);

	return buffer.ToString();
}

export function deserializeSnakeEntity(data: string, id: string): SnakeEntity {
	const buffer = BitBuffer.FromString(data);

	return {
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
