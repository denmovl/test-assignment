import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserForm } from '../../models/user-form';
import { Country } from '../../enum/country';
import { InputAutocompleteComponent } from '../input-autocomplete/input-autocomplete.component';
import { NgClass } from '@angular/common';
import { ValidationDirective } from '../../directives/validation-message.directive';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ReactiveFormsModule, InputAutocompleteComponent, NgClass, ValidationDirective],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) form!: FormGroup<UserForm>;
  @Input() cantBeClosed = true;
  @Output() closeCard = new EventEmitter<void>();

  countries = Object.values(Country);

  closeCrd(): void {
    this.closeCard.emit();
  }
}
