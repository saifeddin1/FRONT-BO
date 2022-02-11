import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-outline',
  templateUrl: './button-outline.component.html',
  styleUrls: ['./button-outline.component.css'],
})
export class ButtonOutlineComponent implements OnInit {
  constructor() {}
  @Input() title: string = '';
  @Output() onClick = new EventEmitter<any>();

  ngOnInit(): void {}

  onClickButton(event) {
    this.onClick.emit(event);
  }
}
