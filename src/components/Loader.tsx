import { type FC } from 'react';

export interface LoaderProps {
	message?: string;
}

export const Loader: FC<LoaderProps> = ({ message = 'Loading' }) => (
	<div>{message}</div>
);

Loader.whyDidYouRender = true;

Loader.displayName = 'LoadingIndicator';

export default Loader;
