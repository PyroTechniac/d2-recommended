import { type FC, lazy } from 'react';
import { ErrorBoundary } from './components/Error';

const Manifest = lazy(() => import('./components/Manifest'));

export const App: FC = () => {
	return (
		<ErrorBoundary name="D2 Recommended Root">
			<Manifest />
		</ErrorBoundary>
	);
};

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
