import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuformdailogComponent } from './skuformdailog.component';

describe('SkuformdailogComponent', () => {
  let component: SkuformdailogComponent;
  let fixture: ComponentFixture<SkuformdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuformdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuformdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
