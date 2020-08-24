import Entry, { FileTreatmentError } from './entry';

export default class Directory extends Entry {
	private name: string;
	private directory: Array<Entry>;

	constructor(name: string) {
		super();
		if (name === "") {
			throw new FileTreatmentError(`directory with empty name is invalid`);
		}
		this.name = name;
		this.directory = [];
	}

	public static root() {
		return (() => {
			const root = new Directory("root");
			root.name = "";
			return root;
		})();
	}

	public add(entry: Entry): Entry {
		this.directory.push(entry);
		entry.parent = this;
		return entry;
	}

	public mkdir(name: string): Entry {
		this.directory.forEach(entry => {
			if (entry.getName() === name) {
				throw new FileTreatmentError(`mkdir: ${name}: File exists`);
			}
		});
		const newdir = new Directory(name)
		this.add(newdir);
		return newdir;
	}

	public cd(name: string): Entry {
		for (let entry of this.directory) {
			if (entry.getName() !== name) 
				continue;

			if (entry instanceof Directory) {
				return entry;
			} else {
				throw new FileTreatmentError(`cd: not a directory: ${name}`);
			}
		}
		throw new FileTreatmentError(`cd: no such file or directory: ${name}`);
	}

	public ls(): Array<string> {
		console.log(this.directory);
		return this.directory.map(e => e.getName()).sort();
	}

	public getName() {
		return this.name;
	}
}
