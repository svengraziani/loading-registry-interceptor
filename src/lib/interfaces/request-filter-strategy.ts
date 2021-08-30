import {HttpRequest} from "@angular/common/http";

export interface RequestFilterStrategy {
  exclude(request: HttpRequest<unknown>): boolean;
}
