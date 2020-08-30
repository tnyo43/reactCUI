import React from 'react';
import CommandHistory from './CommandHistory';
import CommandInput from './CommandInput';

import File from './entry/file';
import Directory from './entry/directory';

import Context from './mode/context';
import ExecuteCommand, { Result } from './mode/executeCommand';
import ExecuteVim from './mode/executeVim';

import Vim from './Vim'

import './App.css';


interface AppState {
	history: Array<Result>
}

const directoryTree = () => {
	const root = Directory.root();
	const product = new Directory("product");
	const documents = new Directory("documents");
	root.add(product);
	root.add(documents);

	const poem = new File("poem.txt");
	poem.edit("poepoe poem");
	const photo = new File("photo.png");
	product.add(poem);
	product.add(photo);

	const memo = new File("memo.txt");
	memo.edit("memo is memorial");
	const note = new File("note.tex");
	documents.add(memo);
	documents.add(note);
	return root;
}

class App extends React.Component<{}, AppState> {
	private _context: Context;
	private inputRef: React.RefObject<CommandInput>

	constructor(props: {}) {
		super(props);

		this.state = {
			history: []
		};

		this._context = Context.getInstance("tomoya", directoryTree());

		this.executeCommand = this.executeCommand.bind(this);
		this.forceRenderCallback = this.forceRenderCallback.bind(this);
		this.inputRef = React.createRef();
	}

	executeCommand(command: string) {
		const exec = this._context.getExecute();
		if (exec instanceof ExecuteCommand) {
			const result = exec.execute(command);
			this.setState({
				history: this.state.history.concat([result])
			});
		}
	}

	public handleClick = () => {
		if (this.inputRef.current) {
			this.inputRef.current.focus();
		}
	}

	forceRenderCallback() {
		this.forceUpdate();
	}

	render() {
		const exec = this._context.getExecute();

		if (exec instanceof ExecuteCommand) {
			return (
				<div className="App" onClick={this.handleClick}>
					<div className="cli-result">
                        {"type 'help' to show commands"}
                    </div>
					<CommandHistory history={this.state.history}/>
					<CommandInput
						ref={this.inputRef}
						username={exec.username}
						entry={exec.dir}
						history={this.state.history.map(result => result.command).filter(command => command.replace(/\s/g, '').length > 0)}
						executeCommand={this.executeCommand}
					/>
				</div>
			);
		} else if (exec instanceof ExecuteVim) {
			return (
				<Vim exec={exec} forceRenderCallback={this.forceRenderCallback} context={this._context}/>
			)
		}
	}
}

export default App;
