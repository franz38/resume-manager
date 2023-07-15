export interface Delta {
  filename: string;
  path: string;
  removed: { [key: string]: string };
  added: { [key: string]: string };
}

export interface MyFile {
  filename: string;
  path: string;
  contentString: string;
}
