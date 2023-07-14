import { contains, createQuadtree } from "server/utils/quadtree";
import { benchmark } from "shared/utils/benchmark";

export = benchmark({
	parameters: () => {
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
	},

	functions: {
		quadtreeQuery: (profiler, { quadtree, queries }) => {
			for (const query of queries) {
				quadtree.query(query);
			}
		},

		quadtreeRemove: (profiler, { quadtree, items }) => {
			for (const item of items) {
				quadtree.remove(item);
			}
		},

		quadtreeReplace: (profiler, { quadtree, items }) => {
			for (const item of items) {
				quadtree.replace(item, new Vector3(100 * math.random(), 100 * math.random()));
			}
		},

		bruteforceQuery: (profiler, { items, queries }) => {
			for (const query of queries) {
				const results = [];

				for (const item of items) {
					if (contains(query, item)) {
						results.push(item);
					}
				}
			}
		},
	},
});
