import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../utils';

export const useManifest = (): unknown => {
    const { data } = useQuery({
        queryKey: ['manifest'],
        queryFn: async () => {
            const res = await apiFetch('/Destiny2/Manifest');

            return res;
        }
    });

    return data!.Response;
}