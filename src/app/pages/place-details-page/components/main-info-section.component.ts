import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../shared/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { IconData, ICONS } from '../../../shared/constants/icons.constant';
import { FILTER_CATEGORIES } from '../../../shared/constants/catalog-filter.config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Theme } from '../../../shared/models/theme.type';
import { ThemedIconPipe } from '../../../shared/pipes/themed-icon.pipe';
import { ThemeService } from '../../../shared/services/theme.service';
import { CheckInsService } from '../../../shared/services/check-ins.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthApiService } from '../../../shared/services/auth-api.service';

export type FlexibleIcon =
  | IconData
  | {
      iconURL: string;
      iconURLDarkTheme?: string;
      label: string;
    };

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule, ThemedIconPipe],
  template: `
    <div [ngClass]="themeTextClass" class="flex flex-col gap-6">
      <!-- Place Name -->
      <h3>{{ place.name }}</h3>

      <!-- Rating / Reviews / Address -->
      <div
        class="body-font-1 flex flex-col justify-between gap-[32px] lg:flex-row"
      >
        <div [ngClass]="themeTextClass" class="flex flex-1 flex-col gap-2">
          <div class="flex items-center gap-2">
            <app-icon [icon]="ICONS.Star" />
            <span>{{ place.rating }}</span>
            <span>({{ place.reviewCount }})</span>
          </div>
          <div class="flex items-center gap-2">
            <app-icon [icon]="ICONS.Location" />
            <a
              [href]="googleMapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
            >
              {{ place.address }}
            </a>
          </div>
        </div>

        <!-- Working Hours -->
        <div class="flex-1" *ngIf="place?.workingHours">
          <div class="gap-[20px]">
            <div
              [ngClass]="workingHoursClass"
              class="flex items-center justify-center gap-3 rounded-[40px] px-6 py-2"
            >
              <app-icon [icon]="'Clock' | themedIcon"></app-icon>
              <div class="flex flex-col justify-center gap-1 text-center">
                <span class="menu-text-font">{{
                  'place_details_page.main_info.opening_hours' | translate
                }}</span>
                <span class="body-font-1">{{ place.workingHours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- About / Description -->
      <div class="flex flex-col gap-4">
        <h5>{{ 'place_details_page.main_info.about_cafe' | translate }}</h5>
        <span class="body-font-1">{{ place.longDescription }}</span>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2" *ngIf="place?.tags?.length">
          <div
            *ngFor="let tag of place.tags"
            class="tag-item flex items-center justify-center gap-2 rounded-[40px] px-4 py-2"
            [ngClass]="tagClass"
          >
            <ng-container *ngIf="TAG_ICON_MAP[tag.id.toString()] as icon">
              <ng-container *ngIf="isIconData(icon); else customIcon">
                <app-icon [icon]="icon"></app-icon>
              </ng-container>
              <ng-template #customIcon>
                <img [src]="getIconURL(icon)" [alt]="getIconLabel(icon)" />
              </ng-template>
            </ng-container>
            <span class="body-font-2">{{ tag.name }}</span>
          </div>
        </div>
      </div>

      <!-- Check-in Button -->
      <button
        type="button"
        class="w-full gap-2 px-4 py-3 lg:w-1/2"
        (click)="onCheckInClick($event)"
        [disabled]="isCheckedIn && isAuthenticated"
        [title]="checkInTitle | translate"
        [ngClass]="checkInButtonClass"
      >
        <ng-container *ngIf="isAuthenticated; else notAuth">
          <app-icon
            [icon]="isCheckedIn ? ICONS.CheckCircle : ICONS.AddCircle"
          ></app-icon>
          {{
            isCheckedIn
              ? ('button.check_in.checked_in' | translate)
              : ('button.check_in.check_in' | translate)
          }}
        </ng-container>
        <ng-template #notAuth>
          <app-icon [icon]="ICONS.AddCircle"></app-icon>
          {{ 'place_details_page.main_info.log_in_to_check_in' | translate }}
        </ng-template>
      </button>
    </div>
  `,
})
export class MainInfoSectionComponent implements OnInit {
  @Input() place!: Place;

