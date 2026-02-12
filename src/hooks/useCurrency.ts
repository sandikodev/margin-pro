import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GoogleGenAI } from "@google/genai";
import { CURRENCIES } from '@/lib/constants';
import { ExchangeRates } from '@shared/types';


export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const defaultRates: ExchangeRates = { IDR: 1, USD: 16000, SGD: 12000, CNY: 2200, JPY: 105 };

  const { data: exchangeRates = defaultRates, isLoading: isRefreshingRates, refetch: fetchLiveRates } = useQuery<ExchangeRates>({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Return a JSON object with approximate market exchange rates for 1 USD, 1 SGD, 1 CNY, and 1 JPY converted to Indonesian Rupiah (IDR). The JSON must have keys "USD", "SGD", "CNY", "JPY" with number values.',
          config: {
            responseMimeType: 'application/json',
          }
        });
        const data = JSON.parse(response.text || '{}') as Partial<ExchangeRates>;
        return {
          USD: data.USD || defaultRates.USD,
          SGD: data.SGD || defaultRates.SGD,
          CNY: data.CNY || defaultRates.CNY,
          JPY: data.JPY || defaultRates.JPY,
          IDR: 1
        };
      } catch (e) {
        console.error("Forex Fetch Error:", e);
        // Fallback values
        return { USD: 16300, SGD: 12150, CNY: 2250, JPY: 108, IDR: 1 };
      }
    },
    initialData: defaultRates,
    staleTime: 1000 * 60 * 60, // 1 Hour
  });

  const formatValue = (idrAmount: number, options: { compact?: boolean, noCurrency?: boolean } = {}) => {
    const rate = exchangeRates[selectedCurrency.code] || 1;
    const converted = selectedCurrency.code === 'IDR' ? idrAmount : idrAmount / rate;

    return new Intl.NumberFormat(selectedCurrency.locale, {
      style: options.noCurrency ? undefined : 'currency',
      currency: options.noCurrency ? undefined : selectedCurrency.code,
      maximumFractionDigits: options.compact ? 0 : (converted < 10 ? 2 : 0)
    }).format(converted);
  };

  return {
    selectedCurrency,
    setSelectedCurrency,
    exchangeRates,
    isRefreshingRates,
    fetchLiveRates,
    formatValue
  };
};
