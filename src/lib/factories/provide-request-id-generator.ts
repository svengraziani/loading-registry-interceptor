import {ModuleOptions} from "../interfaces/module-options";
import {RequestIdGeneratorStrategy} from "registry-loading-interceptor";


export function provideRequestIdGenerator(options?: ModuleOptions): RequestIdGeneratorStrategy {
  return new options?.requestIdGenerator();
}
