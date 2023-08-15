import {type FC} from 'react';
import styles from './Loader.module.scss';

export const Loader: FC = () => (
    <div className={styles.loader}>
        <div></div>
    </div>
);

Loader.whyDidYouRender = true;

Loader.displayName = 'LoadingIcon';

export default Loader;