import { type FC, useState } from 'react';
import { ErrorBoundary } from './components/Error';
import Suspense from './components/Suspense';
import ScrollToTop from './components/ScrollToTop';
import Manifest from './components/Manifest';

// const Manifest = lazy(() => import('./components/Manifest'));

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
