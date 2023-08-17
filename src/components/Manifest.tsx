import { type FC } from 'react';
import { useManifest } from '../hooks';
import ItemIcon from './ItemIcon';

// const ItemIcon = lazy(() => import('./ItemIcon'));

export const Manifest: FC = () => {
	const { data, error } = useManifest();

	console.log(data);

	if (error) return <div>Manifest failed to load</div>;

	return (
		<>
			<div>Manifest Loaded</div>
			<ItemIcon />
		</>
	);
};

Manifest.whyDidYouRender = true;

Manifest.displayName = 'DestinyManifest';

export default Manifest;
