declare global {
  // eslint-disable-next-line no-redeclare
  namespace jest {
    interface Matchers<R> {
      toContainInOrder(expected: string[]): R;
    }
  }
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
