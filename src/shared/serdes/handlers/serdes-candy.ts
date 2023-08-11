import BitBuffer from "@rbxts/bitbuffer2";
import { CandyEntity, CandyState } from "shared/store/candy";

import { readColor3, readVector2, writeColor3, writeVector2 } from "../utils";

export interface CandyStateSerialized {
	[id: string]: string;
}

export function serializeCandy(state: CandyState): CandyStateSerialized {
	const serialized: CandyStateSerialized = {};

	for (const [id, candy] of pairs(state)) {
		serialized[id] = serializeCandyEntity(candy);
	}

	return serialized;
}

export function deserializeCandy(state: CandyStateSerialized): CandyState {
	const deserialized: Writable<CandyState> = {};

	for (const [id, candy] of pairs(state)) {
		deserialized[id] = deserializeCandyEntity(candy, id as string);
	}

	return deserialized;
}

export function serializeCandyEntity(candy: CandyEntity): string {
	const buffer = new BitBuffer();

	buffer.WriteInt(8, candy.type);
	buffer.WriteFloat32(candy.size);
	writeVector2(buffer, candy.position);
	writeColor3(buffer, candy.color);

	return buffer.ToString();
}

export function deserializeCandyEntity(data: string, id: string): CandyEntity {
	const buffer = BitBuffer.FromString(data);

	return {
		id,
		type: buffer.ReadInt(8),
		size: buffer.ReadFloat32(),
		position: readVector2(buffer),
		color: readColor3(buffer),
	};
}
