import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { AuthApiService } from './auth-api.service';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';
import { LanguageService } from './language.service';

import { Theme } from '../models/theme.type';
import { AuthUser, PublicUserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokenSubject: BehaviorSubject<string | null>;

  token$: Observable<string | null>;

  private userSubject: BehaviorSubject<AuthUser | null>;

  user$: Observable<AuthUser | null>;

  private publicProfileSubject = new BehaviorSubject<PublicUserProfile | null>(
    null,
  );
  publicProfile$ = this.publicProfileSubject.asObservable();

  constructor(
    private authApi: AuthApiService,
    private storage: StorageService,
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {
    this.tokenSubject = new BehaviorSubject<string | null>(
      this.storage.getToken(),
    );
    this.token$ = this.tokenSubject.asObservable();

    this.userSubject = new BehaviorSubject<AuthUser | null>(
      this.storage.getUser(),
    );
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<string> {
    return this.authApi.login(email, password).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.loadUserInfo()),
      map(() => this.getToken()!),
    );
  }

  loadUserInfo(): Observable<AuthUser> {
    return this.authApi.loadUserInfo().pipe(
      tap((user) => {
        this.setUser(user);
        this.themeService.setTheme(user.theme as Theme);
        this.languageService.syncFromUser(user);
      }),
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<string> {
    return this.authApi.register(email, password, firstName, lastName);
  }

  updateUserProfile(updatedData: Partial<AuthUser>): Observable<AuthUser> {
    return this.authApi.updateUserProfile(updatedData).pipe(
      tap((user) => {
        this.setUser(user);
        this.themeService.setTheme(user.theme as Theme);
        this.languageService.syncFromUser(user);
      }),
    );
  }

  updateUserLanguage(lang: 'EN' | 'UK'): Observable<AuthUser> {
    return this.updateUserProfile({ language: lang });
  }

  loadPublicProfile(userId: number): Observable<PublicUserProfile> {
    return this.authApi
      .getPublicUserProfile(userId)
      .pipe(tap((profile) => this.publicProfileSubject.next(profile)));
  }

  logout(): void {
    this.clearToken();
    this.clearUser();
    this.clearPublicProfile();
    this.storage.removeUnlockedAchievements();
    this.themeService.setTheme('light');
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.getValue();
  }

  updateCurrentUser(user: AuthUser): void {
    this.setUser(user);
  }

  // ----------------------------------
  // Private helper methods
  // ----------------------------------

  private setToken(token: string): void {
    this.storage.setToken(token);
    this.tokenSubject.next(token);
  }

  private clearToken(): void {
    this.storage.removeToken();
    this.tokenSubject.next(null);
  }

  private setUser(user: AuthUser): void {
    this.storage.setUser(user);
    this.userSubject.next(user);
  }

  private clearUser(): void {
    this.storage.removeUser();
    this.userSubject.next(null);
  }

  private clearPublicProfile(): void {
    this.publicProfileSubject.next(null);
    this.storage.removePublicUserProfile();
  }

  getPublicProfile(userId: number): Observable<PublicUserProfile> {
    return this.authApi.getPublicUserProfile(userId);
  }
}
