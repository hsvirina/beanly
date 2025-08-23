import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme, ThemeValues } from '../../../shared/models/theme.type';
import { Place } from '../../../shared/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../shared/constants/icons.constant';
import { ToggleSwitchComponent } from '../../../shared/components/toggle-switch.component';
import { AuthStateService } from '../../../shared/services/auth-state.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { AuthUser } from '../../../shared/models/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-settings-sector',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ToggleSwitchComponent,
    TranslateModule,
  ],
  animations: [slideDownAnimation],
  template: `
    <!-- User settings panel wrapper; rendered only if user is defined -->
    <div class="flex flex-col gap-4" *ngIf="user">
      <!-- Title and description section -->
      <div class="flex flex-col gap-2">
        <h4>{{ 'settings.title' | translate }}</h4>
        <span class="body-font-1">{{
          'settings.description' | translate
        }}</span>
      </div>

      <!-- Appearance Settings Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <!-- Section header -->
        <h5>{{ 'settings.appearance' | translate }}</h5>

        <div class="flex flex-col gap-5">
          <!-- Theme selector with label and dropdown -->
          <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex flex-col gap-2">
              <h6>{{ 'settings.theme' | translate }}</h6>
              <span class="body-font-1">{{
                'settings.themeDescription' | translate
              }}</span>
            </div>
            <div #themeDropdown class="relative w-full lg:w-auto">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-3xl border px-6 py-3 lg:w-auto lg:gap-3"
                [ngClass]="themeDropdownClasses"
                aria-haspopup="listbox"
                [attr.aria-expanded]="isThemeDropdownOpen"
                (click)="toggleThemeDropdown($event)"
              >
                <span class="capitalize">
                  {{
                    'settings.theme' + capitalize(user.theme.toLowerCase())
                      | translate
                  }}</span
                >
                <app-icon
                  [icon]="ICONS.ChevronDown"
                  class="transition-transform"
                  [class.rotate-180]="isThemeDropdownOpen"
                ></app-icon>
              </button>

              <ul
                *ngIf="isThemeDropdownOpen"
                @slideDownAnimation
                class="absolute left-0 top-full z-10 mt-2 w-full rounded-[16px] border p-2"
                [ngClass]="themeDropdownListClasses"
                role="listbox"
                tabindex="-1"
              >
                <li
                  *ngFor="let option of themeOptions"
                  (click)="selectTheme(option)"
                  class="cursor-pointer rounded-[16px] px-2 py-1 capitalize transition-colors duration-300 hover:bg-[var(--color-bg)]"
                  role="option"
                  [attr.aria-selected]="user.theme === option"
                >
                  {{ 'settings.theme' + capitalize(option) | translate }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Language selector with label and dropdown -->
          <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex flex-col gap-2">
              <h6>{{ 'settings.language' | translate }}</h6>
              <span class="body-font-1">{{
                'settings.languageDescription' | translate
              }}</span>
            </div>
            <div #languageDropdown class="relative w-full lg:w-auto">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-[40px] border px-6 py-3 lg:w-auto lg:gap-3"
                [ngClass]="themeDropdownClasses"
                aria-haspopup="listbox"
                [attr.aria-expanded]="isLanguageDropdownOpen"
                (click)="toggleLanguageDropdown($event)"
              >
                <span class="capitalize">{{
                  'languages.' + languageService.currentLang | translate
                }}</span>
                <app-icon
                  [icon]="ICONS.ChevronDown"
                  class="transition-transform duration-300"
                  [class.rotate-180]="isLanguageDropdownOpen"
                ></app-icon>
              </button>

              <ul
                *ngIf="isLanguageDropdownOpen"
                @slideDownAnimation
                class="absolute left-0 top-full z-10 mt-2 w-full rounded-[16px] border p-2"
                [ngClass]="themeDropdownListClasses"
                role="listbox"
                tabindex="-1"
              >
                <li
                  *ngFor="let lang of languageOptions"
                  (click)="selectLanguage(lang)"
                  class="cursor-pointer rounded-[16px] px-2 py-1 capitalize transition-colors duration-300 hover:bg-[var(--color-bg)]"
                  role="option"
                  [attr.aria-selected]="languageService.currentLang === lang"
                >
                  {{ 'languages.' + lang | translate }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Notifications Settings Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>{{ 'settings.notifications' | translate }}</h5>

        <!-- Individual notification toggle items -->
        <div class="flex flex-col gap-5">
          <!-- Email Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>{{ 'settings.emailNotifications' | translate }}</h6>
              <span class="body-font-1">{{
                'settings.emailNotificationsDesc' | translate
              }}</span>
            </div>
            <app-toggle-switch
              [checked]="user.emailNotifications"
              (checkedChange)="toggleEmailNotifications()"
            ></app-toggle-switch>
          </div>

          <!-- Push Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>{{ 'settings.pushNotifications' | translate }}</h6>
              <span class="body-font-1">{{
                'settings.pushNotificationsDesc' | translate
              }}</span>
            </div>
            <app-toggle-switch
              [checked]="user.pushNotifications"
              (checkedChange)="togglePushNotifications()"
            ></app-toggle-switch>
          </div>

          <!-- Review Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>{{ 'settings.reviewNotifications' | translate }}</h6>
              <span class="body-font-1">{{
                'settings.reviewNotificationsDesc' | translate
              }}</span>
            </div>
            <app-toggle-switch
              [checked]="user.reviewNotifications"
              (checkedChange)="toggleReviewNotifications()"
            ></app-toggle-switch>
          </div>
        </div>
      </section>

      <!-- Privacy Settings Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>{{ 'settings.privacy' | translate }}</h5>

        <!-- Location Sharing toggle -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h6>{{ 'settings.locationSharing' | translate }}</h6>
            <span class="body-font-1">{{
              'settings.locationSharingDesc' | translate
            }}</span>
          </div>
          <app-toggle-switch
            [checked]="user.locationSharing"
            (checkedChange)="toggleLocationSharing()"
          ></app-toggle-switch>
        </div>
      </section>

      <!-- Account Settings Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>{{ 'settings.account' | translate }}</h5>

        <!-- Logout and Delete Account buttons -->
        <div class="button-font text-primary flex flex-col gap-4 lg:flex-row">
          <button
            class="button-bg-transparent flex h-12 w-full px-3 py-6"
            (click)="logout()"
          >
            {{ 'settings.logout' | translate }}
          </button>

          <button
            class="button-font flex h-12 w-full items-center justify-center rounded-[40px] border border-[var(--color-button-error)] px-3 py-6 text-[var(--color-button-error)]"
            (click)="openDeleteAccountModal()"
          >
            {{ 'settings.deleteAccount' | translate }}
          </button>
        </div>
      </section>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div
      *ngIf="showDeleteAccountModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 text-center"
      >
        <h4 class="mb-4 text-lg font-semibold">
          {{ 'settings.deleteAccountModalTitle' | translate }}
        </h4>
        <p class="mb-6">{{ 'settings.deleteAccountModalDesc' | translate }}</p>
        <button
          (click)="closeDeleteAccountModal()"
          class="button-font rounded-full bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
        >
          {{ 'settings.close' | translate }}
        </button>
      </div>
    </div>
  `,
})
export class SettingsSectorComponent implements OnInit {
  @ViewChild('themeDropdown', { static: false }) themeDropdownRef!: ElementRef;
  @ViewChild('languageDropdown', { static: false })
  languageDropdownRef!: ElementRef;

