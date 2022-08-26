import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";
import { useSession } from "next-auth/react";
import { utils } from "ethers";

const REWARD_TYPE_QUERY = `${Enums.BASEPATH}/api/admin/rewardType`;
const PENDING_REWARD_SUBMIT = `${Enums.BASEPATH}/api/admin/reward/addPending`;
const PENDING_REWARD_QUERY = `${Enums.BASEPATH}/api/user/reward/getPending`;
const USER_GET_CLAIMED_REWARD = `${Enums.BASEPATH}/api/user/reward/getClaimed`;
const USER_CLAIMED_REWARD = `${Enums.BASEPATH}/api/user/reward/claim`;

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

export const withClaimableRewardQuery =
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
                    isFetchingReward={isLoading}
                    reward={data?.data}
                    queryError={error}
                />
            );
        };

export const withClaimRewardSubmit =
    (Component) =>
        ({ ...props }) => {
            const queryClient = useQueryClient();
            const { data, error, isError, isLoading, isSuccess, mutateAsync } = useMutation(
                "claimRewardSubmit",
                (claimableReward) => axios.post(USER_CLAIMED_REWARD, claimableReward),
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries("pendingRewardQuery"); // query the old pending, should have pendingReward.isClaimed = true
                    },
                }
            );

            const handleOnSubmit = async (claimableReward) => {
                return await mutateAsync(claimableReward);
            };

            return (
                <Component
                    {...props}
                    isSubmittingReward={isLoading}
                    submittedReward={data?.data}
                    mutationError={error}
                    onSubmitReward={(claimableReward) => handleOnSubmit(claimableReward)}
                />
            );
        };

export const useUserRewardQuery = () => {
    const { data: session, status } = useSession({ required: false });
    let wallet = session?.user?.address

    const { data, isLoading } = useQuery(["userRewardQuery", wallet], () => {
        try {
            return axios.get(`${USER_GET_CLAIMED_REWARD}/${utils.getAddress(wallet)}`).then((r) => r.data)
        } catch (error) {
            //to not throw an error when wallet is null initially
        }

    }
    );

    return [data, isLoading];
};
