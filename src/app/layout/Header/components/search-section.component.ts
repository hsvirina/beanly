import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  startWith,
  switchMap,
  shareReplay,
} from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Place } from '../../../shared/models/place.model';
import { Theme } from '../../../shared/models/theme.type';

import { PlacesService } from '../../../shared/services/places.service';
import { ThemeService } from '../../../shared/services/theme.service';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../shared/constants/icons.constant';

import { IconComponent } from '../../../shared/components/icon.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    FormsModule,
    IconComponent,
    TranslateModule,
    ClickOutsideDirective,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="relative flex h-12 items-center gap-2 rounded-full border border-[var(--color-gray-20)] px-6 py-3 lg:w-[300px] xxl:w-[500px] xxl:max-w-xl"
      appClickOutside
      (appClickOutside)="onClickOutside()"
    >
      <app-icon
        [icon]="
          (currentTheme$ | async) === 'dark'
            ? ICONS.SearchWhite
            : ICONS.SearchDark
        "
      ></app-icon>

      <input
        type="text"
        placeholder="{{ 'header.search_section.placeholder' | translate }}"
        class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        [(ngModel)]="searchTerm"
        (click)="$event.stopPropagation()"
        (input)="onSearchChange()"
        autocomplete="off"
        [attr.aria-label]="'header.search_section.aria_label' | translate"
      />

      <ul
        *ngIf="searchTerm.trim().length > 0 && (filteredPlaces$ | async) as filtered"
        [@slideDownAnimation]
        class="absolute left-0 top-full z-50 mt-2 max-h-[600px] w-full overflow-auto rounded-[40px] p-2"
        [ngClass]="{
          'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'border border-[var(--color-white)] bg-[var(--color-bg-card)]':
            (currentTheme$ | async) === 'dark'
        }"
        role="listbox"
      >
        <ng-container *ngIf="filtered.length > 0; else noResults">
          <li
            *ngFor="let place of filtered"
            (click)="selectPlace(place)"
            (keydown.enter)="selectPlace(place)"
            (keydown.space)="selectPlace(place)"
            class="flex h-[72px] cursor-pointer items-center gap-3 rounded-[40px] p-2 transition-colors duration-300 hover:bg-[var(--color-bg)]"
            role="option"
            tabindex="0"
          >
            <img
              [src]="place.photoUrls[0]"
              [alt]="place.name"
              class="h-14 w-14 flex-shrink-0 rounded-full object-cover"
              width="56"
              height="56"
              loading="eager"
            />
            <span class="menu-text-font">{{ place.name }}</span>
          </li>
        </ng-container>

        <ng-template #noResults>
          <li class="p-4 text-gray-500" role="alert">
            {{
              'header.search_section.no_results' | translate: { term: searchTerm }
            }}
          </li>
        </ng-template>
      </ul>
    </div>
  `,
})
export class SearchSectionComponent implements OnDestroy {
  readonly ICONS = ICONS;

  @Input() closeDropdowns!: () => void;

  searchTerm = '';
  private searchTerm$ = new BehaviorSubject<string>('');

  readonly currentTheme$: Observable<Theme>;
  readonly filteredPlaces$: Observable<Place[]>;

  private destroy$ = new Subject<void>();

  constructor(
    private placesService: PlacesService,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    const allPlaces$ = this.translateService.onLangChange.pipe(
      map(event => event.lang),
      startWith(this.translateService.currentLang),
      switchMap(lang => this.placesService.getPlaces(lang)),
      shareReplay(1)
    );

    this.filteredPlaces$ = combineLatest([
      allPlaces$,
      this.searchTerm$
    ]).pipe(
      map(([places, term]) => this.filterPlaces(places, term))
    );
  }

  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm.trim());
  }

  selectPlace(place: Place): void {
    this.resetSearch();
    this.router.navigate(['/catalog', place.id]).catch(console.error);
    this.closeDropdowns?.();
  }

  onClickOutside(): void {
    this.resetSearch();
  }

  private resetSearch(): void {
    this.searchTerm = '';
    this.searchTerm$.next('');
  }

  private filterPlaces(places: Place[], term: string): Place[] {
    const lowerTerm = term.toLowerCase();
    if (!lowerTerm) return [];

    return places
      .filter(
        (place) =>
          place.name.toLowerCase().includes(lowerTerm) ||
          place.city?.toLowerCase().includes(lowerTerm) ||
          place.address?.toLowerCase().includes(lowerTerm),
      )
      .slice(0, 5);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
