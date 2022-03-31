import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";

export const withQuestUpsert =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "mutateQuest",
            (quest) => axios.post("/api/admin/quest/upsert", quest),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("queryQuest");
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

export const withQuestQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, error, status, isLoading } = useQuery("queryQuest", () =>
            axios.get("/api/admin/quest/")
        );

        return <Component {...props} isLoading={isLoading} quests={data?.data} error={error} />;
    };
