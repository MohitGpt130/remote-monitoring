import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvSreenSettingsComponent } from './tv-sreen-settings.component';

describe('TvSreenSettingsComponent', () => {
  let component: TvSreenSettingsComponent;
  let fixture: ComponentFixture<TvSreenSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvSreenSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvSreenSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
