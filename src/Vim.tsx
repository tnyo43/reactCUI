import React from "react";

import ExecuteVim from "./mode/executeVim";

import "./Vim.css";
import Context from "./mode/context";

interface VimProps {
  exec: ExecuteVim;
  context: Context;
  forceRenderCallback: () => void;
}

interface VimState {
  cursor: [number, number];
}

export default class Vim extends React.Component<VimProps, VimState> {
  constructor(props: VimProps) {
    super(props);

    this.state = {
      cursor: this.props.exec.cursor,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const cursor = this.props.exec.onKeyDown(event);
    this.setState({ cursor: cursor });
    if (this.props.context.getMode() !== "vim") {
      this.props.forceRenderCallback();
    }
  }

  render() {
    return (
      <div className="vim-app" onKeyDown={this.onKeyDown} tabIndex={0}>
        <div className="vim-app-edit-area">
          {this.props.exec.text.map((r, index) => (
            <div key={index}>{r}</div>
          ))}
        </div>
        <div className="vim-mode-text">{this.props.exec.getModeText()}</div>
        <div
          className="vim-cursor"
          style={{
            top: this.state.cursor[0] * 29,
            left: this.state.cursor[1] * 12.25,
          }}
        >
          {this.props.exec.getcursorChar()}
        </div>
      </div>
    );
  }
}
