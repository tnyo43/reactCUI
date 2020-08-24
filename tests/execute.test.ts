import File from '../src/entry/file';
import Directory from '../src/entry/directory';
import ExecuteCommand from '../src/execute';

describe("Execute", () => {
	/**
	 *  root
	 *    |- product
	 *         |- poem.txt
	 *         |- photo.png
	 *    |- document
	 *         |- memo.txt
	 *         |- note.tex
	 */

	const root = new Directory("/");
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
	const subDocument = new Directory("subdocuments");
	documents.add(memo);
	documents.add(note);
	documents.add(subDocument);

	const execute = new ExecuteCommand("test", root);

	test("'cd xxx'は子にDirectoryEntry xxxがあるときのみ成功する", () => {
		expect(execute.execute("cd").entry).toBe(root);
		execute.execute("cd product");
		expect(execute.dir).toBe(product);
		expect(execute.execute("cd hoge").result).toBe("cd: no such file or directory: hoge");
		expect(execute.execute("cd poem.txt").result).toBe("cd: not a directory: poem.txt");
		execute.execute("cd ..");
		expect(execute.dir).toBe(root);
		execute.execute("cd documents/subdocumesnts");
		expect(execute.dir).toBe(subDocument);
	});
});
