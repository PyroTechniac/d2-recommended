import { useQueries } from '@tanstack/react-query';
import {
	type DestinyManifestComponentName,
	type GetDestinyManifestComponentParams,
	getDestinyManifestComponent,
} from 'bungie-api-ts/destiny2';
import { unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';

export const useDestinyComponents = <T extends readonly DestinyManifestComponentName[]>(
	keys: T,
) => {
	const { data } = useRawManifest();

	return useQueries({
		queries: keys.map((table) => ({
			queryKey: ['component', table],
			queryFn: async () => {
				const options: GetDestinyManifestComponentParams<typeof table> = {
					destinyManifest: data!,
					language: 'en',
					tableName: table,
				};

				return getDestinyManifestComponent(unauthenticatedHttpClient, options);
			},
			enabled: !!data,
		})),
	});
};

export default useDestinyComponents;
