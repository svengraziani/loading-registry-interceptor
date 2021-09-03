import {InjectionToken} from "@angular/core";
import {RequestFilterStrategy} from "../interfaces/request-filter-strategy";

export const REQUEST_FILTER_STRATEGY = new InjectionToken<RequestFilterStrategy>('request.filter.strategy');
