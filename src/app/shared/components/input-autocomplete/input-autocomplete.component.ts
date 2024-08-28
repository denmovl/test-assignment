import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-input-autocomplete',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, NgForOf, FormsModule, FilterPipe],
  host: { '[class]': '"form-control"' },
  templateUrl: './input-autocomplete.component.html',
  styleUrl: './input-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputAutocompleteComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: InputAutocompleteComponent,
    },
  ],
})
export class InputAutocompleteComponent implements ControlValueAccessor, Validator {
  private cd = inject(ChangeDetectorRef);

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() items: string[] = [];

  value: string | null = null;
  disabled = false;
  isOpened = false;

  onChange = (value: string | null) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    this.value = value;
    this.cd.markForCheck();
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onItemClick(value: string): void {
    this.value = value;
    this.onChange(value);
    this.isOpened = false;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    if (!this.items.includes(control.value)) {
      return { invalid: true };
    }
    return null;
  }
}
