import React from 'react';
import CommandHistory from './CommandHistory';
import './App.css';

interface AppProps {
}

interface AppState {
	history: Array<string>;
}

class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = {
			history: ["test", "test2", "xxxxx", "iiiii"]
		};
	}

	render() {
		return (
			<div className="App">
				<CommandHistory history={this.state.history}/>
			</div>
		);
	}
}

export default App;
