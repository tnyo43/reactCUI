import React from 'react';
import CommandHistory from './CommandHistory';
import CommandInput from './CommandInput';
import ExecuteCommand, { Result } from './execute';
import File from './entry/file';
import Directory from './entry/directory';
import './App.css';

interface AppProps {
}

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

class App extends React.Component<AppProps, AppState> {
	private exec: ExecuteCommand;
	private inputRef: React.RefObject<CommandInput>

	constructor(props: AppProps) {
		super(props);

		this.state = {
			history: []
		};

		this.exec = new ExecuteCommand("tomoya", directoryTree());
		this.executeCommand = this.executeCommand.bind(this);
		this.inputRef = React.createRef();
	}

	executeCommand(command: string) {
		const result = this.exec.execute(command);
		this.setState({
			history: this.state.history.concat([result])
		});
	}

	public handleClick = () => {
		if (this.inputRef.current) {
			this.inputRef.current.focus();
		}
		console.log("handleClick");
	}

	render() {
		return (
			<div className="App" onClick={this.handleClick}>
				<CommandHistory history={this.state.history}/>
				<CommandInput
					ref={this.inputRef}
					username={this.exec.username}
					entry={this.exec.dir}
					history={this.state.history.map(result => result.command).filter(command => command.replace(/\s/g, '').length > 0)}
					executeCommand={this.executeCommand}
				/>
			</div>
		);
	}
}

export default App;
