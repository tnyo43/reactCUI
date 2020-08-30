import Execute from './execute';
import Context from './context';
import File from '../entry/file'
import Entry from '../entry/entry';
import Directory from '../entry/directory';


type VimMode = "insert" | "command" | "colon"

export default class ExecuteVim implements Execute {
	private _context: Context;
	private _file: File;
	private entry: Entry;
	private _text: Array<string>;
	private mode: VimMode;
	private colon: string;
	private _cursor: [number, number];

	private constructor(_context: Context) {
		this._context = _context;
		this.entry = Directory.root();
		this._file = new File("");
		this._text = [""];
		this.mode = "command";
		this.colon = "";
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

	private splitTextByEnter() {
		let txt = this._text.slice(0, this.cursor[0]);
		const target = this._text[this.cursor[0]];
		txt = txt.concat([
			target.substring(0, this.cursor[1]),
			target.substring(this.cursor[1], target.length)
		]);
		txt = txt.concat(this._text.slice(this.cursor[0]+1));
		this._text = txt;
	}



	private backCursor() {
		if (this._cursor[0] === 0) {
			this.cursor = [0, this._cursor[1]-1];
		}
		if (this._cursor[1] === 0) {
		} else {
		}
	}


	private delete() {
		if (this._cursor[0] === 0 && this._cursor[1] === 0) {
			return;
		}

		const h = this._cursor[0], w = this._cursor[1];
		if (w === 0) {
			this._cursor[0]--;
			this._cursor[1] = this._text[this._cursor[0]].length;

			let txt = this._text.slice(0, h-1);
			txt.push(this._text[h-1] + this._text[h]);
			txt = txt.concat(this._text.slice(h+1));
			this._text = txt;
		} else {
			this._cursor[1]--;
			this._text[h] = this._text[h].slice(0, w-1).concat(this._text[h].slice(w));
		}
	}

	private executeColon() {
		if (this.colon.indexOf("w") > -1) {
			if (this._file.parent !== this.entry) {
				this.entry.add(this._file);
			}
			this._file.edit(this.text.join("\n"));
		}
		if (this.colon.indexOf("q") > -1) {
			this._context.changeMode("normal");
			this.cursor = [0, 0];
		}

		this.colon = "";
	}

	private insertText(s: string) {
		if (s.length !== 1) {
			return;
		}
		const h = this.cursor[0]
		const w = this.cursor[1];
		const ori = this._text[h];
		this._text[h] = ori.slice(0, w) + s + ori.slice(w);
	}

    public onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
		console.log(this);
		switch (this.mode) {
			case "command":
				return this.commandKeyDown(event)
			case "colon":
				return this.colonKeyDown(event);
			case "insert":
				return this.insertKeyDown(event);
		}
	}

	private insertKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
        switch (event.keyCode) {
			case 27: // Esc
				this.mode = "command";
				break;
			case 13: // Enter
				this.splitTextByEnter();
				this.cursor = [this._cursor[0]+1, 0];
				break;
			case 8: // backspace
				this.delete();
				break;
			default:
				this.insertText(event.key);
				this.cursor = [this._cursor[0], this._cursor[1]+1];
		}
		return this.cursor;
	}

	private commandKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
		console.log(event.keyCode);
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
			case 13: // Enter
				this.cursor = [this._cursor[0]+1, this._cursor[1]];
				break;
			case 75: // k
				this.cursor = [this._cursor[0]-1, this._cursor[1]];
				break;
			case 76: // l
				this.cursor = [this._cursor[0], this._cursor[1]+1];
				break;
			case 186: // : (colon)
				this.mode = "colon";
				break;
		}
		return this.cursor;
	}

	private colonKeyDown(event: React.KeyboardEvent<HTMLInputElement>): [number, number] {
        switch (event.keyCode) {
			case 13: // Enter
				this.executeColon();
				this.mode = "command";
				break;
			case 81: // q
				this.colon = this.colon + "q";
				break;
			case 87: // w
				this.colon += "w"
				break;
		}
		return this.cursor;
	}

	public getModeText() {
		switch (this.mode) {
			case "command":
				return "-- COMMAND --";
			case "colon":
				return ":" + this.colon;
			case "insert":
				return "-- INSERT --";
		}
	}

	public getcursorChar() {
		const h = this.cursor[0];
		const w = this.cursor[1];
		return (w >= this.text[h].length) ? " " : this.text[h][w];
	}

	setFile(file: File, directory: Entry) {
		this.entry = directory;
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
		if (this._text.length === 0) {
			this._cursor = [0, 0];
		}
		this._cursor[0] = Math.max(0, Math.min(this._text.length-1, c[0]));
		this._cursor[1] = Math.min(this._text[this._cursor[0]].length, Math.max(0, c[1]));
	}

	get cursor(): [number, number] {
		return this._cursor;
	}
}