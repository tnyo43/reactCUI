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

	const root = new Directory("");
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
		expect(execute.execute("cd hoge").result).toEqual("cd: no such file or directory: hoge");
		expect(execute.execute("cd poem.txt").result).toEqual("cd: not a directory: poem.txt");
		execute.execute("cd ..");
		expect(execute.dir).toBe(root);
		execute.execute("cd documents/subdocuments");
		expect(execute.dir).toBe(subDocument);
	});

	test("'ls'は子を表示する", () => {
		execute.execute("cd ..");
		expect(execute.execute("ls").result).toEqual("memo.txt\nnote.tex\nsubdocuments");
	});

	test("'mkdir xxx'は子にEntry xxxがないのみ成功する", () => {
		expect(execute.execute("mkdir subdocuments").result).toEqual("mkdir: subdocuments: File exists");
		expect(execute.execute("mkdir newdocuments").result).toEqual(null);
		expect(execute.execute("ls").result).toEqual("memo.txt\nnewdocuments\nnote.tex\nsubdocuments");
	});
});
