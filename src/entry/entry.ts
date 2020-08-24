export class FileTreatmentError extends Error {
	constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, FileTreatmentError.prototype);
	}
}

export default abstract class Entry {
	private _parent: Entry | null;

	constructor() {
		this._parent = null;
	}

	public abstract getName(): string;

	public get parent() {
		return this._parent;
	}

	public set parent(parent: Entry | null) {
		this._parent = parent;
	}

	public getRoot(): Entry {
		let entry: Entry = this;
		while (entry.parent !== null) entry = entry.parent;
		return entry;
	}

	public add(_entry: Entry): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"add\"");
	}

	public pwd(): string {
		const name = ((this.parent === null) ? "" : this.parent.pwd()) + "/" + this.getName();
		return name.replace("//", "/");
	}

	public mkdir(_name: string): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"mkdir\"");
	}

	public get(_name: string, _command: string): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"get\"");
	}

	public cd(_name: string): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"cd\"");
	}

	public ls(): Array<string> {
		throw new FileTreatmentError("this Entry is NOT able to executable \"ls\"");
	}

	public edit(_content: string) {
		throw new FileTreatmentError("this Entry is NOT able to executable \"edit\"");
	}

	public cat(): string {
		throw new FileTreatmentError("this Entry is NOT able to executable \"cat\"");
	}
}
