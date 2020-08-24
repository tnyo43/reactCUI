export class FileTreatmentError extends Error {
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

	public add(_entry: Entry): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"add\"");
	}

	public mkdir(_name: string): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"mkdir\"");
	}

	public cd(_name: string): Entry {
		throw new FileTreatmentError("this Entry is NOT able to executable \"cd\"");
	}

	public edit(_content: string) {
		throw new FileTreatmentError("this Entry is NOT able to executable \"edit\"");
	}

	public cat(): string {
		throw new FileTreatmentError("this Entry is NOT able to executable \"cat\"");
	}
}
