import { useSuspenseQuery } from '@tanstack/react-query';
import {
	type GetAllDestinyManifestComponentsParams,
	getAllDestinyManifestComponents,
	getDestinyManifest,
	DestinyManifest,
} from 'bungie-api-ts/destiny2';
import { dedupPromise, unauthenticatedHttpClient } from '../utils';
import { type DestinyManifestDefinitions, buildDefinitionsFromManifest } from '../types';

export const useManifest = (): DestinyManifestDefinitions => {
	const { data: destinyManifest } = useSuspenseQuery({
		queryKey: ['manifest', 'raw'],
		queryFn: () =>
			dedupPromise(getDestinyManifest)(unauthenticatedHttpClient).then(
				(res): DestinyManifest => res.Response,
			),
	});

	const { data } = useSuspenseQuery({
		queryKey: ['manifest', 'all'],
		queryFn: () => {
			const options: GetAllDestinyManifestComponentsParams = {
				destinyManifest,
				language: 'en',
			};

			return dedupPromise(getAllDestinyManifestComponents)(
				unauthenticatedHttpClient,
				options,
			);
		},
	});

	return buildDefinitionsFromManifest(data);
};
