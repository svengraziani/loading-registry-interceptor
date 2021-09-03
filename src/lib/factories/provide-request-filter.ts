import {ModuleOptions} from "../interfaces/module-options";

export function provideRequestFilter(options?: ModuleOptions): any {
  if (options?.requestIdGenerator) {
    return options.requestFilter;
  }
}
