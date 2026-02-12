import { Outlet, useLoaderData } from '@koda/runtime';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastContext';
import { User } from '@shared/types';

export default function RootLayout() {
    const data = useLoaderData() as { user: User | null };

    return (
        <ToastProvider>
            <AuthProvider initialUser={data?.user}>
                <Outlet />
            </AuthProvider>
        </ToastProvider>
    );
}
