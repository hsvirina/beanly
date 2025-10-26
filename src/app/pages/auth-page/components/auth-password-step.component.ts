import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ICONS } from '../../../shared/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { Theme } from '../../../shared/models/theme.type';
import { ThemedIconPipe } from '../../../shared/pipes/themed-icon.pipe';

@Component({
  selector: 'app-auth-password-step',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ThemedIconPipe,
    TranslateModule,
  ],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header with back button -->
      <div class="flex flex-col gap-5">
        <div class="flex cursor-pointer select-none items-center"
             (click)="goBack.emit()"
             [attr.aria-label]="'AUTH.BACK_BUTTON_LABEL' | translate"
             role="button"
             tabindex="0"
             (keydown.enter)="goBack.emit()"
             (keydown.space)="goBack.emit()">
          <app-icon [icon]="'ArrowLeft' | themedIcon" [width]="32" [height]="32" class="mr-[32px]"></app-icon>
          <h4 class="m-0">{{ 'AUTH.REGISTER_TITLE' | translate }}</h4>
        </div>
        <span class="body-font-1 text-center">
          {{ 'AUTH.EMAIL_PROMPT' | translate }} <span>{{ emailSignal() }}</span>
        </span>
      </div>

      <form [formGroup]="form" autocomplete="off" class="flex flex-col gap-[12px]" (ngSubmit)="submitPassword()">
        <!-- Password -->
        <div class="relative flex flex-col gap-[4px]">
          <span class="body-font-2" [ngClass]="(currentTheme$ | async) === 'light' ? 'text-[var(--color-gray-75)]' : 'text-[var(--color-gray-55)]'">
            {{ 'AUTH.PASSWORD_LABEL' | translate }}
          </span>
          <div class="relative">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="{{ 'AUTH.PASSWORD_PLACEHOLDER' | translate }}"
              formControlName="password"
              [class.border-red-600]="isPasswordTooWeak()"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
              autocomplete="new-password"
              [attr.aria-invalid]="isPasswordTooWeak()"
            />
            <button *ngIf="passwordSignal()" type="button" (click)="toggleShowPassword()" tabindex="-1" [attr.aria-label]="'AUTH.TOGGLE_PASSWORD_VISIBILITY' | translate" class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center">
              <app-icon [icon]="(showPassword() ? 'EyeSlash' : 'Eye') | themedIcon" class="h-[20px] w-[20px]"></app-icon>
            </button>
          </div>
          <div *ngIf="isPasswordTooWeak()" class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]" role="alert">
            <app-icon [icon]="ICONS.RedClose" /> {{ 'AUTH.PASSWORD_TOO_WEAK' | translate }}
          </div>
        </div>

        <!-- Repeat Password -->
        <div class="relative flex flex-col gap-[4px]">
          <span class="body-font-2" [ngClass]="(currentTheme$ | async) === 'light' ? 'text-[var(--color-gray-75)]' : 'text-[var(--color-gray-55)]'">
            {{ 'AUTH.CONFIRM_PASSWORD_LABEL' | translate }}
          </span>
          <div class="relative">
            <input
              [type]="showRepeatPassword() ? 'text' : 'password'"
              placeholder="{{ 'AUTH.CONFIRM_PASSWORD_PLACEHOLDER' | translate }}"
              formControlName="repeatPassword"
              [class.border-red-600]="isPasswordMismatch()"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
              autocomplete="new-password"
              [attr.aria-invalid]="isPasswordMismatch()"
              aria-describedby="passwordMismatchMessage"
            />
            <button *ngIf="repeatPasswordSignal()" type="button" (click)="toggleShowRepeatPassword()" tabindex="-1" [attr.aria-label]="'AUTH.TOGGLE_REPEAT_PASSWORD_VISIBILITY' | translate" class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center">
              <app-icon [icon]="(showRepeatPassword() ? 'EyeSlash' : 'Eye') | themedIcon" class="h-[20px] w-[20px]"></app-icon>
            </button>
          </div>
          <div *ngIf="isPasswordMismatch()" id="passwordMismatchMessage" class="body-font-2 flex select-none items-center gap-[4px] text-[var(--color-button-error)]" role="alert">
            <app-icon [icon]="ICONS.RedClose" /> {{ 'AUTH.PASSWORD_MISMATCH' | translate }}
          </div>
        </div>

        <!-- First Name -->
        <div class="flex flex-col gap-[4px]">
          <span class="body-font-2" [ngClass]="(currentTheme$ | async) === 'light' ? 'text-[var(--color-gray-75)]' : 'text-[var(--color-gray-55)]'">
            {{ 'AUTH.FIRST_NAME_LABEL' | translate }}
          </span>
          <input type="text" formControlName="firstName" placeholder="{{ 'AUTH.FIRST_NAME_PLACEHOLDER' | translate }}" class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none" required />
        </div>

        <!-- Last Name -->
        <div class="flex flex-col gap-[4px]">
          <span class="body-font-2" [ngClass]="(currentTheme$ | async) === 'light' ? 'text-[var(--color-gray-75)]' : 'text-[var(--color-gray-55)]'">
            {{ 'AUTH.LAST_NAME_LABEL' | translate }}
          </span>
          <input type="text" formControlName="lastName" placeholder="{{ 'AUTH.LAST_NAME_PLACEHOLDER' | translate }}" class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none" required />
        </div>

        <button type="submit" class="button-font button-bg-blue px-[32px] py-[12px]" [disabled]="form.invalid || isPasswordTooWeak() || isPasswordMismatch()">
          {{ 'AUTH.CREATE_ACCOUNT' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthPasswordStepComponent {
  readonly ICONS = ICONS;

  emailSignal = signal('');
  passwordSignal = signal('');
  repeatPasswordSignal = signal('');
  firstNameSignal = signal('');
  lastNameSignal = signal('');
  showPassword = signal(false);
  showRepeatPassword = signal(false);

  form: FormGroup;

  // =====================
  // Inputs
  // =====================
  @Input() set email(value: string) {
    this.emailSignal.set(value);
    this.form.get('email')?.setValue(value);
  }
  @Input() password: string = '';
  @Input() repeatPassword: string = '';
  @Input() firstName: string = '';
  @Input() lastName: string = '';

  // =====================
  // Outputs
  // =====================
  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() repeatPasswordChange = new EventEmitter<string>();
  @Output() passwordSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [this.password, Validators.required],
      repeatPassword: [this.repeatPassword, Validators.required],
      firstName: [this.firstName, Validators.required],
      lastName: [this.lastName, Validators.required],
    });

    this.form.get('password')!.valueChanges.subscribe((value) => {
      this.passwordSignal.set(value);
      this.passwordChange.emit(value);
    });
    this.form.get('repeatPassword')!.valueChanges.subscribe((value) => {
      this.repeatPasswordSignal.set(value);
      this.repeatPasswordChange.emit(value);
    });
    this.form.get('firstName')!.valueChanges.subscribe((value) => {
      this.firstNameSignal.set(value);
      this.firstNameChange.emit(value);
    });
    this.form.get('lastName')!.valueChanges.subscribe((value) => {
      this.lastNameSignal.set(value);
      this.lastNameChange.emit(value);
    });
  }

  isPasswordTooWeak = computed(() => {
    const pwd = this.passwordSignal();
    if (!pwd) return false;
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return !strongPasswordRegex.test(pwd);
  });

  isPasswordMismatch = computed(() => {
    const pwd = this.passwordSignal();
    const repeat = this.repeatPasswordSignal();
    return repeat.length > 0 && pwd !== repeat;
  });

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowRepeatPassword() {
    this.showRepeatPassword.set(!this.showRepeatPassword());
  }

  submitPassword() {
    this.passwordSubmit.emit();
  }
}
