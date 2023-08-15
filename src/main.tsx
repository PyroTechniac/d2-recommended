import './wdyr.ts';
import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Suspense from './components/Suspense.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<ReactQueryDevtools />
				<App />
			</Suspense>
		</QueryClientProvider>
	</React.StrictMode>,
);
