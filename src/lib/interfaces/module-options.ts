import {RequestFilterStrategy} from "./request-filter-strategy";
import {RequestIdGeneratorStrategy} from "./request-id-generator-strategy";


export interface ModuleOptions {
  requestFilter: RequestFilterStrategy;
  requestIdGenerator: RequestIdGeneratorStrategy;
}
