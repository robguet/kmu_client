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
});
