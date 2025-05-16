import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSelectionComponent } from './tech-selection.component';

describe('TechSelectionComponent', () => {
  let component: TechSelectionComponent;
  let fixture: ComponentFixture<TechSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
