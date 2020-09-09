import Entry, { FileTreatmentError } from "./entry";

export default class Directory extends Entry {
  private name: string;
  private directory: Array<Entry>;

  constructor(name: string) {
    super();
    if (name === "") {
      throw new FileTreatmentError(`directory with empty name is invalid`);
    }
    this.name = name;
    this.directory = [];
  }

  public static root() {
    return (() => {
      const root = new Directory("root");
      root.name = "";
      return root;
    })();
  }

  public add(entry: Entry): Entry {
    this.directory.push(entry);
    entry.parent = this;
    return entry;
  }

  public mkdir(name: string): Entry {
    this.directory.forEach((entry) => {
      if (entry.getName() === name) {
        throw new FileTreatmentError(`mkdir: ${name}: File exists`);
      }
    });
    const newdir = new Directory(name);
    this.add(newdir);
    return newdir;
  }

  public get(name: string, command = "get"): Entry {
    for (const entry of this.directory) {
      if (entry.getName() !== name) continue;

      return entry;
    }
    throw new FileTreatmentError(
      `${command}: no such file or directory: ${name}`
    );
  }

  public cd(name: string): Entry {
    const entry = this.get(name, "cd");
    if (entry instanceof Directory) {
      return entry;
    } else {
      throw new FileTreatmentError(`cd: not a directory: ${name}`);
    }
  }

  public ls(): Array<string> {
    return this.directory.map((e) => e.getName()).sort();
  }

  public cat(): string {
    throw new FileTreatmentError(`cat: ${this.getName()}: Is a directory`);
  }

  public getName() {
    return this.name;
  }
}
