import React from 'react';

interface CommandInputProps {
    username: string,
    executeCommand: (username: string, dir: string, command: string) => void
}

interface CommandInputState {
    dir: string,
    text: string
}

class CommandInput extends React.Component<CommandInputProps, CommandInputState> {
    constructor(props: CommandInputProps) {
        super(props);

        this.state = {
            dir: "/",
            text: ""
        };

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.keyCode === 13) { // Enter Key
            this.props.executeCommand(this.props.username, this.state.dir, this.state.text);
            this.setState({text: ""});
        }
    }

    render() {
        return (
            <div className="input-div">
                <span className="user-span">{this.props.username}</span>
                <span className="dir-span">{this.state.dir}</span>
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
