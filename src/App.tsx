import { type FC } from 'react';
// import Manifest from './components/Manifest';
import Loader from './components/Loader';

export const App: FC = () => {
    return (
        <Loader />
    )
}

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
