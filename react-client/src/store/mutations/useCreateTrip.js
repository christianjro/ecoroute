import { useQueryClient, useMutation } from '@tanstack/react-query';
import { tripService } from '../../services';

export const useCreateTrip = () => {
    const queryClient = useQueryClient()
    return useMutation({ 
        mutationFn: tripService.createTrip, 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["trips"]})
    }})
}