import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyChargesComponent } from './monthly-charges.component';

describe('MonthlyChargesComponent', () => {
  let component: MonthlyChargesComponent;
  let fixture: ComponentFixture<MonthlyChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyChargesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
