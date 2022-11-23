import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoginComponent } from './login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { IProfile_Auth } from '../interfaces/user/user.interface';
import { of } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let _authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule, // << ----- add this line
        ReactiveFormsModule,
        MatSnackBarModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        NzButtonModule,
      ],
      providers: [HttpClientTestingModule, HttpClientModule],
      declarations: [LoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    _authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should checkValue', () => {
    const comp = component.checkValue(false);
    expect(comp).toBeFalsy();
  });

  it('should initForm', () => {
    const user: IProfile_Auth = {
      email: 'fake@email.com',
      password: '12345',
    };
    component.initForm(user);
    expect(component.checked).toBeTruthy();
  });

  it('should login checked is true', () => {
    component.checked = true;
    component.form.patchValue({ email: 'fake@email.com', password: '12345' });
    // component.login();
  });

  it('should login', fakeAsync(() => {
    component.checked = false;
    const res = {
      token: '34567',
      ok: true,
    };
    spyOn(_authService, 'login').and.returnValue(Promise.resolve(of(res)));
    spyOn(router, 'navigate');
    component.form.patchValue({ email: 'fake@email.com', password: '12345' });
    // component.login();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));
});
