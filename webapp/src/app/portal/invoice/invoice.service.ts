import {Injectable} from '@angular/core';
import {ApiService} from '../../api/ApiService';

export interface InvoiceListParams {
  offset: number;
  limit: number;
}

export interface PayInvoiceOptions {
  success_url?: string;
  failed_url?: string;
}

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(private readonly apiService: ApiService) {
  }

  async listInvoices(params: InvoiceListParams): Promise<any> {
    const response:any = await this.apiService.get<any>('/invoices', {
      params: {
        offset: params.offset,
        limit: params.limit,
      },
    });

    return {
      invoices: response.invoices ?? [],
      total: response.total ?? response.totalCount ?? response.count,
    };
  }

  async payInvoice(invoiceId: string, options?: PayInvoiceOptions): Promise<string | null> {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:4200';
    const success_url = options?.success_url ?? `${origin}/portal/invoice/success`;
    const failed_url = options?.failed_url ?? `${origin}/portal/invoice/failed`;

    const response:any = await this.apiService.post<any>(`/invoices/${invoiceId}/pay`, {},
      {
        observe: 'response',
        params: {
          success_url,
          failed_url,
        },
      }
    );

    const location:any = response?.body?.data?.redirect_url;

    return location ?? null;
  }
}