  @Input() user!: AuthUser;
  @Input() places: Place[] = [];

  /** Emits when settings are changed and should be saved */
  @Output() settingsChanged = new EventEmitter<void>();

  isThemeDropdownOpen = false;
  isLanguageDropdownOpen = false;
  showDeleteAccountModal = false;

  ICONS = ICONS;

  readonly currentTheme$: Observable<Theme>;
  readonly themeOptions = ThemeValues;
  readonly languageOptions: Array<'en' | 'uk'> = ['en', 'uk'];
  readonly languageLabels: Record<'en' | 'uk', string> = {
    en: 'English',
    uk: 'Ukrainian',
  };

  constructor(
    private themeService: ThemeService,
    private authService: AuthStateService,
    private router: Router,
    public languageService: LanguageService,
    private elementRef: ElementRef,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    if (!this.user) {
      throw new Error('Input user is required');
    }

    // Sync user theme with ThemeService
    if (this.user.theme !== this.themeService.currentTheme) {
      this.themeService.setTheme(this.user.theme as Theme);
    }

    // Sync language
    this.languageService.syncFromUser(this.user);

    document.addEventListener('mousedown', this.onDocumentClick, true);
  }

  get themeDropdownClasses(): string {
    return this.themeService.currentTheme === 'light'
      ? 'border-[var(--color-gray-20)] bg-[var(--color-white)]'
      : 'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]';
  }

  get themeDropdownListClasses(): string {
    return this.themeService.currentTheme === 'light'
      ? 'border-[var(--color-white)] bg-[var(--color-white)]'
      : 'border-[var(--color-white)] bg-[var(--color-bg-card)]';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  toggleThemeDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
    if (this.isThemeDropdownOpen) this.isLanguageDropdownOpen = false;
  }

  toggleLanguageDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    if (this.isLanguageDropdownOpen) this.isThemeDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.isThemeDropdownOpen = false;
    this.isLanguageDropdownOpen = false;
  }

  selectTheme(theme: Theme): void {
    if (this.user.theme !== theme) {
      this.user.theme = theme;
      this.themeService.setTheme(theme);
      this.settingsChanged.emit();
    }
    this.isThemeDropdownOpen = false;
  }

  selectLanguage(lang: 'en' | 'uk'): void {
    if (this.user.language !== lang) {
      this.user.language = lang;
      this.languageService.setLang(lang);
      this.settingsChanged.emit();
    }
    this.isLanguageDropdownOpen = false;
  }

  onDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const clickedInsideTheme =
      this.themeDropdownRef?.nativeElement.contains(target);
    const clickedInsideLang =
      this.languageDropdownRef?.nativeElement.contains(target);

    if (!clickedInsideTheme && !clickedInsideLang) {
      this.closeDropdowns();
    }
  };

  toggleEmailNotifications(): void {
    this.user.emailNotifications = !this.user.emailNotifications;
    this.settingsChanged.emit();
  }

  togglePushNotifications(): void {
    this.user.pushNotifications = !this.user.pushNotifications;
    this.settingsChanged.emit();
  }

  toggleReviewNotifications(): void {
    this.user.reviewNotifications = !this.user.reviewNotifications;
    this.settingsChanged.emit();
  }

  toggleLocationSharing(): void {
    this.user.locationSharing = !this.user.locationSharing;
    this.settingsChanged.emit();
  }

  openDeleteAccountModal(): void {
    this.showDeleteAccountModal = true;
  }

  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.onDocumentClick, true);
  }
}
