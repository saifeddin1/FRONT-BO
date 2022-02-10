import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-outline',
  templateUrl: './button-outline.component.html',
  styleUrls: ['./button-outline.component.css'],
})
export class ButtonOutlineComponent implements OnInit {
  constructor() {}
  @Input() title: string = '';
  ngOnInit(): void {}
}
