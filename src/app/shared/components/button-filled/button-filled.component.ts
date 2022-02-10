import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-filled',
  templateUrl: './button-filled.component.html',
  styleUrls: ['./button-filled.component.css'],
})
export class ButtonFilledComponent implements OnInit {
  constructor() {}
  @Input() title: string = '';
  ngOnInit(): void {}
}
