import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LogoComponent } from '../shared/components/logo.component';
import { ModalComponent } from '../shared/components/modal.component';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive';
import { ThemeService } from '../shared/services/theme.service';
import { Theme } from '../shared/models/theme.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    LogoComponent,
    ModalComponent,
    ClickOutsideDirective,
  ],
  template: `
    <!-- Footer wrapper -->
    <footer
      class="flex flex-col gap-10 px-5 py-12 lg:flex-row lg:gap-0 lg:px-[40px] lg:py-[60px] xxl:px-0"
      [ngClass]="{
        'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <!-- Left section: Logo + Navigation -->
      <div
        class="flex flex-col gap-10 lg:w-full lg:flex-row lg:justify-between lg:gap-0"
      >
        <app-logo [sizeXxl]="true"></app-logo>
      </div>

      <!-- Right section: Subscription form -->
      <div
        class="flex w-full flex-col gap-[16px] lg:ml-[80px] lg:w-[400px] lg:shrink-0 xxl:ml-[192px]"
        appClickOutside
        (appClickOutside)="showError = false"
      >
        <!-- Section header -->
        <div class="flex flex-col gap-2">
          <h5
            [ngClass]="{
              'text-[var(--color-gray-100)]':
                (currentTheme$ | async) === 'light',
              'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
            }"
          >
            {{ 'footer.subscribe_title' | translate }}
          </h5>
          <span class="body-font-1">
            {{ 'footer.subscribe_description' | translate }}.
          </span>
        </div>

        <!-- Email input -->
        <input
          [(ngModel)]="email"
          name="email"
          type="email"
          [placeholder]="'footer.email_placeholder' | translate"
          required
          email
          #emailInput="ngModel"
          (blur)="onBlur()"
          [ngClass]="{
            'border-[var(--color-gray-20)] bg-[var(--color-secondary)] focus:text-[var(--color-gray-100)]':
              (currentTheme$ | async) === 'light',
            'border-[var(--color-gray-100)] bg-transparent focus:text-[var(--color-white)]':
              (currentTheme$ | async) === 'dark',
          }"
          class="body-font-1 rounded-[40px] border px-6 py-3 focus:outline-none lg:w-auto lg:flex-1"
        />

        <!-- Validation error message -->
        <div *ngIf="showError" class="body-font-2 text-[var(--color-primary)]">
          {{ 'footer.email_error' | translate }}
        </div>

        <!-- Submit button and privacy notice -->
        <div class="flex flex-col gap-3">
          <button
            type="submit"
            (click)="onSubmit()"
            class="button-bg-transparent px-[24px] py-[12px] text-center lg:w-full lg:px-[24px]"
          >
            {{ 'button.send' | translate }}
          </button>

          <span class="body-font-2">{{
            'footer.privace_notice' | translate
          }}</span>
        </div>
      </div>
    </footer>

    <!-- Subscription success modal -->
    <app-modal [isOpen]="showModal" (close)="closeModal()" width="650px">
      <div
        class="flex w-full flex-col items-center justify-between gap-[32px] text-center text-[var(--color-gray-100)]"
      >
        <div class="flex flex-col gap-[20px]">
          <h4>{{ 'MODAL.MODAL_TITLE' | translate }}</h4>
          <p class="body-font-1">{{ 'MODAL.MODAL_TEXT' | translate }}</p>
        </div>
        <button
          (click)="closeModal()"
          class="button-font h-[48px] w-full rounded-[40px] bg-[var(--color-primary)] px-[32px] py-[12px] text-[var(--color-white)]"
        >
          {{ 'button.close' | translate }}
        </button>
      </div>
    </app-modal>
  `,
})
export class FooterComponent {
  email = '';

  showModal = false;

  showError = false;

  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  onSubmit(): void {
    if (!this.validateEmail(this.email)) {
      this.showError = true;
      return;
    }
    this.showModal = true;
    this.email = '';
    this.showError = false;
  }

  onBlur(): void {
    this.showError = !!this.email && !this.validateEmail(this.email);
  }

  closeModal(): void {
    this.showModal = false;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  }
}
