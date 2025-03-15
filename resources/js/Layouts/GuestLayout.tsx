import { Toaster } from '@/Components/ui/toaster';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
            <div>
            <main>{children}</main>
            <Toaster/>
        </div>
    );
}
