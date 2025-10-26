import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStateService } from '../../shared/services/auth-state.service';
import { StorageService } from '../../shared/services/storage.service';
import { AuthApiService } from '../../shared/services/auth-api.service';

import { ICONS } from '../../shared/constants/icons.constant';

import { AuthEmailStepComponent } from './components/auth-email-step.component';
import { AuthPasswordStepComponent } from './components/auth-password-step.component';
import { AuthLoginStepComponent } from './components/auth-login-step.component';
import { WelcomeModalComponent } from './components/welcome-modal.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthEmailStepComponent,
    AuthPasswordStepComponent,
    AuthLoginStepComponent,
    WelcomeModalComponent,
    ModalComponent,
  ],
  template: `
    <div class="mx-auto flex max-w-[1320px] flex-col gap-[32px] px-5 lg:px-10 xxl:px-0">
      <div class="grid grid-cols-8">
        <div class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3">
          <ng-container [ngSwitch]="step">
            <!-- Step 1: Email entry -->
            <app-auth-email-step
              *ngSwitchCase="1"
              [email]="email"
              (emailSubmit)="onEmailSubmit($event)"
              (toggleForm)="toggleForm()"
              class="w-full"
            ></app-auth-email-step>

            <!-- Step 2: Password/Registration -->
            <app-auth-password-step
              *ngSwitchCase="2"
              [email]="email"
              [password]="password"
              [repeatPassword]="repeatPassword"
              [firstName]="firstName"
              [lastName]="lastName"
              (passwordChange)="password = $event"
              (repeatPasswordChange)="repeatPassword = $event"
              (firstNameChange)="firstName = $event"
              (lastNameChange)="lastName = $event"
              (passwordSubmit)="onSubmitPassword()"
              (goBack)="goBackToEmail()"
              class="w-full"
            ></app-auth-password-step>

            <!-- Step 3: Login -->
            <app-auth-login-step
              *ngSwitchCase="3"
              [showPassword]="showPassword"
              [loginError]="loginError"
              (loginSubmit)="onSubmitLogin()"
              (goBack)="goBackToEmail()"
              (emailChange)="email = $event"
              (passwordChange)="password = $event"
              (togglePasswordVisibility)="showPassword = !showPassword"
              class="w-full"
            ></app-auth-login-step>
          </ng-container>
        </div>
      </div>

      <!-- Welcome modal -->
      <div class="grid grid-cols-8">
        <app-welcome-modal
          *ngIf="showWelcomeModal"
          (close)="closeWelcomeModal()"
        ></app-welcome-modal>
      </div>

      <!-- Error modal -->
      <app-modal
        *ngIf="showErrorModal"
        [isOpen]="showErrorModal"
        width="480px"
        (close)="closeErrorModal()"
      >
        <div class="text-center">
          <h2 class="mb-4 text-xl font-semibold">Registration Error</h2>
          <p class="mb-6 text-base">{{ errorMessage }}</p>
          <button
            class="rounded-2xl bg-[var(--color-primary)] px-5 py-2 text-[var(--color-white)] hover:opacity-90"
            (click)="closeErrorModal()"
          >
            OK
          </button>
        </div>
      </app-modal>
    </div>
  `,
})
export class AuthPageComponent {
  readonly ICONS = ICONS;

  // =========================
  // STATE
  // =========================
  step = 1;

  email = '';
  password = '';
  repeatPassword = '';
  firstName = '';
  lastName = '';

  showPassword = false;
  loginError = false;
  showWelcomeModal = false;

  showErrorModal = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthStateService,
    private storageService: StorageService,
    private userApi: AuthApiService
  ) {}

  // =========================
  // STEP NAVIGATION
  // =========================
  onEmailSubmit(email: string): void {
    this.email = email;
    this.step = 2;

    this.password = '';
    this.repeatPassword = '';
    this.firstName = '';
    this.lastName = '';
    this.showPassword = false;
  }

  toggleForm(): void {
    this.step = this.step === 1 ? 3 : 1;
  }

  goBackToEmail(): void {
    this.step = 1;
    this.password = '';
    this.repeatPassword = '';
  }

  // =========================
  // PASSWORD / REGISTRATION
  // =========================
  onSubmitPassword(): void {
    if (this.password !== this.repeatPassword) {
      this.showError('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.showError('Password is too weak');
      return;
    }

    this.authService
      .register(
        this.email,
        this.password,
        this.firstName.trim(),
        this.lastName.trim()
      )
      .subscribe({
        next: () => this.loginAfterRegistration(),
        error: (err) => this.handleRegistrationError(err),
      });
  }

  private loginAfterRegistration(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.loadUserProfile(true),
      error: (err) =>
        this.showError(
          'Login error after registration: ' + (err.message || err.statusText)
        ),
    });
  }

  private handleRegistrationError(err: any): void {
    const errorMessage =
      typeof err.error === 'string'
        ? err.error
        : err.error?.message || err.message || err.statusText;

    if (err.status === 400 && errorMessage?.toLowerCase().includes('email')) {
      this.showError('This email is already registered. Please login.');
      this.step = 3;
    } else {
      this.showError('Registration error: ' + errorMessage);
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  // =========================
  // LOGIN
  // =========================
  onSubmitLogin(): void {
    this.loginError = false;

    if (!this.email || !this.password) {
      this.loginError = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.loadUserProfile(false),
      error: (err) => this.showError('Login error: ' + err.message),
    });
  }

  // =========================
  // USER PROFILE LOADING
  // =========================
  private loadUserProfile(isNewUser: boolean): void {
    const userId = this.storageService.getUser()?.userId;
    if (!userId) return;

    this.userApi.getPublicUserProfile(userId).subscribe({
      next: (profile) => {
        this.storageService.setPublicUserProfile(profile);
        this.showWelcomeModal = true;
      },
      error: (err) => {
        this.showError('Failed to load profile: ' + err.message);
        this.showWelcomeModal = true;
      },
    });
  }

  closeWelcomeModal(): void {
    this.showWelcomeModal = false;
    const returnUrl = localStorage.getItem('returnUrl') || '/';
    localStorage.removeItem('returnUrl');
    this.router.navigateByUrl(returnUrl);
  }
}
