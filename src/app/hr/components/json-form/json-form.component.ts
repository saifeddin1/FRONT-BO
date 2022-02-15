import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonFormControls, JsonFormData } from '../../models/jsonFormData';

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.css'],
})
export class JsonFormComponent implements OnChanges {
  @Input() jsonFormData: JsonFormData;
  public myForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }
  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      this.myForm.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
  }

  onSubmit() {
    console.log('Form valid: ', this.myForm.valid);
    console.log('Form values: ', this.myForm.value);
  }

  ngOnInit() {}
}
