import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CostItem } from '@shared/types';
import { cleanAIJSON } from '../lib/utils';
import { useToast } from '../context/ToastContext';

export const useAIEstimator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { showToast } = useToast();

    const estimateCosts = async (projectName: string): Promise<CostItem[] | null> => {
        if (!projectName.trim() || isGenerating) return null;

        setIsGenerating(true);
        try {
            // Note: In a real prod app, you might want to proxy this through your backend
            // to avoid exposing the API key if it's not a public-safe key.
            // Assuming process.env.API_KEY is available as per original code.
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API Key configuration missing");
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `List 5 - 8 main cost components(ingredients or materials) and estimated cost in IDR for product / service "${projectName}".
    IMPORTANT: Identify if an item is usually bought in bulk / stock or per unit.
      Return strictly valid JSON with a "costs" array containing objects with:
- "name"(string)
    - "amount"(number, total price of purchase)
    - "allocation"(string, either 'unit' or 'bulk')
    - "batchYield"(number, estimated units one purchase can serve.If 'unit', set 1).`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash', // SAFEST BET (3-flash-preview might be deprecated or typo)
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            costs: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        amount: { type: Type.NUMBER },
                                        allocation: { type: Type.STRING },
                                        batchYield: { type: Type.NUMBER }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const data = JSON.parse(cleanAIJSON(response.text || '{}'));

            if (data.costs && Array.isArray(data.costs)) {
                return data.costs.map((c: { name: string; amount: number; allocation: string; batchYield: number }) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: c.name,
                    amount: c.amount,
                    allocation: (c.allocation === 'bulk' || c.allocation === 'unit') ? c.allocation : 'unit',
                    batchYield: c.batchYield || 1,
                    bulkUnit: 'units' as const,
                    // Defaults for other fields
                    isRange: false
                }));
            }
            return [];

        } catch (e) {
            console.error("Magic Estimate Error:", e);
            showToast("Gagal mengestimasi biaya. Cek koneksi atau kuota API.", "error");
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return { estimateCosts, isGenerating };
};
