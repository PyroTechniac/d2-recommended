import { type UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import {
	type GetAllDestinyManifestComponentsParams,
	getAllDestinyManifestComponents,
} from 'bungie-api-ts/destiny2';
import { dedupPromise, unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';
import { DestinyManifestDefinitions, buildDefinitionsFromManifest } from '../types';

export const useManifest = (): UseSuspenseQueryResult<DestinyManifestDefinitions> => {
	const { data } = useRawManifest();

	return useSuspenseQuery({
		queryKey: ['manifest'],
		queryFn: () => {
			const options: GetAllDestinyManifestComponentsParams = {
				destinyManifest: data,
				language: 'en',
			};

			const fetcher = dedupPromise(getAllDestinyManifestComponents);

			return fetcher(unauthenticatedHttpClient, options).then(buildDefinitionsFromManifest);
		},
	});
};

export default useManifest;
