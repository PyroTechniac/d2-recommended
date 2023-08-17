import { type FC } from 'react';
import { useManifest } from '../hooks';
import ItemIcon from './ItemIcon';

export const Manifest: FC = () => {
	const data = useManifest();

	console.log(data);

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
