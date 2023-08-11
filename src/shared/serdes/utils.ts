import BitBuffer from "@rbxts/bitbuffer2";

export function writeVector2(buffer: BitBuffer, vector: Vector2) {
	buffer.WriteFloat32(vector.X);
	buffer.WriteFloat32(vector.Y);
}

export function readVector2(buffer: BitBuffer) {
	const x = buffer.ReadFloat32();
	const y = buffer.ReadFloat32();
	return new Vector2(x, y);
}

export function writeColor3(buffer: BitBuffer, color: Color3) {
	const hex = color.ToHex();
	const int = tonumber(hex, 16) ?? 0;
	buffer.WriteUInt(24, int);
}

export function readColor3(buffer: BitBuffer) {
	const int = buffer.ReadUInt(24);
	const hex = string.format("%x", int);
	return Color3.fromHex(hex);
}

export function writeArray<T extends defined>(
	buffer: BitBuffer,
	array: readonly T[],
	write: (buffer: BitBuffer, value: T) => void,
) {
	buffer.WriteUInt(16, array.size());

	for (const value of array) {
		write(buffer, value);
	}
}

export function readArray<T extends defined>(buffer: BitBuffer, read: (buffer: BitBuffer) => T): T[] {
	const size = buffer.ReadUInt(16);
	const array: T[] = [];

	for (const _ of $range(1, size)) {
		array.push(read(buffer));
	}

	return array;
}
