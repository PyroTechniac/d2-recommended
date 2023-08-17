import './wdyr.ts';
import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Suspense from './components/Suspense.tsx';
import { setupRateLimiter } from './utils';
import { LazyMotion } from 'framer-motion';

const domAnimation = () => import('./lazy/motion.ts').then((imps) => imps.default);

setupRateLimiter();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
			retry: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<LazyMotion features={domAnimation} strict>
			<QueryClientProvider client={queryClient}>
				<Suspense>
					<ReactQueryDevtools />
					<App />
				</Suspense>
			</QueryClientProvider>
		</LazyMotion>
	</React.StrictMode>,
);
