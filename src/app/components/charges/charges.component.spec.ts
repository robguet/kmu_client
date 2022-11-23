import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChargesService } from 'src/app/services/charges.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChargesComponent } from './charges.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ICategories_Response } from 'src/app/interfaces/charges/charges.model';
import { of } from 'rxjs';
import { IGeneral_Response } from '../../interfaces/charges/charges.model';
import { IUser_Profile } from 'src/app/interfaces/user/user.interface';

describe('ChargesComponent', () => {
  let component: ChargesComponent;
  let fixture: ComponentFixture<ChargesComponent>;
  let _chargesService: ChargesService;
  let _authService: AuthService;
  const user: IUser_Profile = {
    idUser: 0,
    name: '',
    email: '',
    budget: 0,
    cards: [{ cutoffDate: 1, fk_idCard: 1, value: 'hey' }],
    investmentLimit: 0,
  };
  const res: IGeneral_Response = {
    ok: true,
    result: [
      {
        color: '#216b04',
        date: '2022-10-07T00:00:00.000Z',
        icon: 'currency_exchange',
        label: 'Inversion',
        method: 'BBVA',
        money: 2147,
        title: 'Allianz',
        value: 'bbva',
      },
    ],
  };
  const Emptyres: IGeneral_Response = {
    ok: true,
    result: [],
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule],
      providers: [HttpClientTestingModule, HttpClientModule],
      declarations: [ChargesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _chargesService = TestBed.inject(ChargesService);
    _authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getCategories', fakeAsync(() => {
    const res: ICategories_Response = {
      ok: false,
      result: [{ color: '', icon: '', idCategory: 1, label: '', size: '' }],
    };
    spyOn(_chargesService, 'getCategories').and.returnValue(Promise.resolve(of(res)));
    component.getCategories();
    tick();
    expect(component.categories).toEqual(res.result);
  }));

  it('should handlePaymentMethodOnChange with payment method 0', () => {
    spyOn(component, 'ngOnInit');
    component.handlePaymentMethodOnChange(0);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should handlePaymentMethodOnChange', fakeAsync(() => {
    spyOn(_chargesService, 'getChargesbytMethod').and.returnValue(Promise.resolve(of(res)));
    component.dates = [{ card: 'string', endDate: 'string', startDate: 'string', idCard: 1 }];
    component.handlePaymentMethodOnChange(1);
    tick();
    expect(component.date).toBe(null);
  }));

  it('should onChangeDate', fakeAsync(() => {
    spyOn(_chargesService, 'getBill').and.returnValue(Promise.resolve(of(Emptyres)));
    spyOnProperty(_authService, 'usuario').and.returnValue(user); //spy getter

    component.onChangeDate([new Date(), new Date()]);
    tick();
    expect(component.total).toEqual(0);
  }));

  it('should categoryOnChange', fakeAsync(() => {
    spyOn(_chargesService, 'getChargesCategory').and.returnValue(Promise.resolve(of(res)));
    spyOn(component, 'calculateTotalMoney').and.returnValue(2);
    component.categoryOnChange(1);
    tick();
    expect(component.total).toEqual(2);
  }));

  it('should categoryOnChange category == 0', fakeAsync(() => {
    spyOn(component, 'ngOnInit');
    component.categoryOnChange(0);
    tick();
    expect(component.ngOnInit).toHaveBeenCalled();
  }));

  it('should getChargesCurrentMonth', fakeAsync(() => {
    spyOn(component, 'createChargesGraph');
    spyOn(_chargesService, 'getBill').and.returnValue(Promise.resolve(of(res)));
    component.getChargesCurrentMonth();
    tick();
    expect(component.createChargesGraph).toHaveBeenCalled();
  }));

  it('should ngOnInit', fakeAsync(() => {
    spyOn(component, 'buildBillingCycleDate');
    spyOn(component, 'getChargesCurrentMonth');
    spyOn(component, 'getCategories');

    component.ngOnInit();
    tick();
    expect(component.getChargesCurrentMonth).toHaveBeenCalled();
  }));

  it('should buildBillingCycleDate', () => {
    spyOnProperty(_authService, 'usuario').and.returnValue(user); //s

    const comp = component.buildBillingCycleDate();
    expect(comp).toEqual([
      {
        idCard: 1,
        card: 'hey',
        startDate: '2022-10-2',
        endDate: '2022-11-1',
      },
    ]);
  });
});
