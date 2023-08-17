import { type FC } from 'react';
import { useManifest } from '../hooks';

export const Manifest: FC = () => {
	const { data, error } = useManifest();

	console.log(data);

	if (error) return <div>Manifest failed to load</div>;

	return <div>Manifest loaded</div>;
};

Manifest.whyDidYouRender = true;

Manifest.displayName = 'DestinyManifest';

export default Manifest;
