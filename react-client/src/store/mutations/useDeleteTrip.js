import { useQueryClient, useMutation } from '@tanstack/react-query';
import { tripService } from '../../services';

export const useDeleteTrip = () => {
    const queryClient = useQueryClient()
    return useMutation({ 
        mutationFn: tripService.deleteTrip, 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["trips"]})
        }
    })
}