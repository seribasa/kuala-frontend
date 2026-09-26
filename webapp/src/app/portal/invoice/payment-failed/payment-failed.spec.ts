import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaymentFailed } from './payment-failed';

describe('PaymentFailed', () => {
  let component: PaymentFailed;
  let fixture: ComponentFixture<PaymentFailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFailed],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFailed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render failed title and actions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Payment Failed');
    expect(compiled.textContent).toContain('Try Again from Invoices');
    expect(compiled.textContent).toContain('Go to Dashboard');
  });
});
