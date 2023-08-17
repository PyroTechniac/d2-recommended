import { type UseQueryResult, useQueries } from '@tanstack/react-query';
import {
	type AllDestinyManifestComponents,
	type DestinyManifestComponentName,
	type GetDestinyManifestComponentParams,
	getDestinyManifestComponent,
} from 'bungie-api-ts/destiny2';
import { unauthenticatedHttpClient } from '../utils';
import useRawManifest from './useRawManifest';

export const useDestinyComponents = <T extends readonly DestinyManifestComponentName[]>(
	keys: T,
): UseQueryResult<{
	-readonly [P in keyof AllDestinyManifestComponents]: AllDestinyManifestComponents[P];
}>[] => {
	const { data, isSuccess } = useRawManifest();

	return useQueries({
		queries: keys.map((table) => ({
			queryKey: ['component', table],
			queryFn: (): Promise<AllDestinyManifestComponents[typeof table]> => {
				const options: GetDestinyManifestComponentParams<typeof table> = {
					destinyManifest: data!,
					language: 'en',
					tableName: table,
				};

				return getDestinyManifestComponent(unauthenticatedHttpClient, options);
			},
			enabled: isSuccess,
		})),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}) as any;
};

export default useDestinyComponents;
