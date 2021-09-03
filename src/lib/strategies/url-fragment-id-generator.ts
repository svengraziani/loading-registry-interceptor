import {RequestIdGeneratorStrategy} from '../interfaces/request-id-generator-strategy';
import {HttpRequest} from '@angular/common/http';

export class UrlFragmentIdGenerator implements RequestIdGeneratorStrategy {

  getIdentifier(fragment: string): string {
    return String(fragment).replace(/[:\/&?]/g, '_').trim();
  }

  createId(request: HttpRequest<unknown>): string {
    return this.getIdentifier(request.url);
  }
}
