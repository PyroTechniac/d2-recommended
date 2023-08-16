import { type FC } from 'react';
import { useManifest } from '../hooks';

export const Manifest: FC = () => {
	const { data, error } = useManifest();

	if (error) return <div>Manifest failed to load</div>;

	console.log(data);

	return <div>Manifest loaded</div>;
};

Manifest.whyDidYouRender = true;

Manifest.displayName = 'DestinyManifest';

export default Manifest;
