import { type FC, StrictMode } from 'react';
import App from './App';
import { setupRateLimiter } from './utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from './components/utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './components/Error';

setupRateLimiter();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			gcTime: 30000,
		},
	},
});

export const Root: FC = () => {
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen />
				<ErrorBoundary name="Root">
					<Suspense>
						<App />
					</Suspense>
				</ErrorBoundary>
			</QueryClientProvider>
		</StrictMode>
	);
};

Root.whyDidYouRender = true;

Root.displayName = 'ApplicationRoot';

export default Root;
