export interface PackageJson {
  name: string;
  description: string;
  repository: {
    url: string;
  };
  version: string;
}

export interface CliArgs {
  "disable-colors": boolean;
}
