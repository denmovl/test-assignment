import { Directive, DoCheck, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidation]',
  standalone: true,
})
export class ValidationDirective implements DoCheck, OnDestroy {
  #ngControl = inject(NgControl);
  #ref = inject(ElementRef<HTMLElement>);
  #errorContainer = document.createElement('div');

  @Input() errorTexts: Record<string, string> = {};

  constructor() {
    this.#ref.nativeElement.after(this.#errorContainer);
  }

  ngDoCheck(): void {
    if (this.#ngControl.invalid) {
      this.#ref.nativeElement.classList.add('is-invalid');
      for (const key of Object.keys(this.#ngControl.errors!)) {
        if (this.errorTexts[key]) {
          this.#errorContainer.innerHTML = this.errorTexts[key];
          this.#errorContainer.classList.add('text-danger');
        }
      }
    } else {
      this.#ref.nativeElement.classList.remove('is-invalid');
      this.#errorContainer.innerHTML = '';
    }
  }

  ngOnDestroy(): void {
    this.#errorContainer.remove();
  }
}
