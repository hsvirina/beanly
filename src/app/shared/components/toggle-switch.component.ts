import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <div
      class="relative flex h-[20px] w-[38px] cursor-pointer items-center rounded-full p-[2px] transition-colors duration-300 lg:h-[36px] lg:w-[75px] lg:p-[3px]"
      [ngClass]="{
        'border border-[var(--color-gray-55)]': !checked,
        'bg-[var(--color-primary)]': checked,
      }"
      (click)="toggle()"
      role="switch"
      [attr.aria-checked]="checked"
      tabindex="0"
      (keydown.enter)="toggle()"
      (keydown.space)="toggle()"
    >
      <div
        class="h-[15px] w-[15px] rounded-full shadow transition-transform duration-300 lg:h-[30px] lg:w-[30px]"
        [ngStyle]="{
          transform: checked
            ? screenWidth >= 1024
              ? 'translateX(38px)'
              : 'translateX(19px)'
            : 'translateX(0)',
          backgroundColor: checked
            ? 'var(--color-white)'
            : 'var(--color-gray-55)',
        }"
      ></div>
    </div>
  `,
})
export class ToggleSwitchComponent implements OnInit, OnDestroy {
  @Input() checked = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  screenWidth = window.innerWidth;

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = (): void => {
    this.screenWidth = window.innerWidth;
  };

  /**
   * Toggles the checked state and emits the new value.
   */
  toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
