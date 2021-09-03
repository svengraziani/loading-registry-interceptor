import {NgModule, Provider} from '@angular/core';
import {REQUEST_ID_GENERATOR} from './tokens/request-id-generator-strategy';
import {REQUEST_FILTER} from './tokens/request-filter-strategy';
import {UrlFragmentIdGenerator} from "./strategies/url-fragment-id-generator";
import {NoRequestFiltering} from "./strategies/no-request-filtering";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RegistryLoadingInterceptor} from "./interceptors/registry-loading.interceptor";

export const defaultProviders: Provider[] = [
  {
    provide: REQUEST_ID_GENERATOR,
    useClass: UrlFragmentIdGenerator,
  },
  {
    provide: REQUEST_FILTER,
    useClass: NoRequestFiltering
  },
  {
    provide: HTTP_INTERCEPTORS,
    useExisting: RegistryLoadingInterceptor,
    multi: true
  }
];

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [defaultProviders]
})
export class RegistryLoadingInterceptorModule {
}
