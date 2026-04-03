export function mapPlans(response: any[]): any[] {
  if (!Array.isArray(response)) {
    return [];
  }

  const plans = response.map((plan: any) => {
    const amount = getUsdPrice(plan.prices);
    return { ...plan, price: formatCurrency(amount), usdAmount: amount };
  });

  return plans.sort((a: any, b: any) => a.usdAmount - b.usdAmount);
}

export function getUsdPrice(prices?: any[]): number {
  return prices?.find((p: any) => p.currency === 'USD')?.amount ?? 0;
}

export function formatCurrency(amount: number): string {
  return `$${amount}`;
}
