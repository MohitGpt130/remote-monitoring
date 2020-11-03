import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectScrollDirective } from './detect-scroll/detect-scroll.directive';
import { SpecialCharacterDirective } from './special-character.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DetectScrollDirective,
    SpecialCharacterDirective,
  ],
  exports: [
    DetectScrollDirective,
    SpecialCharacterDirective,
  ]
})
export class DirectivesModule { }
