import { type FC } from 'react';
import styles from './Panel.module.scss';
import { BungieError, HttpStatusError, RecommendedError } from '../../utils';
import { PlatformErrorCodes } from 'bungie-api-ts/destiny2';

export interface PanelProps {
    title?: string;
    error?: Error;
    fallbackMessage?: string;
    showReload?: boolean;
}

export const Panel: FC<PanelProps> = ({ title, error, fallbackMessage, showReload }) => {
    const underlyingError = error instanceof RecommendedError ? error.cause : undefined;
    let code: string | number | undefined = error instanceof RecommendedError ? error.code : undefined;
    if (underlyingError) {
        if (underlyingError instanceof BungieError) {
            code = underlyingError.code;
        } else if (underlyingError instanceof HttpStatusError) {
            code = underlyingError.status;
        }
    }

    const name = underlyingError?.name || error?.name;
    const message = error?.message || fallbackMessage;

    return (
        <div className={styles['error-panel']}>
            <h2>
                {title || 'Something went wrong'}

                {error && (
                    <span className={styles['error-code']}>
                        {name}
                        {code !== undefined && ' '}
                        {code}
                    </span>
                )}
            </h2>
            <p>
                {message}
                {underlyingError instanceof BungieError && (
                    <span>
                        {' '}
                        {underlyingError.code === PlatformErrorCodes.SystemDisabled
                            ? 'This affects all Destiny apps, and the D2 Recommended team cannot fix or bypass it.'
                            : 'Try loading your inventory in the Destiny 2 Companion App to see if Bungie.net is down.'}
                    </span>
                )}
            </p>
            {showReload && (
                <button onClick={() => window.location.reload()}>
                    Reload
                </button>
            )}
        </div>
    );
}

Panel.whyDidYouRender = true;

Panel.displayName = 'ErrorPanel';

export default Panel;