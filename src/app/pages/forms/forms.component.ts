import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { UserForm } from '../../shared/models/user-form';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { userNameValidator } from '../../shared/validators/user-validator';
import { UsersService } from '../../shared/services/users.service';
import { endWith, finalize, map, Observable, Subscription, take, timer } from 'rxjs';
import { SubmitService } from '../../shared/services/submit.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserCardComponent, ReactiveFormsModule, NgIf, AsyncPipe, DatePipe],
})
export class FormsComponent implements OnDestroy {
  #usersService = inject(UsersService);
  #submitService = inject(SubmitService);

  readonly submitTime = 5;

  usersForm: FormGroup<{ users: FormArray<FormGroup<UserForm>> }> = this.#generateForm();
  #today: Date;
  timer$: Observable<Date | null> | null = null;
  timerSubscription: Subscription | null = null;
  isTimerActive = false;

  get invalidFormsCounter(): number {
    return this.usersForm.controls.users.controls.filter((c) => c.invalid).length;
  }

  get formsCounter(): number {
    return this.usersForm.controls.users.length;
  }

  constructor() {
    this.#today = new Date();
    this.#today.setHours(0, 0, 0, 0);

    this.addUserForm();
  }

  #generateForm(): FormGroup {
    return new FormGroup<{
      users: FormArray<FormGroup<UserForm>>;
    }>({ users: new FormArray<FormGroup<UserForm>>([]) });
  }

  addUserForm(): void {
    this.usersForm.controls.users.push(
      new FormGroup<UserForm>({
        country: new FormControl(null, { validators: [Validators.required] }),
        userName: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [userNameValidator(this.#usersService)],
        }),
        birthDay: new FormControl(null, {
          validators: [
            Validators.required,
            (c) => {
              if (new Date(c.value).getTime() >= this.#today.getTime()) {
                return { invalid: true };
              }
              return null;
            },
          ],
        }),
      }),
    );
  }

  cancel(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timer$ = null;
    this.usersForm.enable();
    this.isTimerActive = false;
  }

  submit(): void {
    if (this.usersForm.invalid || this.isTimerActive) return;

    this.usersForm.disable();
    this.isTimerActive = true;

    this.timer$ = timer(0, 1000).pipe(
      take(this.submitTime + 1),
      map((i) => new Date(0, 0, 0, 0, 0, this.submitTime - i, 0)),
      endWith(null),
    );

    this.timerSubscription = this.timer$.subscribe({
      complete: () => {
        const value = this.usersForm.controls.users.value as User[];
        this.#submitService
          .send(value)
          .pipe(
            finalize(() => {
              this.usersForm.reset();
              this.usersForm.enable();
              this.isTimerActive = false;
              this.timer$ = null;
            }),
          )
          .subscribe();
      },
    });
  }

  onClose(index: number): void {
    this.usersForm.controls.users.removeAt(index);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
