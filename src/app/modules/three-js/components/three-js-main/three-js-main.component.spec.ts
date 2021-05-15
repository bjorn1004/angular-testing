import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsMainComponent } from './three-js-main.component';

describe('ThreeJsMainComponent', () => {
  let component: ThreeJsMainComponent;
  let fixture: ComponentFixture<ThreeJsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
