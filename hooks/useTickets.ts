import useSWR, { SWRConfiguration } from 'swr';
import { ITicket } from '../interfaces';


// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useTickets = (url: string, config: SWRConfiguration = {} ) => {

    // const { data, error } = useSWR<IProduct[]>(`/api${ url }`, fetcher, config );
    const { data, error } = useSWR<ITicket[]>(`/api${ url }`, config );

    return {
        tickets: data || [],
        isLoading: !error && !data,
        isError: error
    }

}