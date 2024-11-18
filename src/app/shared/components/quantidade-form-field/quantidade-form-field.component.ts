import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-quantidade-form-field',
  templateUrl: './quantidade-form-field.component.html',
  styleUrls: ['./quantidade-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantidadeFormFieldComponent implements OnChanges {
  @Input() value: number | undefined;
  @Input() limit: number | undefined;
  @Input() minimum: number | undefined;
  @Input() allowZero?: boolean | undefined;
  @Output() update = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<number>();
  isDisabledForm: boolean = true;
  isDisabledAdd: boolean = true;
  isDisabledSubtract: boolean = true;

  timeout: ReturnType<typeof setTimeout> | undefined;

  ngOnChanges(): void {
    if (
      this.value !== undefined &&
      this.value !== null &&
      this.limit !== undefined &&
      this.limit !== null &&
      this.minimum !== undefined &&
      this.minimum !== null
    ) {
      this.checkValueType();
      this.checkLimit();
    } else {
      this.isDisabledForm = true;
    }
  }

  updateValue() {
    this.checkLimit();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.update.emit(this.value);
    }, 700);
  }

  checkValueType(): void {
    if (typeof this.value === 'string') {
      this.value = parseInt(this.value, 10) || 0;
    }
  }

  checkLimit(): void {
    const minAllowedValue = this.allowZero ? 0 : this.minimum;
    this.isDisabledForm =
      this.limit === undefined ||
      this.minimum === undefined ||
      this.minimum > this.limit;
    this.isDisabledAdd =
      this.value === undefined ||
      this.limit === undefined ||
      this.isDisabledForm ||
      this.value >= this.limit;
    this.isDisabledSubtract =
      this.value === undefined ||
      this.minimum === undefined ||
      this.isDisabledForm ||
      (minAllowedValue === undefined ? true : this.value <= minAllowedValue);

    setTimeout(() => this.setValue());
  }

  setValue(): void {
    if (this.value && this.minimum && this.limit) {
      let resto = this.value % this.minimum;

      if (this.value <= 0) {
        if (this.allowZero) {
          this.value = 0;
        } else {
          this.value = this.minimum;
        }
      }

      if (this.value > this.limit) {
        this.value = this.limit;
      } else if (this.value <= this.limit && resto > 0) {
        this.value = this.value - resto + this.minimum;
        if (this.value > this.limit) {
          this.value = this.value - this.minimum;
        }
      }
    } else {
      if (this.allowZero) {
        this.value = 0;
      } else {
        this.value = this.minimum;
      }
    }
  }

  add(): void {
    this.value = this.value! + this.minimum!;
    this.updateValue();
    this.quantityChanged.emit(this.value);
  }

  subtract(): void {
    this.value = this.value! - this.minimum!;
    this.updateValue();
    this.quantityChanged.emit(this.value);
  }

  changeValue() {
    this.checkValueType();
    this.updateValue();
    this.quantityChanged.emit(this.value);
  }
}
