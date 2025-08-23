import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { IconComponent } from './icon.component';
import { ICONS } from '../constants/icons.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <nav aria-label="breadcrumb">
      <ol class="flex flex-wrap items-center text-[var(--color-gray-75)]">
        <li
          *ngFor="let crumb of breadcrumbs; let last = last"
          class="button-font flex items-center"
        >
          <!-- Link for all but last breadcrumb -->
          <a *ngIf="!last" [routerLink]="crumb.url">{{ crumb.label }}</a>

          <!-- Plain text for last breadcrumb -->
          <span *ngIf="last" class="cursor-pointer text-[var(--color-primary)]">
            {{ crumb.label }}
          </span>

          <!-- Arrow icon between breadcrumbs (except after last) -->
          <app-icon
            *ngIf="!last"
            [icon]="ICONS.ArrowBack"
            class="mx-3 inline-block rotate-180"
          ></app-icon>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent implements OnChanges, OnDestroy {
  @Input() lastLabel: string | null = null;

  readonly ICONS = ICONS;

  breadcrumbs: { label: string; url: string }[] = [];

  private routerSubscription?: Subscription;
  private langSubscription?: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService,
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());

    this.langSubscription = this.translate.onLangChange.subscribe(() =>
      this.buildBreadcrumbs(),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastLabel']) {
      this.buildBreadcrumbs();
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.langSubscription?.unsubscribe();
  }

  private buildBreadcrumbs(): void {
    const urlPath = this.router.url.split('?')[0].split('#')[0];

    const segments = urlPath.split('/').filter(Boolean);

    // Reset breadcrumbs if not inside '/catalog' route
    if (segments.length === 0 || segments[0] !== 'catalog') {
      this.breadcrumbs = [];
      return;
    }

    // Base breadcrumbs: Home and Catalog
    const crumbs = [
      { label: this.translate.instant('breadcrumb.home'), url: '/' },
      { label: this.translate.instant('breadcrumb.catalog'), url: '/catalog' },
    ];

    // If URL is '/catalog/:id' where id is numeric, add details breadcrumb
    if (segments.length === 2 && /^\d+$/.test(segments[1])) {
      crumbs.push({
        label: this.lastLabel || this.translate.instant('breadcrumb.details'),
        url: `/catalog/${segments[1]}`,
      });
    }

    this.breadcrumbs = crumbs;
  }
}
