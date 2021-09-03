import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RegistryLoadingInterceptor} from './interceptors/registry-loading.interceptor';
import {ModuleOptions} from './interfaces/module-options';
import {REQUEST_ID_GENERATOR_STRATEGY} from './tokens/request-id-generator-strategy';
import {REQUEST_FILTER_STRATEGY} from './tokens/request-filter-strategy';
import {FOR_ROOT_OPTIONS_TOKEN} from "./tokens/for-root-options-token";
import {provideRequestFilter} from "./factories/provide-request-filter";
import {provideRequestIdGenerator} from "./factories/provide-request-id-generator";

@NgModule()
export class RegistryLoadingInterceptorModule {
  static forRoot(options?: ModuleOptions): ModuleWithProviders<RegistryLoadingInterceptorModule> {
    return {
      ngModule: RegistryLoadingInterceptorModule,
      providers: [
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: options
        },
        {
          provide: REQUEST_ID_GENERATOR_STRATEGY,
          useFactory: provideRequestFilter,
          deps: [FOR_ROOT_OPTIONS_TOKEN]
        },
        {
          provide: REQUEST_FILTER_STRATEGY,
          useFactory: provideRequestIdGenerator,
          deps: [FOR_ROOT_OPTIONS_TOKEN]
        },
        {provide: HTTP_INTERCEPTORS, useExisting: RegistryLoadingInterceptor, multi: true}
      ]
    };
  }
}
