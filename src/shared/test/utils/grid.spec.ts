/// <reference types="@rbxts/testez/globals" />

import { createGrid } from "shared/utils/grid";

export = () => {
	it("should insert points", () => {
		const grid = createGrid(10);

		grid.insert(new Vector2(5, 5));
		expect(grid.cells.size()).to.equal(1);
		expect(grid.cells.has(new Vector3(0, 0))).to.equal(true);
		expect(grid.cells.get(new Vector3(0, 0))?.has(new Vector3(5, 5))).to.equal(true);

		grid.insert(new Vector2(6, 6));
		expect(grid.cells.size()).to.equal(1);
		expect(grid.cells.get(new Vector3(0, 0))?.has(new Vector3(6, 6))).to.equal(true);

		grid.insert(new Vector2(15, 15));
		expect(grid.cells.size()).to.equal(2);
		expect(grid.cells.has(new Vector3(1, 1))).to.equal(true);
		expect(grid.cells.get(new Vector3(1, 1))?.has(new Vector3(15, 15))).to.equal(true);
	});

	it("should remove points", () => {
		const grid = createGrid(10);
		grid.insert(new Vector2(5, 5));
		grid.insert(new Vector2(6, 6));

		grid.remove(new Vector2(5, 5));
		expect(grid.cells.size()).to.equal(1);
		expect(grid.cells.get(new Vector3(0, 0))?.has(new Vector3(5, 5))).to.equal(false);
		expect(grid.cells.get(new Vector3(0, 0))?.has(new Vector3(6, 6))).to.equal(true);

		grid.remove(new Vector2(6, 6));
		expect(grid.cells.size()).to.equal(0);
	});

	it("should replace points", () => {
		const grid = createGrid(10);
		grid.insert(new Vector2(5, 5));
		grid.replace(new Vector2(5, 5), new Vector2(15, 15));
		expect(grid.cells.size()).to.equal(1);
		expect(grid.cells.get(new Vector3(1, 1))?.has(new Vector3(15, 15))).to.equal(true);
	});

	it("should find the nearest point", () => {
		const grid = createGrid(10);
		grid.insert(new Vector2(5, 5));
		grid.insert(new Vector2(15, 15));
		grid.insert(new Vector2(100, 100));

		const nearest = grid.nearest(new Vector2(0, 0), 10);
		expect(nearest).to.be.ok();
		expect(nearest?.position).to.equal(new Vector2(5, 5));

		const nearest2 = grid.nearest(new Vector2(0, 0), 1);
		expect(nearest2).to.never.be.ok();

		const nearest3 = grid.nearest(new Vector2(70, 70), 100);
		expect(nearest3).to.be.ok();
		expect(nearest3?.position).to.equal(new Vector2(100, 100));
	});

	it("should query points in a box", () => {
		const grid = createGrid(5);
		grid.insert(new Vector2(5, 5));
		grid.insert(new Vector2(15, 15));
		grid.insert(new Vector2(-3, -3));
		grid.insert(new Vector2(100, 100));

		const points = grid.queryBox(new Vector2(-4, -4), new Vector2(4 + 15, 4 + 17));
		expect(points.size()).to.equal(3);
		expect(points.find((point) => point.position === new Vector2(5, 5))).to.be.ok();
		expect(points.find((point) => point.position === new Vector2(15, 15))).to.be.ok();
		expect(points.find((point) => point.position === new Vector2(-3, -3))).to.be.ok();
		expect(points.find((point) => point.position === new Vector2(100, 100))).to.never.be.ok();
	});

	it("should query points in a range", () => {
		const grid = createGrid(5);
		grid.insert(new Vector2(5, 5));
		grid.insert(new Vector2(15, 15));
		grid.insert(new Vector2(-3, -3));
		grid.insert(new Vector2(100, 100));

		const points = grid.queryRange(new Vector2(0, 0), 10);
		expect(points.size()).to.equal(2);
		expect(points.find((point) => point.position === new Vector2(5, 5))).to.be.ok();
		expect(points.find((point) => point.position === new Vector2(-3, -3))).to.be.ok();
		expect(points.find((point) => point.position === new Vector2(15, 15))).to.never.be.ok();
		expect(points.find((point) => point.position === new Vector2(100, 100))).to.never.be.ok();
	});
};
