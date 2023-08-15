import { type FC } from 'react';
// import styles from './index.module.scss';
import autoRifle from '../../assets/auto_rifle.svg';
import bow from '../../assets/bow.svg';

const possibleIcons = [autoRifle, bow];

export const Loader: FC = () => {
    const icon = possibleIcons[Math.floor(Math.random() * DataTransferItemList.length)];

    return (
        <div>
            {icon}
        </div>
    )
}

Loader.whyDidYouRender = true;

Loader.displayName = 'LoadingIndicator';

export default Loader;