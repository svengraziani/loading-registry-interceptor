# Registry Loading Interceptor

This library provides an interceptor which maps Http Requests to a Loading State.
You're able to subscribe per request to the loading state.

## Usage Scenarios
* implicit "isLoadingAny" used for a global spinner indicator to show that anything is going on in the network
* explicit "isLoading" may be used to show exact loading indicator to a certain context
 

## Usage
1) Import the `RegisterLoadingInterceptorModule` in your root module _(hint: most of the time: app.module.ts)_
2) Create your own SelectorFacade to the loading state

## Definitions

### RequestIdStrategy
Provides a mechanism to generate an ID from a request. Default ships with a URL to ID example.
Trough this Request ID you're able to create a selector to observe the loading state of a single request.


### RequestFilterStrategy
You may not want to map every request to a loading state, this is the place where you can provide a mechanism to filter/exclude request.
* _If using Angular 12, you can provide your own HttpContext based filter._

### SelectorFacade
Create a service which injects `RegistryLoadingInterceptor`and filters RequestID based on the `loadingState$`.


## Usage Example
### App Module Configuration
Root Module _(app.module.ts)_ registration and configuration
```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    // ... other imports
    RegistryLoadingInterceptorModule
  ],
  
})
export class AppModule { }
```
### Selector Facade
```typescript
@Injectable({providedIn: 'root'})
export class IsLoadingService {

  public constructor(
    private readonly loadingRegistry: RegistryLoadingInterceptor,
    @Inject(REQUEST_ID_GENERATOR) private readonly idGenerator: UrlFragmentIdGenerator
  ) {

  }

  public isLoading$(url: string): Observable<boolean> {
    const requestId = this.idGenerator.getIdentifier(url);
    return this.loadingRegistry.loadingState$.pipe(
      map(state => state.has(requestId) ? state.get(requestId) as boolean : false),
      distinctUntilChanged()
    );
  }

  public isAnyLoading$(): Observable<boolean> {
    return this.loadingRegistry.isAnyRequestLoading$;
  }
}

```

### DataAccess Level: Test DataAccess Example
```typescript

@Injectable({
  providedIn: 'root'
})
export class TestDataAccessService {

  private static getUsersEndpoint = '/users';

  public userListLoading$: Observable<boolean>;

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly isLoadingService: IsLoadingService
    ) {
    // register request loading listener
    this.userListLoading$ = isLoadingService.isLoading$(TestDataAccessService.getUsersEndpoint);
  }

  public getUsers$(): Observable<unknown> {
    return this.httpClient.get(TestDataAccessService.getUsersEndpoint);
  }
}
```
### Component Level
```typescript
import {Component} from '@angular/core';
import {TestDataAccessService} from "./test-data-access.service";
import {IsLoadingService} from "./is-loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(
    private readonly testDataAccess: TestDataAccessService,
    private readonly isLoadingService: IsLoadingService
  ) {
    // connect the facade with the view
    testDataAccess.userListLoading$.subscribe(res => console.log('explicit', res));
    // implicit loading state, will provide Loadign state for any http request
    this.isLoadingService.isAnyLoading$().subscribe(res => console.log('implicit', res));

    this.testDataAccess.getUsers$().subscribe(console.log);

  }

}

```

## Data Sequence Diagram
![](data-flow-sequence.png)
    
## Customize

To use custom Request ID Strategy or custom Request Filtering you just need
to provide `REQUEST_ID_GENERATOR` or `REQUEST_ID_GENERATOR`.

```typescripts
 {provide: REQUEST_ID_GENERATOR, useClass: CustomIdGenerator},
```
