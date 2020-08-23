import React from 'react';

interface CommandHistoryProps {
    history: Array<[string, string, string]>
}

const CommandHistory: React.FC<CommandHistoryProps> = (props: CommandHistoryProps) => {
    return (
        <div>
            {props.history.map(data =>
                console.log(data))
            }
            {props.history.map(data =>
                <div className="cli-text">
                    <span className="user-span">{data[0]}</span>
                    <span className="dir-span">{data[1]}</span>
                    <span>{data[2]}</span>
                </div>
            )}
        </div>
    );
}


export default CommandHistory;
