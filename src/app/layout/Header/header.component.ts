import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, take } from 'rxjs';

import { FILTER_CATEGORIES } from '../../shared/constants/catalog-filter.config';
import { slideDownAnimation } from '../../../styles/animations/animations';

import { UiStateService } from '../../shared/services/ui-state.service';
import { AuthStateService } from '../../shared/services/auth-state.service';

import { SearchSectionComponent } from './components/search-section.component';
import { CityDropdownComponent } from './components/city-dropdown.component';
import { LanguageDropdownComponent } from './components/language-dropdown.component';
import { MobileMenuComponent } from './components/mobile-menu.component';

import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';

import { TranslateModule } from '@ngx-translate/core';

import { ICONS } from '../../shared/constants/icons.constant';
import { AuthApiService } from '../../shared/services/auth-api.service';
import { ThemeService } from '../../shared/services/theme.service';
import { LanguageService } from '../../shared/services/language.service';

import { Theme } from '../../shared/models/theme.type';
import { AuthUser } from '../../shared/models/user.model';
import { BadgeType, calculateBadgeType } from '../../shared/utils/badge-utils';
import { getUnlockedAchievements } from '../../shared/utils/achievement.utils';
import { ACHIEVEMENTS } from '../../shared/constants/achievements';
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { UserDropdownComponent } from './components/user-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  animations: [slideDownAnimation],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    SearchSectionComponent,
    CityDropdownComponent,
    LanguageDropdownComponent,
    MobileMenuComponent,
    IconComponent,
    LogoComponent,
    ThemeToggleComponent,
    UserDropdownComponent,
  ],
  template: `
    <header
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] xxl:h-[80px] xxl:px-0"
    >
      <!-- Left: logo + mobile menu -->
      <div class="flex items-center gap-[8px]">
        <button class="lg:hidden" (click)="uiState.toggleMobileMenu()">
          <app-icon [icon]="ICONS.Menu" />
        </button>
        <app-logo></app-logo>
      </div>

      <!-- Center: search for large screens -->
      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <!-- Right: nav, theme, user menu -->
      <div class="flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]">
        <!-- Desktop nav -->
        <div class="hidden items-center lg:flex">
          <nav
            class="menu-text-font flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]"
          >
            <a routerLink="/catalog">{{ 'header.nav.catalog' | translate }}</a>
            <app-city-dropdown
              [selectedKey]="cityKey"
              [opened]="activeDropdown === 'city'"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>
            <app-language-dropdown
              [opened]="activeDropdown === 'lang'"
              (toggle)="toggleDropdown('lang')"
            ></app-language-dropdown>
          </nav>
        </div>

        <!-- Theme toggle -->
        <app-theme-toggle></app-theme-toggle>

        <!-- User dropdown or login -->
        <ng-container *ngIf="user; else showLogin">
          <app-user-dropdown
            [user]="user"
            [userBadge]="userBadge"
            [avatarSize]="screenIsMobile ? 38 : 64"
            [badgeSize]="screenIsMobile ? 38 : 64"
            [opened]="activeDropdown === 'userMenu'"
            (openedChange)="activeDropdown = $event ? 'userMenu' : null"
            [theme]="(currentTheme$ | async) ?? 'light'"
            (logout)="handleLogout()"
          ></app-user-dropdown>
        </ng-container>
        <ng-template #showLogin>
          <button class="flex items-center gap-1" (click)="navigateToAuth()">
            <span class="hidden lg:inline">{{
              'button.log_in' | translate
            }}</span>
            <app-icon [icon]="ICONS.UserProfile" />
          </button>
        </ng-template>
      </div>
    </header>

    <!-- Mobile menu overlay -->
    <app-mobile-menu
      *ngIf="(uiState.mobileMenuOpen$ | async) && screenIsMobile"
      class="fixed inset-0 z-[999]"
      (closeMenu)="uiState.closeMobileMenu()"
      [cityLabel]="cityLabel"
      [language]="language"
      [user]="user"
      (dropdownToggle)="toggleDropdown($event)"
      (navigateToAuth)="navigateToAuth()"
      (logout)="handleLogout()"
      (cityChange)="setCity($event)"
    ></app-mobile-menu>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly ICONS = ICONS;

  // UI state
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  screenIsMobile = false;

  // User data
  user: AuthUser | null = null;
  userBadge: BadgeType | null = null;
  language: 'EN' | 'UK' = 'EN';
  cityKey: string | null = null;
  cityLabel = 'City';

  readonly currentTheme$: Observable<Theme>;

  private subscriptions: Subscription[] = [];
  private readonly resizeListener = () => this.checkScreenWidth();
  private readonly locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public uiState: UiStateService,
    private authService: AuthStateService,
    private authApiService: AuthApiService,
    private themeService: ThemeService,
    public languageService: LanguageService,
    private elementRef: ElementRef,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.subscribeToUser();
    this.subscribeToRouterEvents();
    this.checkScreenWidth();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    window.removeEventListener('resize', this.resizeListener);
  }
  private subscribeToUser(): void {
    const sub = this.authService.user$.subscribe((user) => {
      this.user = user;
      this.initializeCity(user);

      if (user) {
        this.authApiService.getPublicUserProfile(user.userId).subscribe({
          next: (profile) => {
            const unlocked = getUnlockedAchievements(profile);
            this.userBadge = calculateBadgeType(unlocked, ACHIEVEMENTS);
          },
          error: () => (this.userBadge = null),
        });
      } else {
        this.userBadge = null;
      }
    });
    this.subscriptions.push(sub);
  }

  private subscribeToRouterEvents(): void {
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) this.activeDropdown = null;
    });
    this.subscriptions.push(sub);
  }

  toggleDropdown(name: typeof this.activeDropdown): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  setCity(key: string): void {
    const found = this.locationOptions.find((o) => o.key === key);
    if (!found) return;

    this.cityKey = found.key;
    this.cityLabel = found.label;

    this.router
      .navigate(['/catalog'], {
        queryParams: { location: this.cityKey },
        queryParamsHandling: 'merge',
      })
      .then(() => (this.activeDropdown = null));
  }

  setLanguage(lang: 'EN' | 'UK'): void {
    if (this.user) {
      this.authService.updateUserLanguage(lang).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.language = lang;
        },
        error: () => (this.language = lang),
      });
    } else {
      this.language = lang;
    }
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  handleLogout(): void {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

  private initializeCity(user: AuthUser | null): void {
    if (user?.defaultCity) {
      const found = this.locationOptions.find(
        (o) => o.key.toLowerCase() === user.defaultCity.toLowerCase(),
      );
      if (found) {
        this.cityKey = found.key;
        this.cityLabel = found.label;
        return;
      }
    }

    const sub = this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const loc = params['location'];
      const found = this.locationOptions.find((o) => o.key === loc);
      this.cityKey = found?.key ?? null;
      this.cityLabel = found?.label ?? 'City';
    });
    this.subscriptions.push(sub);
  }

  private checkScreenWidth(): void {
    this.screenIsMobile = window.innerWidth < 1024;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.activeDropdown === 'userMenu' &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.activeDropdown = null;
    }
  }
}
