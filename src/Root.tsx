import { type FC, StrictMode } from 'react';
import App from './App';
import { setupRateLimiter } from './utils';
import { FeatureBundle, LazyMotion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from './components/utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const domAnimation = (): Promise<FeatureBundle> =>
	import('./lazy/motion').then((imps) => imps.default);

setupRateLimiter();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

export const Root: FC = () => {
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen />
				<Suspense>
					<LazyMotion features={domAnimation} strict>
						<App />
					</LazyMotion>
				</Suspense>
			</QueryClientProvider>
		</StrictMode>
	);
};

Root.whyDidYouRender = true;

Root.displayName = 'ApplicationRoot';

export default Root;
