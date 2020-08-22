import React from 'react';

interface CommandHistoryProps {
    history: Array<string>
}

const CommandHistory: React.FC<CommandHistoryProps> = (props: CommandHistoryProps) => {
    return (
        <div>
            {props.history.map(data => <div className="cli-text">{data}</div>)}
        </div>
    );
}


export default CommandHistory;
