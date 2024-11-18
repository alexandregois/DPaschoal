import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@shared/services/auth.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { finalize, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-input-code-form',
  templateUrl: './input-code-form.component.html',
  styleUrls: ['./input-code-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCodeFormComponent implements OnInit {
  @Input()
  numOfDigits!: number;

  @Input() email: string = '';

  countDown: Subscription = new Subscription();
  counter = 600;
  tick = 1000;
  data: number = 0;
  isDisabled: boolean = true;
  isLoading: boolean = false;

  @Output() newItemEvent = new EventEmitter<string>();

  @ViewChildren('inputs')
  inputs!: QueryList<any>;

  recuperarSenhaCodForm: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {
    this.recuperarSenhaCodForm = this.fb.group({
      digits: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.enviarNovoCodigo();
    for (let i = 0; i < this.numOfDigits; i++) {
      (this.recuperarSenhaCodForm.get('digits') as FormArray).push(
        this.fb.control(null)
      );
    }
  }

  private iniciarTimer(): void {
    this.countDown = timer(0, this.tick).subscribe(() => {
      --this.counter;
      this.cdr.markForCheck();
      if (this.counter === 0) {
        this.isDisabled = false;
        this.counter = 0;
        this.countDown.unsubscribe();
      }
    });
  }

  getControls(): Array<AbstractControl> {
    return (this.recuperarSenhaCodForm.get('digits') as FormArray).controls;
  }

  enviarNovoCodigo(): void {
    this.isLoading = true;
    this.auth
      .recoveryPasswordSendEmail(this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
          this.counter = 600;
          this.isDisabled = true;
          this.iniciarTimer();
        })
      )
      .subscribe({
        error: () => {
          this.snackBar.open(
            'Erro ao reenviar Código',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
        },
      });
  }

  check(
    index: number,
    field: { value: any; setValue: (arg0: null) => void },
    event: any
  ): void {
    if (isNaN(event.data) && event.inputType !== 'deleteContentBackward') {
      field.setValue(null);
    }
    if (field.value && event.inputType !== 'deleteContentBackward') {
      if (index < this.inputs.toArray().length - 1) {
        this.inputs.toArray()[index + 1].nativeElement.focus();
      }
      if (!this.recuperarSenhaCodForm.invalid) {
        let form = this.recuperarSenhaCodForm.getRawValue();
        let re = /\,/gi;
        let code = form.digits.join().replace(re, '');
        this.newItemEvent.emit(code);
      }
    } else if (event.inputType === 'deleteContentBackward' && index > 0) {
      field.setValue(null);
      this.inputs.toArray()[index - 1].nativeElement.focus();
      this.newItemEvent.emit('');
    }
  }

  checkBackspace(
    index: number,
    field: { value: any; setValue: (arg0: null) => void },
    event: { key: string; preventDefault: () => void }
  ): void {
    if (field.value === null && event.key === 'Backspace' && index > 0) {
      event.preventDefault();
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
  }
  onSubmit(): void {
    if (this.recuperarSenhaCodForm.invalid) {
      return;
    }
  }
}
