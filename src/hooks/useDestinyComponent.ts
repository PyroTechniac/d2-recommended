import { useQuery } from "@tanstack/react-query";
import { AllDestinyManifestComponents, DestinyManifestComponentName } from "bungie-api-ts/destiny2"
import { toHttpStatusError } from "../utils";

export const useDestinyComponent = (components: { [key: string]: string }, key: string) => {
    const tableName = `Destiny${key}Definition` as DestinyManifestComponentName;


    return useQuery({
        queryKey: ['component', tableName],
        queryFn: async () => {
            const response = await fetch(`https://www.bungie.net${components[tableName]}`);

            if (response.ok) {
                return await response.json() as AllDestinyManifestComponents[DestinyManifestComponentName];
            } else {
                const err = await toHttpStatusError(response);
                throw err;
            }
        }
    });
}