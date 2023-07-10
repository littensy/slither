/// <reference types="@rbxts/testez/globals" />

import { Rectangle, contains, createQuadtree } from "server/utils/quadtree";

export = () => {
	it("should add items", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 4 });

		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));
		tree.insert(new Vector3(30, 30));

		expect(tree.items.size()).to.equal(3);
		expect(tree.children.size()).to.equal(0);
	});

	it("should split", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 2 });

		// first quadrant
		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));

		// fourth quadrant (to force a split)
		tree.insert(new Vector3(100, 100));

		expect(tree.items.size()).to.equal(0);
		expect(tree.children.size()).to.equal(4);
		expect(tree.children[0].items.size()).to.equal(2);
		expect(tree.children[3].items.size()).to.equal(1);

		// second quadrant
		tree.insert(new Vector3(60, 10));
		tree.insert(new Vector3(70, 20));

		expect(tree.items.size()).to.equal(0);
		expect(tree.children.size()).to.equal(4);
		expect(tree.children[0].items.size()).to.equal(2);
		expect(tree.children[1].items.size()).to.equal(2);
		expect(tree.children[3].items.size()).to.equal(1);
	});

	it("should remove items", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 2 });

		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));
		tree.insert(new Vector3(100, 100));

		expect(tree.size()).to.equal(3);
		expect(tree.children[0].items.size()).to.equal(2);

		tree.remove(new Vector3(10, 10));

		expect(tree.size()).to.equal(2);
		expect(tree.children[0].items.size()).to.equal(1);
	});

	it("should query items in a boundary", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 2 });

		// first quadrant
		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));
		tree.insert(new Vector3(30, 30));

		// second quadrant
		tree.insert(new Vector3(60, 10));
		tree.insert(new Vector3(70, 20));
		tree.insert(new Vector3(80, 30));

		const items = tree.query({
			position: new Vector2(0, 0),
			size: new Vector2(60, 60),
		});

		expect(items.includes(new Vector3(10, 10))).to.equal(true);
		expect(items.includes(new Vector3(20, 20))).to.equal(true);
		expect(items.includes(new Vector3(30, 30))).to.equal(true);
		expect(items.includes(new Vector3(60, 10))).to.equal(true);

		expect(items.includes(new Vector3(70, 20))).to.equal(false);
		expect(items.includes(new Vector3(80, 30))).to.equal(false);
	});

	it("should query items in a range", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 2 });

		// first quadrant
		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));
		tree.insert(new Vector3(30, 30));

		// second quadrant
		tree.insert(new Vector3(60, 10));
		tree.insert(new Vector3(70, 20));
		tree.insert(new Vector3(80, 30));

		const items = tree.queryRange({
			position: new Vector2(0, 0),
			radius: 61, // barely includes the 60, 10 item
		});

		expect(items.includes(new Vector3(10, 10))).to.equal(true);
		expect(items.includes(new Vector3(20, 20))).to.equal(true);
		expect(items.includes(new Vector3(30, 30))).to.equal(true);
		expect(items.includes(new Vector3(60, 10))).to.equal(true);

		expect(items.includes(new Vector3(70, 20))).to.equal(false);
		expect(items.includes(new Vector3(80, 30))).to.equal(false);
	});

	it("should query the correct items", () => {
		const tree = createQuadtree(new Vector2(100, 100));
		const items: Vector3[] = [];
		const queries: Rectangle[] = [];

		for (const _ of $range(0, 10)) {
			const position = new Vector3(math.random(0, 100), math.random(0, 100));
			items.push(position);
			tree.insert(position);
		}

		for (const _ of $range(0, 10)) {
			queries.push({
				position: new Vector2(math.random(0, 100), math.random(0, 100)),
				size: new Vector2(math.random(0, 100), math.random(0, 100)),
			});
		}

		for (const query of queries) {
			const expected = items.filter((item) => contains(query, item));
			const actual = tree.query(query);

			for (const item of expected) {
				expect(actual.includes(item)).to.equal(true);
			}

			for (const item of actual) {
				expect(expected.includes(item)).to.equal(true);
			}
		}
	});

	it("should replace items", () => {
		const tree = createQuadtree(new Vector2(100, 100), { maxItems: 2 });

		tree.insert(new Vector3(10, 10));
		tree.insert(new Vector3(20, 20));
		tree.insert(new Vector3(60, 60));

		expect(tree.size()).to.equal(3);
		expect(tree.children[0].items.has(new Vector3(10, 10))).to.equal(true);

		tree.replace(new Vector3(10, 10), new Vector3(40, 40));

		expect(tree.size()).to.equal(3);
		expect(tree.children[0].items.has(new Vector3(10, 10))).to.equal(false);
		expect(tree.children[0].items.has(new Vector3(40, 40))).to.equal(true);
	});
};
