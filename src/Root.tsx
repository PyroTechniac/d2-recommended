import { type FC, StrictMode } from 'react';
import App from './App';
import { setupRateLimiter } from './utils';
import { QueryClient } from '@tanstack/react-query';
import { Suspense } from './components/utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/Error';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

setupRateLimiter();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			gcTime: 1000 * 60 * 60 * 24,
		},
	},
});

const persister = createSyncStoragePersister({
	storage: window.localStorage,
});

export const Root: FC = () => {
	return (
		<StrictMode>
			<PersistQueryClientProvider
				client={queryClient}
				persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
			>
				<ReactQueryDevtools initialIsOpen />
				<ErrorBoundary name="Root">
					<Suspense>
						<App />
					</Suspense>
				</ErrorBoundary>
			</PersistQueryClientProvider>
		</StrictMode>
	);
};

Root.whyDidYouRender = true;

Root.displayName = 'ApplicationRoot';

export default Root;
