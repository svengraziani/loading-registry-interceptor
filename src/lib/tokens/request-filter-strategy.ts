import {InjectionToken} from "@angular/core";
import {RequestFilterStrategy} from "../interfaces/request-filter-strategy";

export const REQUEST_FILTER = new InjectionToken<RequestFilterStrategy>('request.filter.strategy');
