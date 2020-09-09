import Entry from "./entry";

export default class File extends Entry {
  private name: string;
  private content: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.content = "";
  }

  public edit(content: string) {
    this.content = content;
  }

  public cat() {
    return this.content;
  }

  public getName() {
    return this.name;
  }
}
