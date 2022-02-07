import { Injectable, HostListener, AfterViewInit, OnInit } from '@angular/core';

import 'magnific-popup';

@Injectable({
  providedIn: 'root'
})
export class HelperService implements AfterViewInit, OnInit {

  windowScrolled: boolean | undefined;
  closeResult: string | undefined;
  constructor() { }

  // Sticky Nav
  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.windowScrolled = window.scrollY > 100;
  }
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }
  // navigation
  navMethod: boolean = false;
  toggleNav() {
    this.navMethod = !this.navMethod;
  }
  // Canvas
  canvasMethod: boolean = false;
  toggleCanvas() {
    this.canvasMethod = !this.canvasMethod;
  }
  //Mobile
  open: boolean = false;
  trigger(item: { open: boolean; }) {
    item.open = !item.open;
  }
  // Add class on resize and onload window
  visible: boolean = false;
  breakpoint: number = 1199;
  public innerWidth: any;
  detectHeader() {
    this.innerWidth = window.innerWidth;
    this.visible = this.innerWidth >= this.breakpoint;
  }
  ngOnInit(): void {
    this.detectHeader();
  }
  ngAfterViewInit(): void {
    ($('.popup-youtube') as any).magnificPopup({
      type: 'iframe'
    });
    ($('.gallery-img-popup') as any).magnificPopup({
      type: 'image',
      gallery: {
        enabled: true,
      },
      mainClass: 'mfp-fade',
    });
  }
}
