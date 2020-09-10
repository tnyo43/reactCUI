import React, { createRef, useRef, useState, useCallback } from "react";
import { CommandHistory } from "./CommandHistory";
import CommandInput from "./CommandInput";

import File from "./entry/file";
import Directory from "./entry/directory";

import Context from "./mode/context";
import ExecuteCommand, { Result } from "./mode/executeCommand";
import ExecuteVim from "./mode/executeVim";

import { Vim } from "./Vim";

import "./App.css";

const directoryTree = () => {
  const root = Directory.root();
  const product = new Directory("product");
  const documents = new Directory("documents");
  root.add(product);
  root.add(documents);

  const poem = new File("poem.txt");
  poem.edit("poepoe poem");
  const photo = new File("photo.png");
  product.add(poem);
  product.add(photo);

  const memo = new File("memo.txt");
  memo.edit("memo is memorial");
  const note = new File("note.tex");
  documents.add(memo);
  documents.add(note);
  return root;
};

export const App: React.FC = () => {
  const _context = Context.getInstance("tomoya", directoryTree());
  const inputRef = useRef(createRef<CommandInput>());

  const [history, setHistory] = useState(Array<Result>(0));
  const [, forceUpdate] = useState(false);

  const executeCommand = (command: string) => {
    const exec = _context.getExecute();
    if (exec instanceof ExecuteCommand) {
      const result = exec.execute(command);
      setHistory(history.concat([result]));
    }
  };

  const handleClick = useCallback(() => {
    const ref = inputRef.current;
    ref?.current?.focus();
  }, []);

  const forceRenderCallback = useCallback(() => {
    forceUpdate((n) => !n);
  }, []);

  const exec = _context.getExecute();

  console.log(_context, exec);
  if (exec instanceof ExecuteCommand) {
    return (
      <div className="App" onClick={handleClick}>
        <div className="cli-result">{"type 'help' to show commands"}</div>
        <CommandHistory history={history} />
        <CommandInput
          ref={inputRef.current}
          username={exec.username}
          entry={exec.dir}
          history={history
            .map((result) => result.command)
            .filter((command) => command.replace(/\s/g, "").length > 0)}
          executeCommand={executeCommand}
        />
      </div>
    );
  } else if (exec instanceof ExecuteVim) {
    return (
      <Vim
        exec={exec}
        forceRenderCallback={forceRenderCallback}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        context={_context}
      />
    );
  } else {
    return <></>;
  }
};
