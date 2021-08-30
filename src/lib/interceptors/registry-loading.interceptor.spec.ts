import { TestBed } from '@angular/core/testing';

import { RegistryLoadingInterceptor } from './registry-loading.interceptor';

describe('RegistryLoadingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RegistryLoadingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RegistryLoadingInterceptor = TestBed.inject(RegistryLoadingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
