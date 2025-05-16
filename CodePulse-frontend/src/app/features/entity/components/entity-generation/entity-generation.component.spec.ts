import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityGenerationComponent } from './entity-generation.component';

describe('EntityGenerationComponent', () => {
  let component: EntityGenerationComponent;
  let fixture: ComponentFixture<EntityGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
