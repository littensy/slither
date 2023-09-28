import BitBuffer from "@rbxts/bitbuffer2";
import { CandyState } from "shared/store/candy";
import { countProperties } from "shared/utils/object-utils";

import { readColor3, readVector2, writeColor3, writeVector2 } from "../utils";

export function serializeCandy(state: CandyState): string {
	const buffer = new BitBuffer();

	buffer.WriteUInt(16, countProperties(state));

	for (const [, candy] of pairs(state)) {
		buffer.WriteString(candy.id);
		buffer.WriteInt(8, candy.type);
		buffer.WriteFloat32(candy.size);
		writeVector2(buffer, candy.position);
		writeColor3(buffer, candy.color);
	}

	return buffer.ToString();
}

export function deserializeCandy(data: string): CandyState {
	const state: Writable<CandyState> = {};
	const buffer = BitBuffer.FromString(data);
	const size = buffer.ReadUInt(16);

	for (const _ of $range(1, size)) {
		const id = buffer.ReadString();

		state[id] = {
			id,
			type: buffer.ReadInt(8),
			size: buffer.ReadFloat32(),
			position: readVector2(buffer),
			color: readColor3(buffer),
		};
	}

	return state;
}
