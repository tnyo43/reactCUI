import React, { useState } from "react";

import ExecuteVim from "./mode/executeVim";

import "./Vim.css";
import Context from "./mode/context";

interface VimProps {
  exec: ExecuteVim;
  context: Context;
  forceRenderCallback: () => void;
}

export const Vim: React.FC<VimProps> = ({
  exec,
  context,
  forceRenderCallback,
}) => {
  const [cursor, setCursor] = useState<number[]>([]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCursor(exec.onKeyDown(event));

    if (context.getMode() !== "vim") {
      forceRenderCallback();
    }
  };

  return (
    <div className="vim-app" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="vim-app-edit-area">
        {exec.text.map((r, index) => (
          <div key={index}>{r}</div>
        ))}
      </div>
      <div className="vim-mode-text">{exec.getModeText()}</div>
      <div
        className="vim-cursor"
        style={{
          top: cursor[0] * 29,
          left: cursor[1] * 12.25,
        }}
      >
        {exec.getcursorChar()}
      </div>
    </div>
  );
};
