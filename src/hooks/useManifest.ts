import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
	type GetAllDestinyManifestComponentsParams,
	getAllDestinyManifestComponents,
} from 'bungie-api-ts/destiny2';
import { dedupPromise, unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';
import { DestinyManifestDefinitions, buildDefinitionsFromManifest } from '../types';

export const useManifest = (): UseQueryResult<DestinyManifestDefinitions> => {
	const { data, isSuccess } = useRawManifest();

	return useQuery(
		['manifest'],
		() => {
			const options: GetAllDestinyManifestComponentsParams = {
				destinyManifest: data!,
				language: 'en',
			};

			const fetcher = dedupPromise(getAllDestinyManifestComponents);

			return fetcher(unauthenticatedHttpClient, options).then(buildDefinitionsFromManifest);
		},
		{ enabled: isSuccess },
	);
};
