import { Quadtree, Rectangle, contains, createQuadtree } from "server/utils/quadtree";

interface Parameters {
	items: Set<Vector3>;
	quadtree: Quadtree;
	queries: Rectangle[];
}

export function ParameterGenerator(): Parameters {
	const items = new Set<Vector3>();
	const queries = [];
	const quadtree = createQuadtree(new Vector2(100, 100), { maxDepth: 10, maxItems: 50 });

	for (const _ of $range(0, 1000)) {
		const point = new Vector3(100 * math.random(), 100 * math.random());
		items.add(point);
		quadtree.insert(point);
	}

	for (const _ of $range(0, 50)) {
		queries.push({
			position: new Vector2(100 * math.random(), 100 * math.random()),
			size: new Vector2(100 * math.random(), 100 * math.random()),
		});
	}

	return { items, quadtree, queries };
}

export namespace Functions {
	export function quadtreeQuery(profiler: unknown, { quadtree, queries }: Parameters) {
		for (const query of queries) {
			quadtree.query(query);
		}
	}

	export function quadtreeRemove(profiler: unknown, { quadtree, items }: Parameters) {
		for (const item of items) {
			quadtree.remove(item);
		}
	}

	export function quadtreeReplace(profiler: unknown, { quadtree, items }: Parameters) {
		for (const item of items) {
			quadtree.replace(item, new Vector3(100 * math.random(), 100 * math.random()));
		}
	}

	export function bruteforceQuery(profiler: unknown, { items, queries }: Parameters) {
		for (const query of queries) {
			const results = [];

			for (const item of items) {
				if (contains(query, item)) {
					results.push(item);
				}
			}
		}
	}
}
