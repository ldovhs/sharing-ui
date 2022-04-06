import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";

const REWARD_TYPE_QUERY = "/api/admin/rewardType";
const PENDING_REWARD_SUBMIT = "/api/admin/pendingReward";
const PENDING_REWARD_QUERY = "/api/admin/pendingReward";

export const withRewardTypeQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, status, isLoading, error } = useQuery("rewardTypeQuery", () =>
            axios.get(REWARD_TYPE_QUERY)
        );

        return (
            <Component
                {...props}
                isFetchingRewardType={isLoading}
                rewardTypes={data?.data}
                queryError={error}
            />
        );
    };

export const withPendingRewardSubmit =
    (Component) =>
    ({ ...props }) => {
        const { data, error, isError, isLoading, isSuccess, mutateAsync } = useMutation(
            "pendingRewardSubmit",
            (pendingReward) => axios.post(PENDING_REWARD_SUBMIT, pendingReward)
        );

        const handleOnSubmit = async (pendingReward) => {
            return await mutateAsync(pendingReward);
        };

        return (
            <Component
                {...props}
                isSubmitting={isLoading}
                submittedQuest={data?.data}
                mutationError={error}
                onSubmit={(pendingReward) => handleOnSubmit(pendingReward)}
            />
        );
    };

export const withPendingRewardQuery =
    (Component) =>
    ({ ...props }) => {
        const router = useRouter();
        const username = typeof router.query?.username === "string" ? router.query.username : "";
        const specialcode =
            typeof router.query?.specialcode === "string" ? router.query.specialcode : "";

        const { data, status, isLoading, error } = useQuery(
            ["pendingRewardQuery", username, specialcode],
            () =>
                axios.get(PENDING_REWARD_QUERY, { params: { username, generatedURL: specialcode } })
        );

        return (
            <Component
                {...props}
                isFetchingRewardType={isLoading}
                data={data?.data}
                queryError={error}
            />
        );
    };
