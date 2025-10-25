import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ThemeService } from '../../../shared/services/theme.service';
import { Observable } from 'rxjs';
import { Theme } from '../../../shared/models/theme.type';

interface PageSizeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-page-size-dropdown',
  standalone: true,
  imports: [CommonModule, TranslateModule, ClickOutsideDirective],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      appClickOutside
      class="relative flex items-center gap-2"
      (appClickOutside)="onOutsideClick()"
    >
      <!-- Label -->
      <span>{{ 'catalog_page.show_label' | translate }}</span>

      <!-- Toggle button -->
      <div
        class="flex w-[80px] cursor-pointer items-center justify-between rounded px-3 py-1"
        (click)="toggleDropdown($event)"
      >
        {{ getSelectedLabel() }}
        <svg
          class="ml-2 h-4 w-4 transform transition-transform duration-300"
          [class.rotate-180]="dropdownOpen"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- Dropdown menu -->
      <div
        *ngIf="dropdownOpen"
        @slideDownAnimation
        class="absolute right-0 top-[110%] z-50 w-[80px] rounded-[16px] border p-2"
        [ngClass]="{
          'border-[var(--color-white)] bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'border-[var(--color-white)] bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
        }"
      >
        <div
          *ngFor="let option of sizeOptions"
          (click)="selectOption(option.value, $event)"
          class="cursor-pointer rounded px-2 py-1 transition-colors duration-300"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': (currentTheme$ | async) === 'dark',
            'hover:bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
            'font-bold': option.value === selectedValue
          }"
        >
          {{
            'catalog_page.items_per_page.' +
              (option.label === 'all' ? 'all' : option.label) | translate
          }}
        </div>
      </div>
    </div>
  `,
})
export class PageSizeDropdownComponent {
  @Input() selectedValue!: number;
  @Output() selectedValueChange = new EventEmitter<number>();

  dropdownOpen = false;

  sizeOptions: PageSizeOption[] = [
    { label: '6', value: 6 },
    { label: '12', value: 12 },
    { label: 'all', value: -1 },
  ];

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(value: number, event: MouseEvent) {
    event.stopPropagation();
    this.selectedValueChange.emit(value);
    this.dropdownOpen = false;
  }

  getSelectedLabel(): string {
    const selected = this.sizeOptions.find(opt => opt.value === this.selectedValue);
    if (!selected) return 'Select';
    switch (selected.label) {
      case 'all':
        return this.translate.instant('catalog_page.items_per_page.all');
      case '6':
        return this.translate.instant('catalog_page.items_per_page.6');
      case '12':
        return this.translate.instant('catalog_page.items_per_page.12');
      default:
        return selected.label;
    }
  }

  onOutsideClick() {
    this.dropdownOpen = false;
    this.cdr.markForCheck();
  }
}
