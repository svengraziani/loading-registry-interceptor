import {ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {RegistryLoadingInterceptor} from "./interceptors/registry-loading.interceptor";
import {ModuleConfig} from "./interfaces/module-config";
import {REQUEST_ID_GENERATOR_STRATEGY} from "./tokens/request-id-generator-strategy";
import {REQUEST_FILTER_STRATEGY} from "./tokens/request-filter-strategy";


@NgModule()
export class RegistryLoadingInterceptorModule {
  static forRoot(config: ModuleConfig): ModuleWithProviders<RegistryLoadingInterceptorModule> {
    return {
      ngModule: RegistryLoadingInterceptorModule,
      providers: [
        {provide: REQUEST_ID_GENERATOR_STRATEGY, useValue: config.requestIdGenerator},
        {provide: REQUEST_FILTER_STRATEGY, useValue: config.requestFilter},
        {provide: HTTP_INTERCEPTORS, useExisting: RegistryLoadingInterceptor}
      ]
    };
  }
}
