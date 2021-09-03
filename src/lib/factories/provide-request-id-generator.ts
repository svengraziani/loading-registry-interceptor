import {ModuleOptions} from "../interfaces/module-options";


export function provideRequestIdGenerator(options?: ModuleOptions): any {
  if (options?.requestIdGenerator) {
    return options.requestIdGenerator;
  }
}
