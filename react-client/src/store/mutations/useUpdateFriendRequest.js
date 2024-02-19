import { useQueryClient, useMutation } from '@tanstack/react-query';
import { friendRequestService } from '../../services';

export const useUpdateFriendRequest = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: friendRequestService.respondToFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
        }
    })
}