
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        snap: any;
    }
}

const MIDTRANS_SNAP_URL = "https://app.midtrans.com/snap/snap.js";
const CLIENT_KEY = "Mid-client-sK82M9wG1HME4rwa"; // Setup Env var in real app

export const useMidtrans = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const scriptId = "midtrans-script";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = MIDTRANS_SNAP_URL;
        script.id = scriptId;
        script.setAttribute("data-client-key", CLIENT_KEY);
        script.onload = () => setIsLoaded(true);

        document.body.appendChild(script);

        return () => {
            // Optional cleanup if we want to remove it on unmount
            // document.body.removeChild(script); 
        };
    }, []);

    const pay = (snapToken: string, onSuccess: (result: any) => void, onPending: (result: any) => void, onError: (result: any) => void, onClose: () => void) => {
        if (window.snap) {
            window.snap.pay(snapToken, {
                onSuccess,
                onPending,
                onError,
                onClose
            });
        }
    };

    return { isLoaded, pay };
};
