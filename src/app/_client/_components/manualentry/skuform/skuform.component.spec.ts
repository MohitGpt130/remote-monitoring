import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuformComponent } from './skuform.component';

describe('SkuformComponent', () => {
  let component: SkuformComponent;
  let fixture: ComponentFixture<SkuformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
