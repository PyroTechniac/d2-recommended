import { useQuery } from "@tanstack/react-query";
import { type GetAllDestinyManifestComponentsParams, getAllDestinyManifestComponents, getDestinyManifest } from "bungie-api-ts/destiny2";
import { unauthenticatedHttpClient } from "../utils";

export const useManifest = () => useQuery({
    queryKey: ['manifest'],
    queryFn: async () => {
        const manifest = (await getDestinyManifest(unauthenticatedHttpClient)).Response;

        const options: GetAllDestinyManifestComponentsParams = { destinyManifest: manifest, language: 'en' };

        return getAllDestinyManifestComponents(unauthenticatedHttpClient, options);
    },
});