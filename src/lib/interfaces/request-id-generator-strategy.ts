import {HttpRequest} from "@angular/common/http";

export interface RequestIdGeneratorStrategy {
  createId(request: HttpRequest<unknown>): string;
}
