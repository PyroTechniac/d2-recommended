import { useQuery } from '@tanstack/react-query';
import {
	type GetAllDestinyManifestComponentsParams,
	getAllDestinyManifestComponents,
} from 'bungie-api-ts/destiny2';
import { unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';

export const useManifest = () => {
	const { data } = useRawManifest();

	return useQuery({
		queryKey: ['manifest'],
		queryFn: async () => {
			const options: GetAllDestinyManifestComponentsParams = {
				destinyManifest: data!,
				language: 'en',
			};

			return getAllDestinyManifestComponents(unauthenticatedHttpClient, options);
		},
		enabled: !!data,
	});
};

export default useManifest;
