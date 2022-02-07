import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonOutlineComponent } from './components/button-outline/button-outline.component';
import { ButtonFilledComponent } from './components/button-filled/button-filled.component';
import { CustomTextInputComponent } from './components/custom-text-input/custom-text-input.component';
import { CustomDateInputComponent } from './components/custom-date-input/custom-date-input.component';
import { CustomSwitchComponent } from './components/custom-switch/custom-switch.component';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { CustomSearchButtonComponent } from './components/custom-search-button/custom-search-button.component';



@NgModule({
  declarations: [ButtonOutlineComponent, ButtonFilledComponent, CustomTextInputComponent, CustomDateInputComponent, CustomSwitchComponent, CustomDropdownComponent, CustomSearchButtonComponent],
  imports: [
    CommonModule
  ],
  exports :  [
    ButtonOutlineComponent,
    ButtonFilledComponent,
    CustomTextInputComponent,
    CustomDateInputComponent,
    CustomSwitchComponent,
    CustomDropdownComponent,
    CustomSearchButtonComponent
  ]
})
export class SharedModule { }
