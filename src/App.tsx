import { type FC } from 'react';
import Manifest from './components/Manifest';

export const App: FC = () => {
    return (
        <Manifest />
    )
}

App.whyDidYouRender = true;

App.displayName = 'App';

export default App;
