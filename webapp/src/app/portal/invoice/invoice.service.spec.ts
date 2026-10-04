import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {InvoiceService} from './invoice.service';
import {API_BASE_URL, ApiService} from '../../api/ApiService';

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: API_BASE_URL, useValue: '/'},
        ApiService,
        InvoiceService,
      ],
    });

    invoiceService = TestBed.inject(InvoiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch the list of invoices from the API', async () => {
    const mockResponse = {
      invoices: [
        {
          id: '1',
          invoiceNumber: 'INV-001',
          userId: 'user1',
          subscriptionId: 'sub1',
          status: 'pending',
          currency: 'USD',
          amount: 100,
          balance: 100,
          items: [{description: 'Service', quantity: 1, unitAmount: 100, amount: 100}],
          createdAt: '2026-01-01',
          dueDate: '2026-01-15',
        },
      ],
      total: 1,
    };

    const promise = invoiceService.listInvoices({offset: 0, limit: 10});

    const req = httpTestingController.expectOne((r) => r.url === '/invoices' && r.params.get('offset') === '0' && r.params.get('limit') === '10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = await promise;
    expect(result.invoices.length).toBe(1);
    expect(result.total).toBe(1);
  });

});
