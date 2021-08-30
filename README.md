# Registry Loading Interceptor

This library provides an interceptor which maps Http Requests to a Loading State.
You're able to subscribe per request to the loading state.


## Usage
1) Import the `RegisterLoadingInterceptorModule` in your root module _(hint: most of the time: app.module.ts)_
2) Configure the `RegisterLoadingInterceptorModule` with it's `forRoot()` method.
   1) You must provide a RequestIdStrategy
   2) You must provide a RequestFilterStrategy _(default: no requests get filtered)_
3. Create your own SelectorFacade to the loading state


### RequestIdStrategy
Provides a mechanism to generate an ID from a request. Default ships with a URL to ID example.
Trough this Request ID you're able to create a selector to observe the loading state of a single request.


### RequestFilterStrategy
You may not want to map every request to a loading state, this is the place where you can provide a mechanism to filter/exclude request.
* _If using Angular 12, you can provide your own HttpContext based filter._

### SelectorFacade
Create a service which injects `RegistryLoadingInterceptor`and filters RequestID based on the `loadingState$`.
#### Example:
```typescript



```

