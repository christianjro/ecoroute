import { useQueryClient, useMutation } from '@tanstack/react-query';
import { vehicleService } from '../../services';

export const useCreateVehicle = () => {
    const queryClient = useQueryClient()
    return useMutation({ 
        mutationFn: vehicleService.createVehicle, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userInfo"] })
        }
    })
}