  @Output() unauthorizedClick = new EventEmitter<void>();

  currentTheme$: Observable<Theme>;
  ICONS = ICONS;
  TAG_ICON_MAP: Record<string, FlexibleIcon> = {};
  isCheckedIn = false;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private checkInsService: CheckInsService,
    private storageService: StorageService,
    private userService: AuthApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentTheme$ = this.themeService.theme$;
    this.initializeTagIconMap();
  }

  ngOnInit(): void {
    this.updateCheckInStatus();
  }

  // ================== Private Methods ==================

  /** Map tag IDs to icons */
  private initializeTagIconMap(): void {
    FILTER_CATEGORIES.forEach((category) => {
      category.options.forEach((option) => {
        this.TAG_ICON_MAP[option.id.toString()] = {
          iconURL: option.iconURL ?? '',
          iconURLDarkTheme: option.iconURLDarkTheme ?? '',
          label: option.label,
        };
      });
    });
  }

  /** Type guard: distinguish IconData vs custom FlexibleIcon */
  isIconData(icon: FlexibleIcon): icon is IconData {
    return 'viewBox' in icon;
  }

  /** Return correct icon URL based on current theme */
  getIconURL(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) return '';
    return this.themeService.currentTheme === 'dark' && icon.iconURLDarkTheme
      ? icon.iconURLDarkTheme
      : icon.iconURL;
  }

  /** Get label for custom icon */
  getIconLabel(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) return '';
    return icon.label;
  }

  /** Update local check-in status from stored user profile */
  private updateCheckInStatus(): void {
    if (!this.place) return;
    const publicProfile = this.storageService.getPublicUserProfile();
    this.isCheckedIn =
      publicProfile?.checkInCafes?.some((cafe) => cafe.id === this.place.id) ??
      false;
    this.cdr.detectChanges();
  }

  /** Handle click on check-in button */
  onCheckInClick(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.isAuthenticated) {
      this.unauthorizedClick.emit();
      return;
    }
    if (this.isCheckedIn) {
      return;
    }
    this.performCheckIn();
  }

  /** Perform check-in and refresh user profile */
  private performCheckIn(): void {
    this.checkInsService.checkInToCafe(this.place.id).subscribe({
      next: () => {
        const userId = this.storageService.getUser()?.userId || 0;
        this.userService.getPublicUserProfile(userId).subscribe({
          next: (profile) => {
            this.storageService.setPublicUserProfile(profile);
            this.isCheckedIn = true;
            this.checkInsService['checkInsUpdatedSource'].next();
            this.cdr.detectChanges();
            this.router.navigate(['/catalog', this.place.id]);
          },
          error: (err) => console.error('Error updating user profile:', err),
        });
      },
      error: (err) => console.error('Error performing check-in:', err),
    });
  }

  // ================== Getters ==================
  get isAuthenticated(): boolean {
    return !!this.storageService.getUser();
  }

  get googleMapsUrl(): string {
    const query = encodeURIComponent(
      `${this.place.address}, ${this.place.city}`,
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  get checkInTitle(): string {
    if (this.isCheckedIn) return 'button.check_in.already_checked_in';
    if (this.isAuthenticated) return 'button.check_in.check_in';
    return 'place_details_page.main_info.please_login_to_check_in';
  }

  get themeTextClass(): string {
    return this.themeService.currentTheme === 'dark'
      ? 'text-[var(--color-gray-20)]'
      : 'text-[var(--color-gray-75)]';
  }

  get workingHoursClass(): string {
    return this.themeService.currentTheme === 'dark'
      ? 'bg-[var(--color-bg-card)] text-[var(--color-gray-20)]'
      : 'bg-[var(--color-bg-2)] text-[var(--color-gray-100)]';
  }

  get tagClass(): string {
    return this.themeService.currentTheme === 'dark'
      ? 'bg-[var(--color-bg-card)]'
      : 'bg-[var(--color-secondary)]';
  }

  get checkInButtonClass(): string {
    if (!this.isAuthenticated) return 'button-bg-blue';
    return this.isCheckedIn ? 'button-bg-transparent' : 'button-bg-blue';
  }
}
