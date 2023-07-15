/**
 * Maps an object to a new object with the same keys, but values are
 * mapped using the provided mapper function.
 */
export function mapObject<K extends string, V, T>(
	object: { readonly [Key in K]: V | undefined },
	mapper: (value: V, key: K) => T | undefined,
): { readonly [key in K]?: T };

export function mapObject<K extends string, V, T>(
	object: { readonly [Key in K]: V },
	mapper: (value: V, key: K) => T,
): { readonly [key in K]: T };

export function mapObject<K extends string, V, T>(
	object: { readonly [Key in K]: V | undefined },
	mapper: (value: V, key: K) => T | undefined,
): { readonly [key in K]?: T } {
	const result: { [key in K]?: T } = {};

	for (const [key, value] of object as unknown as Map<K, V>) {
		result[key] = mapper(value, key);
	}

	return result;
}

/**
 * Creates a new array of values given a length and a mapper function.
 */
export function fillArray<T extends defined>(length: number, mapper: (index: number) => T): T[] {
	return new Array(length, 0).map((_, index) => mapper(index));
}
