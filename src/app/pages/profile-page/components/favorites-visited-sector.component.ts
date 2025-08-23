import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderPlacesComponent } from '../../../shared/components/slider-places.component';
import { PlaceCardComponent } from '../../../shared/components/place-card.component';
import { Place } from '../../../shared/models/place.model';
import { PlaceCardType } from '../../../shared/constants/place-card-type.enum';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites-visited-sector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderPlacesComponent,
    PlaceCardComponent,
    TranslateModule,
  ],
  template: `
    <div class="flex flex-col gap-12 lg:px-10 xxl:px-0">
      <!-- Favorite Cafés Section -->
      <section class="flex flex-col">
        <!-- Mobile header & description - only when no favorites -->
        <div class="block lg:hidden" *ngIf="favoritePlaces.length === 0">
          <h4 class="mb-2 text-[20px] sm:text-[24px]">
            {{ 'favoritesVisited.favoriteCafes' | translate }}
          </h4>
          <span class="body-font-1 mb-4 block">
            {{
              'favoritesVisited.favoriteCafesDescription'
                | translate: { count: favoritePlaces.length }
            }}
          </span>
        </div>

        <!-- Desktop header & description - always shown -->
        <div class="hidden lg:block">
          <h4 class="mb-2 text-[32px] xxl:text-[40px]">
            {{ 'favoritesVisited.favoriteCafes' | translate }}
          </h4>
          <span class="body-font-1 mb-4 block" *ngIf="!isPublic">
            {{
              'favoritesVisited.favoriteCafesDescription'
                | translate: { count: favoritePlaces.length }
            }}
          </span>
        </div>

        <!-- Mobile slider - shown only if favorites exist -->
        <div class="block lg:hidden" *ngIf="favoritePlaces.length > 0">
          <app-slider-places
            [places]="favoritePlaces"
            [cardType]="PlaceCardType.Favourites"
            [title]="'favoritesVisited.favoriteCafes' | translate"
            [subtitle]="
              !isPublic
                ? ('favoritesVisited.favoriteCafesDescription'
                  | translate: { count: favoritePlaces.length })
                : null
            "
          ></app-slider-places>
        </div>

        <!-- Desktop grid for favorite places -->
        <div
          class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
          *ngIf="favoritePlaces.length > 0"
        >
          <app-place-card
            *ngFor="let place of favoritePlaces"
            [place]="place"
            [cardType]="PlaceCardType.Favourites"
            class="col-span-2"
            (favoriteToggled)="onFavoriteToggled($event)"
          ></app-place-card>
        </div>
      </section>

      <!-- Visited Cafés Section -->
      <section class="flex flex-col">
        <!-- Mobile header & description - only when no visited places -->
        <div class="block lg:hidden" *ngIf="visitedPlaces.length === 0">
          <h4 class="mb-2 text-[20px] sm:text-[24px]">
            {{ 'favoritesVisited.alreadyVisited' | translate }}
          </h4>
          <span class="body-font-1 mb-4 block">
            {{ 'favoritesVisited.alreadyVisitedDescription' | translate }}
          </span>
        </div>

        <!-- Desktop header & description - always shown -->
        <div class="hidden lg:block">
          <h4 class="mb-2 text-[32px] xxl:text-[40px]">
            {{ 'favoritesVisited.alreadyVisited' | translate }}
          </h4>
          <span class="body-font-1 mb-4 block" *ngIf="!isPublic">
            {{ 'favoritesVisited.alreadyVisitedDescription' | translate }}
          </span>
        </div>

        <!-- Mobile slider for visited places -->
        <div class="block lg:hidden" *ngIf="visitedPlaces.length > 0">
          <app-slider-places
            [places]="visitedPlaces"
            [cardType]="PlaceCardType.Favourites"
            [title]="'favoritesVisited.alreadyVisited' | translate"
            [subtitle]="
              !isPublic
                ? ('favoritesVisited.alreadyVisitedDescription' | translate)
                : null
            "
          ></app-slider-places>
        </div>

        <!-- Desktop grid for visited places -->
        <ng-container
          *ngIf="visitedPlaces.length > 0; else noVisitedPlacesTemplate"
        >
          <div
            class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
          >
            <app-place-card
              *ngFor="let place of visitedPlaces"
              [place]="place"
              [cardType]="PlaceCardType.Favourites"
              class="col-span-2"
              (favoriteToggled)="onFavoriteToggledVisited($event)"
            ></app-place-card>
          </div>
        </ng-container>

        <!-- Template shown if no visited places -->
        <ng-template #noVisitedPlacesTemplate>
          <div class="mt-4 text-gray-500 lg:block">
            {{ 'favoritesVisited.noVisitedPlaces' | translate }}
          </div>
        </ng-template>
      </section>
    </div>
  `,
})
export class FavoritesVisitedSectorComponent {
  @Input() favoritePlaces: Place[] = [];
  @Input() isPublic?: boolean;
  @Input() visitedPlaces: Place[] = [];

  /** Event emitted when favorite places are updated */
  @Output() favoritePlacesChanged = new EventEmitter<Place[]>();

  /** Event emitted when visited places are updated */
  @Output() visitedPlacesChanged = new EventEmitter<Place[]>();

  protected readonly PlaceCardType = PlaceCardType;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }

  /**
   * Handles toggling of favorite status from favoritePlaces section.
   * Adds or removes a place from favorites and emits the updated list.
   * @param event - Object with placeId and isFavorite flag
   */
  onFavoriteToggled(event: { placeId: number; isFavorite: boolean }): void {
    if (event.isFavorite) {
      if (!this.favoritePlaces.some((place) => place.id === event.placeId)) {
        const placeToAdd = this.favoritePlaces.find(
          (place) => place.id === event.placeId,
        );
        if (placeToAdd) {
          this.favoritePlaces = [...this.favoritePlaces, placeToAdd];
          this.favoritePlacesChanged.emit(this.favoritePlaces);
        }
      }
    } else {
      this.favoritePlaces = this.favoritePlaces.filter(
        (place) => place.id !== event.placeId,
      );
      this.favoritePlacesChanged.emit(this.favoritePlaces);
    }
  }

  /**
   * Handles toggling of favorite status from visitedPlaces section.
   * Removes the place from favorites if unfavorited.
   * @param event - Object with placeId and isFavorite flag
   */
  onFavoriteToggledVisited(event: {
    placeId: number;
    isFavorite: boolean;
  }): void {
    if (!event.isFavorite) {
      this.favoritePlaces = this.favoritePlaces.filter(
        (place) => place.id !== event.placeId,
      );
      this.favoritePlacesChanged.emit(this.favoritePlaces);
      this.cdr.detectChanges();
    }
  }
}
