import { useQuery } from '@tanstack/react-query';
import { tripService } from '../../services';

export const useTripQuery = () => (
    useQuery({ 
        queryKey: ["trips"], 
        queryFn: tripService.getTrips, 
        initialData: [] 
    })
)