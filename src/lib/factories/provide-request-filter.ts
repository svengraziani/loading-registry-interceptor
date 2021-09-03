import {RequestFilterStrategy} from "registry-loading-interceptor";
import {ModuleOptions} from "../interfaces/module-options";


export function provideRequestFilter(options?: ModuleOptions): RequestFilterStrategy {
  return new options?.requestFilter();
}
