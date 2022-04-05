import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";

const USER_QUEST_QUERY = "/api/user/quest/";
const USER_QUEST_SUBMIT = "/api/user/quest/submit";

const ADMIN_QUEST_QUERY = "/api/admin/quest/";
const ADMIN_QUEST_UPSERT = "/api/admin/quest/upsert";

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

export const withUserQuestSubmit =
    (Component) =>
    ({ ...props }) => {
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "submitQuest",
            (quest) => axios.post(USER_QUEST_SUBMIT, quest)
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
        const router = useRouter();
        const username = typeof router.query?.username === "string" ? router.query.username : "";

        const { data, status, isLoading, error } = useQuery(["userQueryQuest", username], () =>
            axios.get(USER_QUEST_QUERY, { params: { username } })
        );
        return (
            <Component
                {...props}
                isFetchingUserQuests={isLoading}
                data={data?.data}
                queryError={error}
            />
        );
    };

function isNotDoneFirst(a, b) {
    return Number(a.isDone) - Number(b.isDone);
}
