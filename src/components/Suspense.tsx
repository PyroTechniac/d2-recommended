import {
	type FC,
	type SuspenseProps as ReactSuspenseProps,
	Suspense as ReactSuspense,
} from 'react';
import Loader from './Loader';

export type SuspenseProps = Omit<ReactSuspenseProps, 'fallback'>;

export const Suspense: FC<SuspenseProps> = ({ ...props }) => (
	<ReactSuspense fallback={<Loader />} {...props} />
);

Suspense.whyDidYouRender = true;

Suspense.displayName = 'D2Suspense';

export default Suspense;
