import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoice } from './invoice';
import {InvoiceService} from './invoice.service';

describe('Invoice', () => {
  let component: Invoice;
  let fixture: ComponentFixture<Invoice>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {
    invoiceService = jasmine.createSpyObj<InvoiceService>('InvoiceService', ['listInvoices']);
    invoiceService.listInvoices.and.resolveTo({invoices: []});

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
});
