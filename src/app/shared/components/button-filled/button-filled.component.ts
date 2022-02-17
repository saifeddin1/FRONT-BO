import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-filled',
  templateUrl: './button-filled.component.html',
  styleUrls: ['./button-filled.component.css'],
})
export class ButtonFilledComponent implements OnInit {
  constructor() {}
  @Input() title: string = '';
  @Output() onClick = new EventEmitter<any>();

  ngOnInit(): void {}

  onClickButton(event) {
    this.onClick.emit(event);
  }
}
