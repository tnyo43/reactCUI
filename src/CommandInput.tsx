import React from 'react';
import Entry from './entry/entry'

interface CommandInputProps {
    username: string,
    entry: Entry,
    executeCommand: (command: string) => void
}

interface CommandInputState {
    text: string
}

class CommandInput extends React.Component<CommandInputProps, CommandInputState> {
    constructor(props: CommandInputProps) {
        super(props);

        this.state = {
            text: ""
        };

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.keyCode === 13) { // Enter Key
            this.props.executeCommand(this.state.text);
            this.setState({text: ""});
        }
    }

    render() {
        return (
            <div className="input-div">
                <span className="user-span">{this.props.username}</span>
                <span className="dir-span">{`${this.props.entry.getName()} $`}</span>
                <input
                    className="cli-input"
                    onChange={value => this.setState({text: value.target.value})}
                    value={this.state.text}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );
    }
}


export default CommandInput;
