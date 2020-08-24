import React from 'react';
import Entry from './entry/entry'

interface CommandInputProps {
    username: string,
    entry: Entry,
	history: Array<string>
    executeCommand: (command: string) => void
}

interface CommandInputState {
    command: string,
    escapedCommand: string,
    index: number
}

class CommandInput extends React.Component<CommandInputProps, CommandInputState> {
    constructor(props: CommandInputProps) {
        super(props);

        this.state = {
            command: "",
            escapedCommand: "",
            index: 0,
        };

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        let index: number;
        let escapedCommand: string;
        switch (event.keyCode) {
            case 13: // Enter key
                this.props.executeCommand(this.state.command);
                this.setState({
                    command: "",
                    escapedCommand: "",
                    index: this.props.history.length
                });
                break;

            case 38: // ArrowUp key
                escapedCommand =
                    (this.state.index === this.props.history.length)
                        ? this.state.command : this.state.escapedCommand;
                index = Math.max(0, this.state.index - 1);
                this.setState({
                    command: this.props.history[index],
                    escapedCommand: escapedCommand,
                    index: index
                });
                break;

            case 40: // ArrowDown key
                index = Math.min(this.props.history.length, this.state.index + 1);
                this.setState({
                    command: (index === this.props.history.length)? this.state.escapedCommand : this.props.history[index],
                    index: index
                });
                break;
        }
    }

    render() {
        return (
            <div className="input-div">
                <span className="user-span">{this.props.username}</span>
                <span className="dir-span">{`${this.props.entry.getName()} $`}</span>
                <input
                    className="cli-input"
                    onChange={value => this.setState({command: value.target.value})}
                    value={this.state.command}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );
    }
}


export default CommandInput;
