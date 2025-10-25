import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { ICONS } from '../../../shared/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { FilterService } from '../../../shared/services/filter.service';
import { LanguageService } from '../../../shared/services/language.service';
import { UiStateService } from '../../../shared/services/ui-state.service';
import { FilterCategory } from '../../../shared/models/catalog-filter.model';
import { Theme } from '../../../shared/models/theme.type';
import {
  fadeInBackdrop,
  slideDownAnimation,
  slideUpModal,
} from '../../../../styles/animations/animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule],
  animations: [
    slideDownAnimation,
    fadeInBackdrop,
    slideUpModal,
    trigger('slideDownMobile', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('300ms ease')),
    ]),
  ],

  template: `
    <div
      class="flex w-full flex-col gap-4 px-5 lg:h-[72px] lg:flex-row lg:gap-5 lg:px-0 xxl:h-[84px] xxl:max-w-[896px] xxl:gap-6"
    >
      <button
        class="button-bg-transparent flex h-12 w-full lg:hidden"
        type="button"
        (click)="toggleMobileFilter()"
      >
        Filters
      </button>

      <div
        class="gap-6"
        [ngClass]="{
          'hidden h-full lg:flex': !isMobileFilterOpen,
          'flex flex-col': isMobileFilterOpen,
        }"
      >
        <div
          class="relative flex w-[335px] items-center justify-between gap-1 rounded-[40px] border lg:h-[72px] lg:w-[688px] xxl:h-[84px]"
          [ngClass]="{
            'border-[var(--color-gray-20)]':
              (currentTheme$ | async) === 'light',
            'border-[var(--color-gray-75)]': (currentTheme$ | async) === 'dark',
          }"
        >
          <div
            *ngFor="let category of filterCategories; let i = index"
            class="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 whitespace-nowrap rounded-[40px] text-center transition-colors duration-300"
            [ngClass]="{
              
              'bg-[var(--color-white)]':
                selectedOptions[category.key] &&
                (currentTheme$ | async) === 'light',
              'bg-[var(--color-bg-card)]':
                selectedOptions[category.key] &&
                (currentTheme$ | async) === 'dark',
              'hover:bg-[var(--color-bg-card)]':
                !selectedOptions[category.key] &&
                (currentTheme$ | async) === 'dark',
              'hover:bg-[var(--color-white)]':
                !selectedOptions[category.key] &&
                (currentTheme$ | async) === 'light',
            }"
            (click)="toggleDropdown(i)"
            (mouseenter)="handleMouseEnter(i)"
          >
            <span
              class="menu-text-font"
              [ngClass]="{
                'text-[var(--color-gray-100)]':
                  (currentTheme$ | async) === 'light',
                'text-[var(--color-gray-10)]':
                  (currentTheme$ | async) === 'dark',
              }"
            >
              {{ category.title }}
            </span>

            <span
              class="body-font-1"
              [ngClass]="{
                'text-[var(--color-gray-75)]':
                  (currentTheme$ | async) === 'light',
                'text-[var(--color-gray-20)]':
                  (currentTheme$ | async) === 'dark',
              }"
            >
              {{ selectedOptions[category.key] || category.description }}
            </span>

            <ul
              *ngIf="openedDropdownIndex === i"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 w-max rounded-[40px] border border-[var(--color-white)] p-2"
              [ngClass]="{
                'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
                'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark',
              }"
              (click)="$event.stopPropagation()"
            >
              <li
                *ngFor="let option of category.options"
                class="flex cursor-pointer gap-3 rounded-[40px] p-2 hover:bg-[var(--color-bg)]"
                (click)="selectOption(category.key, option.label, $event)"
              >
                <img
                  [src]="option.imageURL"
                  alt="image"
                  class="h-14 w-14 rounded-full"
                />
                <div class="flex flex-col gap-1 text-left">
                  <span class="menu-text-font">{{ option.label }}</span>
                  <span class="body-font-2">{{ option.description }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        class="button-bg-blue flex h-12 w-full gap-3 lg:h-[72px] lg:w-[168px] xxl:h-[84px] xxl:w-[184px]"
        type="button"
        (click)="onSearchClick()"
      >
        <app-icon [icon]="ICONS.SearchWhite" />
        <span class="button-font">{{ 'button.search' | translate }}</span>
      </button>

      <div
        *ngIf="isMobileFilterOpen"
        @fadeInBackdrop
        class="bg-[var(--color-bg)]/90 fixed inset-0 z-40 backdrop-blur-3xl lg:hidden"
      ></div>

      <div
        *ngIf="isMobileFilterOpen"
        @slideUpModal
        class="mobile-filter-modal fixed inset-0 z-40 flex flex-col px-5 pb-6 pt-3 lg:hidden"
        #mobileFilterModal
      >
        <div class="mb-6 flex justify-end">
          <button
            (click)="toggleMobileFilter()"
            class="flex h-10 w-10 items-center justify-center rounded-[40px] bg-[var(--color-white)]"
            aria-label="Close"
          >
            <app-icon [icon]="ICONS.Close" [width]="20" [height]="20" />
          </button>
        </div>

        <div class="flex-grow overflow-y-auto">
          <div
            *ngFor="let category of filterCategories; let i = index"
            class="category-filter-block"
            style="max-width: 100%; overflow-x: hidden;"
          >
            <div
              class="menu-text-font flex cursor-pointer rounded-[24px] px-4 py-6 transition-all duration-300"
              (click)="toggleMobileFilterCategory(i)"
              (mouseenter)="onMobileCategoryHover(i)"
              [ngClass]="{
                'flex-row items-center justify-between gap-2':
                  mobileOpenedIndex !== i,
                'flex-col': mobileOpenedIndex === i,
                'bg-[var(--color-white)] text-[var(--color-gray-100)]':
                  (currentTheme$ | async) === 'light',
                'border border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
                  (currentTheme$ | async) === 'dark',
                'hover:bg-[var(--color-bg)]': true,
              }"
            >
              <div>{{ category.title }}</div>
              <div
                class="body-font-1 text-[var(--color-gray-75)]"
                [ngClass]="{
                  'text-[var(--color-white)]':
                    (currentTheme$ | async) === 'dark',
                }"
              >
                {{ selectedOptions[category.key] || category.description }}
              </div>
            </div>

            <div
              #dropdownOptions
              [@slideDownMobile]="isMobileFilterOpenAt(i) ? 'open' : 'closed'"
              class="dropdown-mobile-options mb-4 mt-1 flex flex-col gap-1 overflow-hidden rounded-[24px] border"
              [ngClass]="{
                'border-[var(--color-white)] bg-[var(--color-white)]':
                  (currentTheme$ | async) === 'light',
                'border-[var(--color-gray-75)] bg-[var(--color-bg)]':
                  (currentTheme$ | async) === 'dark',
              }"
            >
              <div
                *ngFor="let option of category.options"
                (click)="selectOption(category.key, option.label)"
                class="flex cursor-pointer items-center gap-2 p-2 transition-colors duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg-card)]"
              >
                <img
                  [src]="option.imageURL"
                  alt="icon"
                  class="h-10 w-10 rounded-full"
                />
                <div class="flex flex-col">
                  <span class="menu-text-font">{{ option.label }}</span>
                  <span class="body-font-2">{{ option.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-full flex-shrink-0 gap-4">
          <button
            class="button-bg-blue mb-4 mt-4 h-12 flex-1"
            (click)="applyFilters(); toggleMobileFilter()"
          >
            {{ 'button.apply_filters' | translate }}
          </button>

          <button
            class="button-bg-transparent mb-4 mt-4 h-12 flex-1 text-[var(--color-primary)]"
            (click)="clearAllFilters()"
          >
            {{ 'button.clear_all' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
      .mobile-filter-modal {
        max-width: 100vw;
        overflow-x: hidden;
        box-sizing: border-box;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .category-filter-block,
      .dropdown-mobile-options {
        max-width: 100%;
        overflow-x: hidden;
        word-break: break-word;
        overflow-wrap: break-word;
      }
    `,
  ],
})
export class FilterBarComponent implements OnDestroy, AfterViewInit {
  @ViewChild('mobileFilterModal', { static: false })
  mobileFilterModal?: ElementRef;
  @ViewChildren('dropdownOptions') dropdownOptions!: QueryList<ElementRef>;

