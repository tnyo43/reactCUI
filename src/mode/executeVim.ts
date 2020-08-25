import Execute from './execute';
import Context from './context';
import File from '../entry/file'


type VimMode = "insert" | "command"

export default class ExecuteVim implements Execute {
	_context: Context;
	private _file: File;
	private _text: Array<string>;
	private mode: VimMode;
	_cursor: [number, number];

	private constructor(_context: Context) {
		this._context = _context;
		this._file = new File("");
		this._text = [];
		this.mode = "command";
		this._cursor = [0, 0];
	}

	private static singleton: ExecuteVim;
	static getInstance(_context: Context): ExecuteVim {
		if (ExecuteVim.singleton) {
			return ExecuteVim.singleton;
		} else {
			const execute = new ExecuteVim(_context);
			ExecuteVim.singleton = execute;
			return execute;
		}
	}


    public onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
		if (this.mode === "insert") {
			return this.insertKeyDown(event)
		} else {
			return this.commandKeyDown(event)
		}
	}

	private insertKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
        switch (event.keyCode) {
			case 27: // Esc
				this.mode = "command";
		}
		return this.cursor;
	}

	private commandKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
        switch (event.keyCode) {
			case 65: // a
				this.mode = "insert";
				this.cursor = [this._cursor[0], this._cursor[1]+1];
				break;
			case 73: // i
				this.mode = "insert";
				break;
			case 72: // h
				this.cursor = [this._cursor[0], this._cursor[1]-1];
				break;
			case 74: // j
				this.cursor = [this._cursor[0]+1, this._cursor[1]];
				break;
			case 75: // k
				this.cursor = [this._cursor[0]-1, this._cursor[1]];
				break;
			case 76: // l
				this.cursor = [this._cursor[0], this._cursor[1]+1];
				break;
		}
		return this.cursor;
	}

	public getModeText() {
		switch (this.mode) {
			case "command":
				return "-- COMMAND --";
			case "insert":
				return "-- INSERT --";
		}
	}

	public getcursorChar() {
		const h = this.cursor[0];
		const w = this.cursor[1];
		return (w >= this.text[h].length) ? " " : this.text[h][w];
	}

	set file(file: File) {
		this._file = file;
		this._text = file.cat().split("\n");
	}

	get file(): File {
		return this._file;
	}

	get text(): Array<string> {
		return this._text;
	}

	set cursor(c: [number, number]) {
		this._cursor[0] = Math.min(this._text.length-1, Math.max(0, c[0]));
		this._cursor[1] = Math.min(this._text[this._cursor[0]].length, Math.max(0, c[1]));
	}

	get cursor(): [number, number] {
		return this._cursor;
	}
}