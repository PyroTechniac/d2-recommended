import { type FC, useEffect, memo } from 'react';

export const ScrollToTop: FC = memo(() => {
	useEffect((): void => {
		window.scrollTo(0, 0);
	}, []);

	return null;
});

ScrollToTop.whyDidYouRender = true;

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
