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

	private pwd(command: string): Result {
		return {
			username: this._username,
			entry: this.entry,
			command: command,
			result: this.entry.pwd()
		};
	}

	private cd(args: Array<string>, command: string): Result {
		const current = this.entry;
		if (args.length === 0) {
			this.entry = this.entry.getRoot();
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

	private ls(command: string): Result {
		return {
			username: this._username,
			entry: this.entry,
			command: command,
			result: this.entry.ls().join("\n")
		};
	}

	private mkdir(args: Array<string>, command: string): Result {
		if (args.length === 0) {
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: "usage: mkdir directory"
			};
		}

		let result: string | null = null;

		try {
			this.entry.mkdir(args[0]);
		} catch (e) {
			if (e instanceof FileTreatmentError) {
				result = e.message;
			} else {
				throw e;
			}
		}

		return {
			username: this._username,
			entry: this.entry,
			command: command,
			result: result
		};
	}

	private cat(args: Array<string>, command: string): Result {
		if (args.length === 0) {
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: "usage: cat file"
			};
		}

		let result: string | null = null;

		try {
			result = this.entry.get(args[0], "cat").cat();
		} catch (e) {
			if (e instanceof FileTreatmentError) {
				result = e.message;
			} else {
				throw e;
			}
		}

		return {
			username: this._username,
			entry: this.entry,
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
			case "pwd":
				return this.pwd(command);

			case "cd":
				return this.cd(args, command);

			case "ls":
				return this.ls(command);

			case "mkdir":
				return this.mkdir(args, command);

			case "cat":
				return this.cat(args, command);

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
