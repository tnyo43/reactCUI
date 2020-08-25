import Entry, { FileTreatmentError } from '../entry/entry';
import Execute from './execute';
import Context from './context';
import Directory from '../entry/directory';
import File from '../entry/file';


export interface Result {
    username: string,
    entry: Entry,
    command: string,
    result: Array<string>
}

export default class ExecuteCommand implements Execute {
	private _username: string;
	private entry: Entry;
	_context: Context;

	private constructor(_context: Context, username: string, entry: Entry) {
		this._context = _context;
		this._username = username;
		this.entry = entry;
	}

	private static singleton: ExecuteCommand;
	public static getInstance(_context: Context, username: string, entry: Entry): ExecuteCommand {
		if (ExecuteCommand.singleton) {
			return ExecuteCommand.singleton;
		} else {
			const execute = new ExecuteCommand(_context, username, entry);
			ExecuteCommand.singleton = execute;
			return execute;
		}
	}

	private help(command: string): Result {
		const result = [
			"Basic commands"
			,""
			,"pwd :show path of current directory."
			,"cd [dir] :change directory."
			,"ls :list segments."
			,"mkdir [dir] :create new directory."
			,"cat [file] :open txt or md files."
			,"vim [file] :edit file with vim."
		]; 
		return {
			username: this._username,
			entry: this.entry,
			command: command,
			result: result
		};
	}

	private pwd(command: string): Result {
		return {
			username: this._username,
			entry: this.entry,
			command: command,
			result: [this.entry.pwd()]
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
				result: []
			};
		}

		let result: Array<string> = [];

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
					result.push(e.message);
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
			result: this.entry.ls()
		};
	}

	private mkdir(args: Array<string>, command: string): Result {
		if (args.length === 0) {
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: ["usage: mkdir directory"]
			};
		}

		let result: Array<string> = [];

		try {
			this.entry.mkdir(args[0]);
		} catch (e) {
			if (e instanceof FileTreatmentError) {
				result.push(e.message);
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
				result: ["usage: cat file"]
			};
		}

		let result: Array<string> = [];

		try {
			result.push(this.entry.get(args[0], "cat").cat());
		} catch (e) {
			if (e instanceof FileTreatmentError) {
				result.push(e.message);
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

	private vim(args: Array<string>, command: string): Result {
		const filename = args[0];

		let entry: Entry | null = null;
		try {
			entry = this.entry.get(filename, "vim");
		} catch (e) {
			entry = new File(filename);
		}

		if (entry instanceof File) {
			this._context.setVim(entry);
			this._context.changeMode("vim");

			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: []
			};
		} else { // vim cannot edit directory
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: [`vim: ${this.entry.getName()}: Is a directory`]
			};
		}
	}

	public execute(command: string): Result {
		const words = command.split(" ").filter(x => x !== '');
		if (words.length === 0) {
			return {
				username: this._username,
				entry: this.entry,
				command: command,
				result: []
			};
		}

		const args = words.slice(1);

		switch (words[0]) {
			case "help":
				return this.help(command);

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

			case "vim":
				return this.vim(args, command);

			default:
				return {
					username: this._username,
					entry: this.entry,
					command: command,
					result: [`command not found: ${words[0]}`]
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
