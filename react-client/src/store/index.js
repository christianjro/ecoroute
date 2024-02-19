import { useAirQualityIndexQuery } from "./queries/useAirQualityIndexQuery";
import { useFeedQuery } from "./queries/useFeedQuery";
import { useTripQuery } from "./queries/useTripQuery";
import { useUserQuery } from "./queries/useUserQuery";
import { useFriendRequestQuery } from "./queries/useFriendRequestQuery";

import { useCreateVehicle } from "./mutations/useCreateVehicle";
import { useUpdateVehicle } from "./mutations/useUpdateVehicle";
import { useCreateTrip } from "./mutations/useCreateTrip";
import { useDeleteTrip } from "./mutations/useDeleteTrip";
import { useCreateUser } from "./mutations/useCreateUser";

export { 
    useAirQualityIndexQuery, 
    useFeedQuery, 
    useTripQuery, 
    useUserQuery, 
    useFriendRequestQuery,
    useCreateVehicle, 
    useUpdateVehicle, 
    useCreateTrip, 
    useDeleteTrip, 
    useCreateUser }