import { lazy, type FC } from 'react';
import { ErrorBoundary } from './components/Error';
import { ScrollToTop, Suspense } from './components/utils';
import { useIsFetching, useIsRestoring } from '@tanstack/react-query';

const Manifest = lazy(() => import('./components/Manifest'));

export const App: FC = () => {
	const isFetching = useIsFetching();
	const isRestoring = useIsRestoring();

	const message = isRestoring
		? 'Restoring manifest'
		: isFetching
		? 'Fetching manifest'
		: 'Loading manifest';

	return (
		<div>
			<ScrollToTop />
			<ErrorBoundary name="App">
				<Suspense message={message}>
					<Manifest />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
