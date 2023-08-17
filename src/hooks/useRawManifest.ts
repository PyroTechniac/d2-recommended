import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { dedupPromise, unauthenticatedHttpClient } from '../utils';
import { type DestinyManifest, getDestinyManifest } from 'bungie-api-ts/destiny2';

export const useRawManifest = (): UseQueryResult<DestinyManifest> =>
	useQuery(['rawManifest'], () => {
		const fetcher = dedupPromise(getDestinyManifest);

		return fetcher(unauthenticatedHttpClient).then((res) => res.Response);
	});

export default useRawManifest;
