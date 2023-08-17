import { useQuery } from '@tanstack/react-query';
import {
	type GetAllDestinyManifestComponentsParams,
	getAllDestinyManifestComponents,
} from 'bungie-api-ts/destiny2';
import { unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';
import { buildDefinitionsFromManifest } from '../types';

export const useManifest = () => {
	const { data } = useRawManifest();

	return useQuery({
		queryKey: ['manifest'],
		queryFn: async () => {
			const options: GetAllDestinyManifestComponentsParams = {
				destinyManifest: data!,
				language: 'en',
			};

			const manifest = await getAllDestinyManifestComponents(
				unauthenticatedHttpClient,
				options,
			);

			return buildDefinitionsFromManifest(manifest);
		},
		enabled: !!data,
	});
};

export default useManifest;
