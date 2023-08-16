import { useQuery } from "@tanstack/react-query";
import { type GetAllDestinyManifestComponentsParams, getAllDestinyManifestComponents, getDestinyManifest } from "bungie-api-ts/destiny2";
import { unauthenticatedHttpClient } from "../utils";

export const useManifest = () => useQuery(['manifest'], async () => {
    const manifest = (await getDestinyManifest(unauthenticatedHttpClient)).Response;

    const options: GetAllDestinyManifestComponentsParams = {destinyManifest: manifest, language: 'en'};

    return getAllDestinyManifestComponents(unauthenticatedHttpClient, options);
});