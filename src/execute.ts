import Entry, { FileTreatmentError } from './entry/entry';

export interface Result {
    username: string,
    entry: Entry,
    command: string,
    result: string | null
}

export default class ExecuteCommand {
	private _username: string;
	private entry: Entry;

	constructor(username: string, entry: Entry) {
		this._username = username;
		this.entry = entry;
	}

	private cd(args: Array<string>, command: string): Result {
		const current = this.entry;
		if (args.length === 0) {
			this.entry = this.entry.root();
			while (this.entry.parent !== null) this.entry = this.entry.parent;
			return {
				username: this._username,
				entry: current,
				command: command,
				result: null
			};
		}

		let result: string | null = null;

		if (args[0] === "..") {
			this.entry = (this.entry.parent) ? this.entry.parent : this.entry;
		} else {
			const path = args[0].split("/").filter(x => x !== "");
			try {
				for (let p of path) {
					this.entry = this.entry.cd(p);
				}
			} catch (e) {
				if (e instanceof FileTreatmentError) {
					this.entry = current;
					result = e.message;
				} else {
					throw e;
				}
			}
		}

		return {
			username: this._username,
			entry: current,
			command: command,
			result: result
		};
	}

	public execute(command: string): Result {
		const words = command.split(" ").filter(x => x !== '');
		if (words.length === 0) {
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: null
			};
		}

		const args = words.slice(1);

		switch (words[0]) {
			case "cd":
				return this.cd(args, command);

			default:
				return {
					username: this._username,
					entry: this.entry,
					command: command,
					result: `command not found: ${words[0]}`
				};
		}

	}

	get username() {
		return this._username;
	}

	get dir() {
		return this.entry;
	}
}
