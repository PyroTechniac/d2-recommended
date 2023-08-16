import { useQueries } from "@tanstack/react-query";
import { AllDestinyManifestComponents, DestinyManifestComponentName } from "bungie-api-ts/destiny2"
import { toHttpStatusError } from "../utils";

export const useDestinyComponents = (components: { [key: string]: string }, keys: string[]) => useQueries({
    queries: keys
        .map((t) => `Destiny${t}Definition` as DestinyManifestComponentName)
        .map((table) => ({
            queryKey: ['component', table],
            queryFn: async () => {
                const response = await fetch(`https://www.bungie.net${components[table]}`);
                if (response.ok) {
                    return await response.json() as AllDestinyManifestComponents[DestinyManifestComponentName];
                } else {
                    const error = await toHttpStatusError(response);
                    throw error;
                }

            }
        })),
});

export default useDestinyComponents;