import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from '../../../shared/services/theme.service';
import { Theme } from '../../../shared/models/theme.type';

@Component({
  selector: 'app-auth-email-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header with registration title and toggle to login form -->
      <div class="flex flex-col gap-5">
        <h4 class="text-center">{{ 'AUTH.REGISTER_TITLE' | translate }}</h4>
        <span class="body-font-1 text-center">
          {{ 'AUTH.ALREADY_HAVE_ACCOUNT' | translate }}
          <button class="underline" (click)="toggleForm.emit()" type="button">
            <h6>{{ 'button.log_in' | translate }}</h6>
          </button>
        </span>
      </div>

      <!-- Email input form -->
      <form [formGroup]="form" class="flex flex-col gap-[12px]" (ngSubmit)="submitEmail()">
        <label class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="{
              'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
              'text-[var(--color-gray-55)]': (currentTheme$ | async) === 'dark'
            }"
          >
            {{ 'AUTH.EMAIL_PROMPT_1' | translate }}
          </span>
          <input
            type="email"
            formControlName="email"
            [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
            class="body-font-1 rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 focus:outline-none"
            [ngClass]="{
              'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]':
                (currentTheme$ | async) === 'light',
              'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]':
                (currentTheme$ | async) === 'dark',
              'border-red-600': emailControl.invalid && emailControl.touched
            }"
          />
        </label>

        <!-- Submit button enabled only when email is valid -->
        <button
          type="submit"
          [disabled]="form.invalid"
          class="button-font rounded-[40px] px-[32px] py-[12px]"
          [ngClass]="{
            'button-bg-blue': form.valid,
            'text-[var(--color-gray-55)]': form.invalid,
            'bg-[var(--color-gray-20)]': (currentTheme$ | async) === 'light' && form.invalid,
            'bg-[var(--color-gray-100)]': (currentTheme$ | async) === 'dark' && form.invalid
          }"
        >
          {{ 'AUTH.NEXT' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthEmailStepComponent {
  @Input() set email(value: string) {
    this.form.get('email')?.setValue(value);
  }

  @Output() emailSubmit = new EventEmitter<string>();
  @Output() toggleForm = new EventEmitter<void>();

  form: FormGroup;
  readonly currentTheme$: Observable<Theme>;

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  submitEmail(): void {
    if (this.form.valid) {
      this.emailSubmit.emit(this.emailControl.value);
    }
  }
}
