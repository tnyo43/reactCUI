import Entry, { FileTreatmentError } from './entry';

export default class Directory extends Entry {
	private name: string;
	private directory: Array<Entry>;

	constructor(name: string) {
		super();
		this.name = name;
		this.directory = [];
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
		const sorted = this.directory.map(e => e.getName()).sort();
		return sorted;
	}

	public getName() {
		return this.name;
	}
}