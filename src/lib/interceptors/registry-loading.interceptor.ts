import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, OperatorFunction, throwError} from 'rxjs';
import {LoadingDictionary} from "../types/loading-dictionary";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {REQUEST_ID_GENERATOR} from "../tokens/request-id-generator-strategy";
import {RequestIdGeneratorStrategy} from "../interfaces/request-id-generator-strategy";
import {REQUEST_FILTER} from "../tokens/request-filter-strategy";
import {RequestFilterStrategy} from "../interfaces/request-filter-strategy";

@Injectable({providedIn: 'root'})
export class RegistryLoadingInterceptor implements HttpInterceptor {

  /**
   * registry exposing the loading state of watched http requests
   */
  public loadingState$: Observable<LoadingDictionary>;
  /**
   *  monitors if any http request is loading by counting references.
   */
  public isAnyRequestLoading$: Observable<boolean>;

  private readonly loadingDictionary: LoadingDictionary;
  private readonly stateChangeTrigger$: BehaviorSubject<boolean>;
  private readonly networkRequestCounter$: BehaviorSubject<number>;

  public constructor(
    @Inject(REQUEST_ID_GENERATOR) private readonly requestIdGenerator: RequestIdGeneratorStrategy,
    @Inject(REQUEST_FILTER) private readonly requestFilter: RequestFilterStrategy
  ) {

    this.loadingDictionary = new Map();
    this.stateChangeTrigger$ = new BehaviorSubject<boolean>(false);
    this.networkRequestCounter$ = new BehaviorSubject<number>(0);
    this.loadingState$ = this.stateChangeTrigger$
      .asObservable()
      .pipe(switchMap(() => of(this.loadingDictionary)));

    this.isAnyRequestLoading$ = this.networkRequestCounter$
      .asObservable()
      .pipe(map(count => count > 0));
  }

  private static mapEventTypeToLoading(event: HttpEvent<any>): boolean {
    return event?.type === 0;
  }

  public intercept(request: HttpRequest<unknown>, delegate: HttpHandler): Observable<HttpEvent<unknown>> {
    return delegate.handle(request)
      .pipe(
        this.mapHttpEventToLoadingCount$(),
        this.mapHttpEventToLoadingState$(request),
        catchError(error => {
          this.updateLoadingCounter(false);
          if(!this.requestFilter.exclude(request)) {
            this.updateLoadingState(this.getRequestId(request), false);
          }
          return throwError(error);
        })
      );
  }

  private mapHttpEventToLoadingState$(request: HttpRequest<unknown>): OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
    if (this.requestFilter.exclude(request)) {
      return tap();
    }
    return tap(event =>
      this.updateLoadingState(
        this.getRequestId(request),
        RegistryLoadingInterceptor.mapEventTypeToLoading(event)
      )
    );
  }

  private mapHttpEventToLoadingCount$(): OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
    return tap(event =>
      this.updateLoadingCounter(RegistryLoadingInterceptor.mapEventTypeToLoading(event))
    )
  }

  private updateLoadingState(requestId: string, isLoading: boolean): void {
    this.loadingDictionary.set(requestId, isLoading);
    this.stateChangeTrigger$.next(true);
  }

  private updateLoadingCounter(isLoading: boolean): void {
    isLoading ? this.incrementCounter() : this.decrementCounter();
  }

  private getRequestId(request: HttpRequest<unknown>): string {
    return this.requestIdGenerator.createId(request);
  }

  private incrementCounter(): void {
    this.networkRequestCounter$.next(this.networkRequestCounter$.value + 1);
  }

  private decrementCounter(): void {
    this.networkRequestCounter$.next(this.networkRequestCounter$.value - 1);
  }
}
