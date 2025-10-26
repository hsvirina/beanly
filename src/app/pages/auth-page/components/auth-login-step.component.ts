import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ICONS } from '../../../shared/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { Theme } from '../../../shared/models/theme.type';
import { ThemedIconPipe } from '../../../shared/pipes/themed-icon.pipe';

@Component({
  selector: 'app-auth-login-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ThemedIconPipe,
    TranslateModule,
  ],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header -->
      <div
        class="flex cursor-pointer select-none"
        (click)="goBack.emit()"
        role="button"
        tabindex="0"
        [attr.aria-label]="'AUTH.GO_BACK' | translate"
        (keydown.enter)="goBack.emit()"
        (keydown.space)="goBack.emit()"
      >
        <app-icon
          [icon]="'ArrowLeft' | themedIcon"
          [width]="32"
          [height]="32"
          class="mr-[32px]"
        ></app-icon>
        <h4>{{ 'AUTH.LOG_IN_TITLE' | translate }}</h4>
      </div>

      <!-- Form -->
      <form
        [formGroup]="form"
        (ngSubmit)="submitLogin()"
        autocomplete="off"
        novalidate
        class="flex flex-col gap-[12px]"
      >
        <!-- Email -->
        <div class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="{
              'text-[var(--color-gray-75)]':
                (currentTheme$ | async) === 'light',
              'text-[var(--color-gray-55)]':
                (currentTheme$ | async) !== 'light',
            }"
          >
            {{ 'AUTH.EMAIL_PROMPT_1' | translate }}
          </span>
          <input
            type="email"
            formControlName="email"
            [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
            [class.border-red-600]="
              loginError &&
              form.get('email')?.invalid &&
              form.get('email')?.touched
            "
            class="body-font-1 rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 focus:outline-none"
          />
          <div
            *ngIf="
              loginError &&
              form.get('email')?.invalid &&
              form.get('email')?.touched
            "
            role="alert"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.EMAIL_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Password -->
        <div class="relative flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="{
              'text-[var(--color-gray-75)]':
                (currentTheme$ | async) === 'light',
              'text-[var(--color-gray-55)]':
                (currentTheme$ | async) !== 'light',
            }"
          >
            {{ 'AUTH.PASSWORD_PROMPT' | translate }}
          </span>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              formControlName="password"
              [placeholder]="'AUTH.PASSWORD_PLACEHOLDER' | translate"
              [class.border-red-600]="
                loginError &&
                form.get('password')?.invalid &&
                form.get('password')?.touched
              "
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
            />
            <button
              *ngIf="form.get('password')?.value"
              type="button"
              (click)="togglePasswordVisibility.emit()"
              tabindex="-1"
              [attr.aria-label]="'AUTH.TOGGLE_PASSWORD_VISIBILITY' | translate"
              class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
            >
              <app-icon
                [icon]="showPassword ? ICONS.EyeSlash : ICONS.Eye"
                class="h-[20px] w-[20px]"
              />
            </button>
          </div>
          <div
            *ngIf="
              loginError &&
              form.get('password')?.invalid &&
              form.get('password')?.touched
            "
            role="alert"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.PASSWORD_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="button-font button-bg-blue px-[32px] py-[12px]"
          [disabled]="form.invalid"
        >
          {{ 'button.log_in' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthLoginStepComponent {
  readonly ICONS = ICONS;

  form: FormGroup;

  emailSignal = signal('');
  passwordSignal = signal('');

  @Input() showPassword = false;
  @Input() loginError = false;

  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() togglePasswordVisibility = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.form.get('email')!.valueChanges.subscribe((value) => {
      this.emailSignal.set(value);
      this.emailChange.emit(value);
    });

    this.form.get('password')!.valueChanges.subscribe((value) => {
      this.passwordSignal.set(value);
      this.passwordChange.emit(value);
    });
  }

  submitLogin(): void {
    if (this.form.valid) {
      this.loginSubmit.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
