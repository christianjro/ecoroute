import { useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '../../services';

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userInfo"] })
        }
    })
}