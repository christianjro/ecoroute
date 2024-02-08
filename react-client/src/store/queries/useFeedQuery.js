import { useQuery } from '@tanstack/react-query';
import { feedService } from '../../services';

export const useFeedQuery = () => {
    return useQuery({ 
        queryKey: ["feed"], 
        queryFn: feedService.getFeed, 
        initialData: {} 
    })
}