import {RequestFilterStrategy} from "../interfaces/request-filter-strategy";
import {HttpRequest} from "@angular/common/http";

export class NoRequestFiltering implements RequestFilterStrategy {
  exclude(request: HttpRequest<unknown>): boolean {
    return false;
  }
}
