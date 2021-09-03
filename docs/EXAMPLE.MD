# Example Usage

IsLoading Service shows implementation possibilities for explicit and implicit loading state observing.
* `public isLoading$(url: string)` is explicit providing a loading state for a certain request.
* `public isAnyLoading$()` is implicit providing a loading state for any request.

```typescript
@Injectable({providedIn: 'root'})
export class IsLoadingService {

  public constructor(private readonly loadingRegistry: RegistryLoadingInterceptor) {}

  public isLoading$(url: string): Observable<boolean> {
    const requestId = UrlFragmentIdGenerator.getIdentifier(url);
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
## DataAccess implementation and mapping
```typescript

@Injectable({
  providedIn: 'root'
})
export class TestDataAccessService {

  private static getUsersEndpoint = 'https://6131c7b97287b70017e6422c.mockapi.io/users';

  public userListLoading$: Observable<boolean>;

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly isLoadingService: IsLoadingService
  ) {

    this.userListLoading$ = isLoadingService.isLoading$(TestDataAccessService.getUsersEndpoint);
  }

  public getUsers$(): Observable<unknown> {
    return this.httpClient.get(TestDataAccessService.getUsersEndpoint);
  }
}
```

## Component Level usage of isLoadingService

```typescript
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

    this.testDataAccess.getUsers$().subscribe();

  }

}
```
