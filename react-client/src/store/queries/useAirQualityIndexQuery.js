import { useQuery } from '@tanstack/react-query';
import { getAirQualityIndex } from '../../services';

export const useAirQualityIndexQuery = (location) => {
    return useQuery({ 
        queryKey: ["airQualityIndex"], 
        queryFn: () => getAirQualityIndex(location), 
        enabled: !!location 
    })
}