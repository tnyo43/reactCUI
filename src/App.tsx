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
	const root = new Directory("");
	const product = new Directory("product");
	const documents = new Directory("documents");
	root.add(product);
	root.add(documents);

	const poem = new File("poem.txt");
	const photo = new File("photo.png");
	product.add(poem);
	product.add(photo);

	const memo = new File("memo.txt");
	const note = new File("note.tex");
	documents.add(memo);
	documents.add(note);
	return root;
}

class App extends React.Component<AppProps, AppState> {
	private exec: ExecuteCommand;

	constructor(props: AppProps) {
		super(props);

		this.state = {
			history: []
		};

		this.exec = new ExecuteCommand("tomoya", directoryTree());
		this.executeCommand = this.executeCommand.bind(this);
	}

	executeCommand(command: string) {
		const result = this.exec.execute(command);
		this.setState({
			history: this.state.history.concat([result])
		});
	}

	render() {
		return (
			<div className="App">
				<CommandHistory history={this.state.history}/>
				<CommandInput username={this.exec.username} entry={this.exec.dir} executeCommand={this.executeCommand}/>
			</div>
		);
	}
}

export default App;
