import useSWR, { SWRConfiguration } from 'swr';
import { IEquipment } from '../interfaces';


// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useEquipments = (url: string, config: SWRConfiguration = {} ) => {

    // const { data, error } = useSWR<IProduct[]>(`/api${ url }`, fetcher, config );
    const { data, error } = useSWR<IEquipment[]>(`/api${ url }`, config );

    return {
        equipments: data || [],
        isLoading: !error && !data,
        isError: error
    }

}