import { AfterViewInit, Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements AfterViewInit {

    constructor(private elementRef: ElementRef) { }
    
    ngAfterViewInit(): void {
        this.elementRef.nativeElement.focus();
    }
}