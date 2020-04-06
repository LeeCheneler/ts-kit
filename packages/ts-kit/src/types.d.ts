export interface PackageJson {
  name: string;
  description: string;
  repository: {
    url: string;
  };
  version: string;
}

export interface CliOptions {
  "disable-colors": boolean;
}

export interface Option<TValue> {
  name: string;
  description: string;
  defaultValue?: TValue;
  isRequired: boolean;
  parse: (option: string) => TValue;
}

export interface Command<TOptions> {
  name: string;
  description: string;
  options: Option<unknown>[];
  run: (args: string[]) => Promise<void>;
}
