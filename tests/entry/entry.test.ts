import File from '../../src/entry/file';
import Directory from '../../src/entry/directory';

describe("directory", () => {
	/**
	 *  root
	 *    |- product
	 *         |- poem.txt
	 *         |- photo.png
	 *    |- document
	 *         |- memo.txt
	 *         |- note.tex
	 */

	const root = Directory.root();
	const product = new Directory("product");
	const documents = new Directory("documents");
	root.add(product);
	root.add(documents);

	const poem = new File("poem.txt");
	const photo = new File("photo.png");
	product.add(poem);
	product.add(photo);

	const memo = new File("memo.txt");
	const note = new File("note.tex");
	documents.add(memo);
	documents.add(note);

	test("get parent", () => {
		expect(note.parent).toBe(documents);
		expect(documents.parent).toBe(root);
		expect(root.parent).toBe(null);
	});

	test("cdは子に同名のDirectoryEntryがあれば、またその時のみ成功する", () => {
		expect(() => documents.cd("notexists")).toThrowError();
		expect(root.cd("product")).toBe(product);
		expect(() => product.cd("photo.png")).toThrowError();
	});

	test("lsは子の一覧", () => {
		expect(documents.ls()).toEqual(["memo.txt", "note.tex"])
	});

	test("mkdirは子に同名のEntryがない、またその時のみ成功する", () => {
		expect(() => documents.mkdir("submit")).not.toThrowError();
		expect(() => documents.mkdir("memo.txt")).toThrowError();
		expect(() => root.mkdir("documents")).toThrowError();
	});

	test("cat, editはFileEntryのみ可能", () => {
		expect(memo.cat()).toBe("");
		expect(() => memo.edit("hogehoge")).not.toThrowError();
		expect(memo.cat()).toBe("hogehoge");
		expect(() => documents.edit("error")).toThrowError();
	});
});