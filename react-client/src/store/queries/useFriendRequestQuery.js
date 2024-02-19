import { useQuery } from '@tanstack/react-query';
import { friendRequestService } from '../../services';

export const useFriendRequestQuery = () => {
    return useQuery ({
        queryKey: ["friendRequests"],
        queryFn: friendRequestService.getFriendRequests,
        initialData: {"received": [], "sent": []}
    })
}
