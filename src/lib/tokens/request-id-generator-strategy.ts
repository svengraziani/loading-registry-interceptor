import {InjectionToken} from "@angular/core";
import {RequestIdGeneratorStrategy} from "../interfaces/request-id-generator-strategy";

export const REQUEST_ID_GENERATOR = new InjectionToken<RequestIdGeneratorStrategy>('request.id.generator.strategy');
