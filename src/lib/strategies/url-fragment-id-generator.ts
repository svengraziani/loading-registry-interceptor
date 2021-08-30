import {RequestIdGeneratorStrategy} from "../interfaces/request-id-generator-strategy";
import {HttpRequest} from "@angular/common/http";

export class UrlFragmentIdGenerator implements RequestIdGeneratorStrategy {

  public static getIdentifier(fragment: string): string {
    return String(fragment).replace(/[:\/&?]/g, "_").trim();
  }

  createId(request: HttpRequest<unknown>): string {
    return UrlFragmentIdGenerator.getIdentifier(request.url);
  }
}
