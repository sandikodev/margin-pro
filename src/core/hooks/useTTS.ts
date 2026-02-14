import { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Project } from '@shared/types';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAudioSummary = async (activeProject: Project, formattedTotalCost: string, formattedTargetNet: string) => {
    if (isSpeaking || !activeProject) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const analysisPrompt = `Berikan ringkasan strategi harga untuk menu "${activeProject.name}". Modal total: ${formattedTotalCost}. Laba bersih per porsi: ${formattedTargetNet}. Gunakan bahasa Indonesia yang ceria.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: analysisPrompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass({ sampleRate: 24000 });
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
    }
  };

  return {
    isSpeaking,
    handleAudioSummary
  };
};