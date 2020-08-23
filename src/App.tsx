import React from 'react';
import CommandHistory from './CommandHistory';
import CommandInput from './CommandInput';
import './App.css';

interface AppProps {
}

interface AppState {
	history: Array<[string, string, string]>;
}

class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = {
			history: []
		};

		this.executeCommand = this.executeCommand.bind(this);
	}

	executeCommand(user: string, dir: string, command: string) {
		console.log("executeCommand", command);
		this.setState({history: this.state.history.concat([[user, dir, command]])});
	}

	render() {
		return (
			<div className="App">
				<CommandHistory history={this.state.history}/>
				<CommandInput username="tomoya" executeCommand={this.executeCommand}/>
			</div>
		);
	}
}

export default App;
