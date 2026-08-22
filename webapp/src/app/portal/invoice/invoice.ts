import { Component, OnInit } from '@angular/core';

interface InvoiceItem {
  id: string;
  plan: string;
  amount: string;
  invoiceDate: string;
  status: 'Paid' | 'Unpaid';
}

@Component({
  selector: 'app-invoice',
  imports: [],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css'
})
export class Invoice implements OnInit {

  invoices: InvoiceItem[] = [];
  currentPage = 1;
  totalPages = 1;

  async ngOnInit(): Promise<void> {
    this.invoices = await this.getInvoices();
  }

  /** Mock API call; replace the Promise with the invoice service when the endpoint is available. */
  private getInvoices(): Promise<InvoiceItem[]> {
    return Promise.resolve([
      {
        id: 'INV-001',
        plan: 'Basic',
        amount: '$24.99',
        invoiceDate: '01 June 2026',
        status: 'Paid'
      },
      {
        id: 'INV-002',
        plan: 'Premium',
        amount: '$49.99',
        invoiceDate: '15 June 2026',
        status: 'Unpaid'
      }
    ]);
  }

  viewInvoice(invoice: InvoiceItem): void {
    console.log('View invoice', invoice.id);
  }

  savePdf(invoice: InvoiceItem): void {
    console.log('Save invoice PDF', invoice.id);
  }

  payInvoice(invoice: InvoiceItem): void {
    console.log('Pay invoice', invoice.id);
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

}
