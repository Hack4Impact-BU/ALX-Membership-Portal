'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ReactQueryClientProvider = (props) => {
    const { children } = props;
    const [query] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000, 
                },
            },
        })
    );

    return (
        <QueryClientProvider client={query}>
            {children}
        </QueryClientProvider>
    );
};