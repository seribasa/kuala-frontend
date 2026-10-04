import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoice } from './invoice';
import {InvoiceService} from './invoice.service';

describe('Invoice', () => {
  let component: Invoice;
  let fixture: ComponentFixture<Invoice>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {
    invoiceService = jasmine.createSpyObj<InvoiceService>('InvoiceService', ['listInvoices', 'payInvoice']);
    invoiceService.listInvoices.and.resolveTo({invoices: []});
    invoiceService.payInvoice.and.resolveTo('https://payment-gateway.example.com/checkout');

    await TestBed.configureTestingModule({
      imports: [Invoice],
      providers: [{provide: InvoiceService, useValue: invoiceService}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Invoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage when payInvoice fails', async () => {
    invoiceService.payInvoice.and.rejectWith(new Error('Network error'));

    const invoiceItem = {
      id: 'inv_123',
      invoiceNumber: 'INV-123',
      description: 'Monthly subscription',
      amount: '$10.00',
      invoiceDate: '01 January 2026',
      dueDate: '15 January 2026',
      status: 'Pending',
      canPay: true,
      raw: {} as any,
    };

    await component.payInvoice(invoiceItem);
    expect(component.errorMessage).toBe('We could not initiate payment. Please try again.');
  });
});
