import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RegistryLoadingInterceptor} from './interceptors/registry-loading.interceptor';


@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, useExisting: RegistryLoadingInterceptor, multi: true}
  ]
})
export class RegistryLoadingInterceptorModule {
}
