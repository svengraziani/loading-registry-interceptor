import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RegistryLoadingInterceptor} from './interceptors/registry-loading.interceptor';
import {ModuleOptions} from './interfaces/module-options';
import {REQUEST_ID_GENERATOR_STRATEGY} from './tokens/request-id-generator-strategy';
import {REQUEST_FILTER_STRATEGY} from './tokens/request-filter-strategy';


@NgModule()
export class RegistryLoadingInterceptorModule {
  static forRoot(options: ModuleOptions): ModuleWithProviders<RegistryLoadingInterceptorModule> {
    return {
      ngModule: RegistryLoadingInterceptorModule,
      providers: [
        {provide: REQUEST_ID_GENERATOR_STRATEGY, useValue: options.requestIdGenerator},
        {provide: REQUEST_FILTER_STRATEGY, useValue: options.requestFilter},
        {provide: HTTP_INTERCEPTORS, useExisting: RegistryLoadingInterceptor, multi: true}
      ]
    };
  }
}
