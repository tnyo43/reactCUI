/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";

import ExecuteVim from "./mode/executeVim";
import Context from "./mode/context";

import "./Vim.css";

interface VimProps {
  exec: ExecuteVim;
  context: Context;
  forceRenderCallback: () => void;
}

export const Vim: React.FC<VimProps> = (props) => {
  const [cursor, setCursor] = useState([0, 0]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      console.log("key down");
      const cursor = props.exec.onKeyDown(event);
      setCursor(cursor);
      props.forceRenderCallback();
    },
    []
  );

  return (
    <div className="vim-app" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="vim-app-edit-area">
        {props.exec.text.map((r, index) => (
          <div key={index}>{r}</div>
        ))}
      </div>
      <div className="vim-mode-text">{props.exec.getModeText()}</div>
      <div
        className="vim-cursor"
        style={{
          top: cursor[0] * 29,
          left: cursor[1] * 12.25,
        }}
      >
        {props.exec.getcursorChar()}
      </div>
    </div>
  );
};
