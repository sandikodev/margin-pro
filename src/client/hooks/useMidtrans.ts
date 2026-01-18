
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: unknown) => void;
        };
    }
}

const MIDTRANS_SNAP_URL = "https://app.midtrans.com/snap/snap.js";
const CLIENT_KEY = "Mid-client-sK82M9wG1HME4rwa"; // Setup Env var in real app

export const useMidtrans = () => {
    const [isLoaded, setIsLoaded] = useState(() => !!document.getElementById("midtrans-script"));

    useEffect(() => {
        const scriptId = "midtrans-script";
        // We rely on lazy useState to handle the case where script is already present.
        // If it exists but isLoaded is false (rare race condition), we proceed to check/create.
        if (isLoaded || document.getElementById(scriptId)) return;

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
    }, [isLoaded]);

    const pay = (snapToken: string, onSuccess: (result: unknown) => void, onPending: (result: unknown) => void, onError: (result: unknown) => void, onClose: () => void) => {
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
