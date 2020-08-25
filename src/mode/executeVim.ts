import Execute from './execute';
import Context from './context';
import File from '../entry/file'

export default class ExecuteVim implements Execute {
	_context: Context;
	file: File | null;

	private constructor(_context: Context) {
		this._context = _context;
		this.file = null;
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

	setFile(file: File) {
		this.file = file;
	}
}