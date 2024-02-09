import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services';

export const useUserQuery = () => {
    return useQuery({ 
        queryKey: ["userInfo"], 
        queryFn: userService.getUserData, 
        initialData: {name: ""} 
    })
}