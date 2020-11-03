import { Directive, EventEmitter, Output, OnInit } from '@angular/core';

@Directive({
  selector: '[ngInit]'
})
export class NgInitDirective implements OnInit {

  @Output()
  ngInit: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.ngInit.emit();
  }
}
