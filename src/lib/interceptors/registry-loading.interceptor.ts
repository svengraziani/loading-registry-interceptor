import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, OperatorFunction} from 'rxjs';
import {LoadingDictionary} from "../types/loading-dictionary";
import {switchMap, tap} from "rxjs/operators";
import {REQUEST_ID_GENERATOR_STRATEGY} from "../tokens/request-id-generator-strategy";
import {RequestIdGeneratorStrategy} from "../interfaces/request-id-generator-strategy";
import {REQUEST_FILTER_STRATEGY} from "../tokens/request-filter-strategy";
import {RequestFilterStrategy} from "../interfaces/request-filter-strategy";

@Injectable({providedIn: 'root'})
export class RegistryLoadingInterceptor implements HttpInterceptor {
  public loadingState$: Observable<LoadingDictionary>;
  private readonly loadingDictionary: LoadingDictionary;
  private readonly stateChangeTrigger$: BehaviorSubject<boolean>;

  public constructor(
    @Inject(REQUEST_ID_GENERATOR_STRATEGY) private readonly requestIdGenerator: RequestIdGeneratorStrategy,
    @Inject(REQUEST_FILTER_STRATEGY) private readonly requestFilter: RequestFilterStrategy
  ) {
    this.loadingDictionary = new Map();
    this.stateChangeTrigger$ = new BehaviorSubject<boolean>(false);
    this.loadingState$ = this.stateChangeTrigger$
      .asObservable()
      .pipe(switchMap(() => of(this.loadingDictionary)));
  }

  public intercept(request: HttpRequest<unknown>, delegate: HttpHandler): Observable<HttpEvent<unknown>> {
    return delegate.handle(request).pipe(
      this.mapHttpEventToLoadingState$(request)
    );
  }

  private mapHttpEventToLoadingState$(request: HttpRequest<unknown>): OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
    if (this.requestFilter.exclude(request)) {
      return tap();
    }
    return tap(event => this.updateLoadingState(this.getRequestId(request), event?.type === 0));
  }

  private updateLoadingState(requestId: string, isLoading: boolean): void {
    this.loadingDictionary.set(requestId, isLoading);
    this.stateChangeTrigger$.next(true);
  }

  private getRequestId(request: HttpRequest<unknown>): string {
    return this.requestIdGenerator.createId(request);
  }
}
