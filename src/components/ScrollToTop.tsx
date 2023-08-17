import { type FC, useEffect } from 'react';

export const ScrollToTop: FC = () => {
    useEffect((): void => {
        window.scrollTo(0, 0);
    }, []);

    return null;
}

ScrollToTop.whyDidYouRender = true;

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;