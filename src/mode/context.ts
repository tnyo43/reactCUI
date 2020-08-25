import Execute from './execute';
import ExecuteCommand from './executeCommand';
import ExecuteVim from './executeVim';

import Entry from '../entry/entry';
import File from '../entry/file';
import { timeStamp } from 'console';


export type Mode = "normal" | "vim";

export default class Context {
	private mode: Mode;
	private executeCommand: ExecuteCommand;
	private executeVim: ExecuteVim;

	private constructor(username: string, entry: Entry) {
		this.mode = "normal";
		this.executeCommand = ExecuteCommand.getInstance(this, username, entry);
		this.executeVim = ExecuteVim.getInstance(this);
	}
	private static singleton: Context;
	static getInstance(username: string, entry: Entry): Context {
		if (this.singleton) {
			return this.singleton;
		} else {
			const cxt = new Context(username, entry);
			this.singleton = cxt;
			return cxt;
		}
	}

	getMode() {
		return this.mode;
	}

	getExecute(): Execute {
		switch (this.mode) {
			case "normal":
				return this.executeCommand;
			case "vim":
				return this.executeVim;
		}
	}

	setVim(file: File) {
		this.executeVim.file = file;
	}

	changeMode(mode: Mode) {
		console.log(`CHANGE MODE: ${this.mode} -> ${mode}`);
		this.mode = mode;
	}
}