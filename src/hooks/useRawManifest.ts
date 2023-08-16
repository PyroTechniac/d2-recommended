import { useQuery } from '@tanstack/react-query';
import { unauthenticatedHttpClient } from '../utils';
import { getDestinyManifest } from 'bungie-api-ts/destiny2';

export const useRawManifest = () =>
	useQuery(['rawManifest'], async () => {
		const manifest = (await getDestinyManifest(unauthenticatedHttpClient)).Response;

		return manifest;
	});

export default useRawManifest;