  ICONS = ICONS;

  readonly currentTheme$: Observable<Theme>;

  selectedOptions: Record<string, string> = {};

  isMobileFilterOpen = false;
  mobileOpenedIndex: number | null = null;
  mobileMouseControlEnabled = false;

  openedDropdownIndex: number | null = null;

  filterCategories: FilterCategory[] = [];

  private langSub?: Subscription;

  private globalClickUnlistener: () => void;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uiState: UiStateService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private filterService: FilterService,
    private languageService: LanguageService,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    this.langSub = this.languageService.lang$.subscribe(() => {
      this.filterCategories = this.filterService.categories;
      this.cdr.markForCheck();
    });

    this.globalClickUnlistener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this),
    );
  }

  ngAfterViewInit(): void {
    this.dropdownOptions.changes.subscribe(() => this.logDropdownSizes());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.globalClickUnlistener?.();
    this.enableBodyScroll();
  }

  isMobileFilterOpenAt(index: number): boolean {
    return this.mobileOpenedIndex === index;
  }

  toggleMobileFilter(): void {
    this.isMobileFilterOpen = !this.isMobileFilterOpen;
    this.isMobileFilterOpen
      ? this.disableBodyScroll()
      : this.enableBodyScroll();
    this.mobileOpenedIndex = null;
    this.mobileMouseControlEnabled = false;
    if (!this.isMobileFilterOpen) this.openedDropdownIndex = null;
  }

  toggleMobileFilterCategory(index: number): void {
    this.mobileOpenedIndex = this.mobileOpenedIndex === index ? null : index;
    this.cdr.detectChanges();
  }

  toggleDropdown(index: number): void {
    this.openedDropdownIndex =
      this.openedDropdownIndex === index ? null : index;
    this.cdr.detectChanges();
  }

  handleMouseEnter(index: number): void {
    if (
      this.openedDropdownIndex !== null &&
      this.openedDropdownIndex !== index
    ) {
      this.openedDropdownIndex = index;
      this.cdr.detectChanges();
    }
  }

  selectOption(categoryKey: string, label: string, event?: MouseEvent): void {
    event?.stopPropagation();
    this.selectedOptions[categoryKey] = label;
    this.mobileOpenedIndex = null;
    this.mobileMouseControlEnabled = false;
    this.openedDropdownIndex = null;
  }

  applyFilters(): void {
    const queryParams: Record<string, string> = {};
    for (const category of this.filterCategories) {
      const key = category.key;
      const selectedLabel = this.selectedOptions[key];
      if (selectedLabel) {
        const matched = category.options.find(
          (opt) => opt.label === selectedLabel,
        );
        if (matched) queryParams[key] = matched.key;
      }
    }
    this.enableBodyScroll();
    this.router.navigate(['/catalog'], { queryParams });
  }

  clearAllFilters(): void {
    this.selectedOptions = {};
  }

  onSearchClick(): void {
    if (window.innerWidth < 1024) {
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.cdr.detectChanges();
      this.uiState.openMobileMenu();
    } else {
      this.applyFilters();
    }
  }

  private logDropdownSizes(): void {
    this.dropdownOptions.forEach((el) => {
      const native = el.nativeElement as HTMLElement;
    });
  }

  private onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath ? event.composedPath() : [];
    const clickedInsideModal = this.mobileFilterModal?.nativeElement
      ? path.includes(this.mobileFilterModal.nativeElement)
      : false;
    const clickedInsideComponent = path.includes(this.elementRef.nativeElement);

    if (
      !clickedInsideModal &&
      !clickedInsideComponent &&
      this.isMobileFilterOpen
    ) {
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.openedDropdownIndex = null;
    }

    if (!clickedInsideComponent && !this.isMobileFilterOpen) {
      this.openedDropdownIndex = null;
      this.cdr.detectChanges();
    }
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  onMobileCategoryHover(index: number): void {
    if (!this.mobileMouseControlEnabled) return;
    if (this.mobileOpenedIndex !== index) {
      this.mobileOpenedIndex = index;
      this.cdr.detectChanges();
    }
  }
}
