import { useQueryClient, useMutation } from '@tanstack/react-query';
import { vehicleService } from '../../services';

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient()
    return useMutation({ 
        mutationFn: vehicleService.updateVehicle, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userInfo"] })
        }
    })
}