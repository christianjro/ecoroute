import { useQueryClient, useMutation } from '@tanstack/react-query';
import { friendRequestService } from '../../services';

export const useCreateFriendRequest = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: friendRequestService.createFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
        }
    })
}