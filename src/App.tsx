import { type FC, lazy, useState } from 'react';
import { ErrorBoundary } from './components/Error';

const Manifest = lazy(() => import('./components/Manifest'));

export const App: FC = () => {
	const [showManifest, setShowManifest] = useState(false);

	return (
		<ErrorBoundary name="D2 Recommended Root">
			<button onClick={() => setShowManifest(true)}>Load Manifest</button>
			{showManifest && (<Manifest />)}
		</ErrorBoundary>
	);
};

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
