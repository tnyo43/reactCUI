import React from "react";
import { Result } from "./mode/executeCommand";

interface CommandHistoryProps {
  history: Array<Result>;
}

const CommandHistory: React.FC<CommandHistoryProps> = (
  props: CommandHistoryProps
) => {
  return (
    <div>
      {props.history.map((data) => (
        <>
          <div className="cli-text">
            <span className="user-span">{data.username}</span>
            <span className="dir-span">{`${data.entry.getName()} $`}</span>
            <span>{data.command}</span>
          </div>
          <div className="cli-result">
            {data.result.map((r, index) => (
              <div key={index}>{r}</div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
};

export default CommandHistory;
