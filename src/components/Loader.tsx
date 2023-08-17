import { type FC } from 'react';
import styles from './Loader.module.scss';
import { AnimatePresence, type Orchestration, type Tween, type Variants, m } from 'framer-motion';

const containerAnimateVariants: Variants = {
	initial: { opacity: 0 },
	open: { opacity: 1 },
};

const containerAnimateTransition: Tween & Orchestration = {
	duration: 0.5,
	delay: 1,
};

const messageAnimateVariants: Variants = {
	initial: { y: -16, opacity: 0 },
	open: { y: 0, opacity: 1 },
	leave: { y: 16, opacity: 0 },
};

const messageAnimateTransition: Tween = { duration: 0.2, ease: 'easeOut' };

export interface LoaderProps {
	message?: string;
}

export const Loader: FC<LoaderProps> = ({ message = 'Loading' }) => (
	<m.div
		className={styles['text-container']}
		initial="initial"
		animate="open"
		variants={containerAnimateVariants}
		transition={containerAnimateTransition}
	>
		<AnimatePresence>
			<m.div
				key={message}
				className={styles.text}
				initial="initial"
				animate="open"
				exit="leave"
				variants={messageAnimateVariants}
				transition={messageAnimateTransition}
			>
				{message}
			</m.div>
		</AnimatePresence>
	</m.div>
);

Loader.whyDidYouRender = true;

Loader.displayName = 'LoadingIndicator';

export default Loader;
