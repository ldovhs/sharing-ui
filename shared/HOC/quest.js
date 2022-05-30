import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import Enums from "enums";

const QUEST_TYPE_QUERY = `${Enums.BASEPATH}/api/admin/quest/type`;
const USER_QUEST_QUERY = `${Enums.BASEPATH}/api/user/quest/`;
const USER_QUEST_SUBMIT = `${Enums.BASEPATH}/api/user/quest/submit`;
const USER_IMAGE_QUEST_SUBMIT = `${Enums.BASEPATH}/api/user/quest/submit-image`;
const USER_DAILY_QUEST_SUBMIT = `${Enums.BASEPATH}/api/user/quest/submitDaily`;

const ADMIN_QUEST_QUERY = `${Enums.BASEPATH}/api/admin/quest/`;
const ADMIN_QUEST_UPSERT = `${Enums.BASEPATH}/api/admin/quest/upsert`;

export const withQuestUpsert =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "mutateQuest",
            (quest) => axios.post(ADMIN_QUEST_UPSERT, quest),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("adminQueryQuest");
                },
            }
        );

        const handleOnUpsert = async (quest) => {
            return await mutateAsync(quest);
        };

        return (
            <Component
                {...props}
                isLoading={isLoading}
                mutationError={error}
                onUpsert={(quest) => handleOnUpsert(quest)}
            />
        );
    };

export const withUserDailyQuestSubmit =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "submitDailyQuest",
            (quest) => axios.post(USER_DAILY_QUEST_SUBMIT, quest),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("userRewardQuery");
                },
            }
        );

        const handleOnSubmit = async (quest, currentQuests) => {
            let submitted = await mutateAsync(quest);

            if (submitted) {
                let updatedQuests = currentQuests.map((q) => {
                    if (q.questId == quest.questId) {
                        q.isDone = true;
                    }
                    return q;
                });

                return await Promise.all(updatedQuests).then(() => {
                    updatedQuests.sort(isNotDoneFirst);
                    return updatedQuests;
                });
            }
        };

        return (
            <Component
                {...props}
                isSubmittingDaily={isLoading}
                submittedDailyQuest={data?.data}
                mutationDailyError={error}
                onSubmitDaily={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
            />
        );
    };

export const withUserQuestSubmit =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "submitQuest",
            (quest) => axios.post(USER_QUEST_SUBMIT, quest),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("userRewardQuery");
                },
            }
        );

        const handleOnSubmit = async (quest, currentQuests) => {
            let submitted = await mutateAsync(quest);

            if (submitted) {
                let updatedQuests = currentQuests.map((q) => {
                    if (q.questId == quest.questId) {
                        q.isDone = true;
                    }
                    return q;
                });

                return await Promise.all(updatedQuests).then(() => {
                    updatedQuests.sort(isNotDoneFirst);
                    return updatedQuests;
                });
            }
        };

        return (
            <Component
                {...props}
                isSubmitting={isLoading}
                submittedQuest={data?.data}
                mutationError={error}
                onSubmit={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
            />
        );
    };

export const withUserImageQuestSubmit =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "submitImageQuest",
            (quest) => axios.post(USER_IMAGE_QUEST_SUBMIT, quest),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("userRewardQuery");
                },
            }
        );

        const handleOnSubmit = async (quest, currentQuests) => {
            return await mutateAsync(quest);
        };

        return (
            <Component
                {...props}
                isSubmitting={isLoading}
                submittedQuest={data?.data}
                mutationError={error}
                onSubmitImageQuest={(quest, currentQuests) => handleOnSubmit(quest, currentQuests)}
            />
        );
    };

export const withAdminQuestQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, error, status, isLoading } = useQuery("adminQueryQuest", () =>
            axios.get(ADMIN_QUEST_QUERY)
        );

        return <Component {...props} isLoading={isLoading} quests={data?.data} error={error} />;
    };

export const withUserQuestQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, status, isLoading, error } = useQuery("userQueryQuest", () =>
            axios.get(USER_QUEST_QUERY)
        );
        return (
            <Component
                {...props}
                isFetchingUserQuests={isLoading}
                userQuests={data?.data}
                queryError={error}
            />
        );
    };

export const withQuestTypeQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, status, isLoading, error } = useQuery("questTypeQuery", () =>
            axios.get(QUEST_TYPE_QUERY)
        );

        return (
            <Component
                {...props}
                isFetchingRewardType={isLoading}
                questTypes={data?.data}
                queryError={error}
            />
        );
    };

function isNotDoneFirst(a, b) {
    return Number(a.isDone) - Number(b.isDone);
}
