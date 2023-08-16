import { type FC } from 'react';
import { useManifest } from '../hooks';

export const Manifest: FC = () => {
    const manifest = useManifest();

    console.log(manifest);

    return (
        <div>Manifest loaded</div>
    )
}

Manifest.whyDidYouRender = true;

Manifest.displayName = 'DestinyManifest';

export default Manifest;