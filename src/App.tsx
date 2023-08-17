import { type FC, useState, lazy } from 'react';
import { ErrorBoundary } from './components/Error';
import { Suspense, ScrollToTop } from './components/utils';

const Manifest = lazy(() => import('./components/Manifest'));

export const App: FC = () => {
	const [manifest, setManifest] = useState(false);

	return (
		<div>
			<ScrollToTop />
			<ErrorBoundary name="App">
				<Suspense>
					<button onClick={(): void => setManifest(true)}>Load Manifest</button>
					{manifest && (
						<Suspense>
							<Manifest />
						</Suspense>
					)}
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
