import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import React from "react";

const REWARD_TYPE_QUERY = "/api/admin/rewardType";

export const withRewardTypeQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, status, isLoading, error } = useQuery("rewardTypeQuery", () =>
            axios.get(REWARD_TYPE_QUERY)
        );

        const generatedRef = React.createRef();
        return (
            <Component
                {...props}
                isFetchingRewardType={isLoading}
                rewardTypes={data?.data}
                queryError={error}
                generatedRef={generatedRef}
            />
        );
    };
