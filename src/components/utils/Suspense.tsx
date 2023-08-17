import {
	type FC,
	type SuspenseProps as ReactSuspenseProps,
	Suspense as ReactSuspense,
} from 'react';
import Loader from './Loader';

export type SuspenseProps = Omit<ReactSuspenseProps, 'fallback'> & { message?: string };

export const Suspense: FC<SuspenseProps> = ({ message, ...props }) => (
	<ReactSuspense fallback={<Loader message={message} />} {...props} />
);

Suspense.whyDidYouRender = true;

Suspense.displayName = 'D2Suspense';

export default Suspense;
