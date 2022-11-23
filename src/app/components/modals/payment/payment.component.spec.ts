import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChargesService } from 'src/app/services/charges.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentComponent } from './payment.component';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let _chargesService: ChargesService;
  // mock object with close method
  const dialogMock = {
    close: () => {
      return;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule],
      providers: [
        HttpClientTestingModule,
        HttpClientModule,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
      ],
      declarations: [PaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _chargesService = TestBed.inject(ChargesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleMakePayment', () => {
    const res = { ok: true };
    spyOn(_chargesService, 'makePayment').and.returnValue(of(res));
    component.handleMakePayment();
    expect(component).toBeTruthy();
  });

  it('should onNoClick', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.onNoClick();
    expect(spy).toHaveBeenCalled();
  });
});
