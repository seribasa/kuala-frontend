import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaymentSuccess } from './payment-success';

describe('PaymentSuccess', () => {
  let component: PaymentSuccess;
  let fixture: ComponentFixture<PaymentSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuccess],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render success title and actions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Payment Successful');
    expect(compiled.textContent).toContain('View Invoices');
    expect(compiled.textContent).toContain('Go to Dashboard');
  });
});
