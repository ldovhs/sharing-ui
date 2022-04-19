import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";

export const withUserUpsert =
    (Component) =>
    ({ ...props }) => {
        const queryClient = useQueryClient();
        const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
            "mutateUser",
            (quest) => axios.post("/api/user", quest),
            {
                onSuccess: () => {},
            }
        );
        const handleOnUpsert = async (user) => {
            return await mutateAsync(user);
        };
        return (
            <Component
                {...props}
                isLoading={isLoading}
                mutationError={error}
                data={data?.data}
                onUpsert={(user) => handleOnUpsert(user)}
            />
        );
    };

export const withCurrentUserQuery =
    (Component) =>
    ({ ...props }) => {
        const { data, status, isLoading, error } = useQuery("currentUser", () =>
            axios.get("/api/user/current")
        );

        return (
            <Component
                {...props}
                isFetchingUser={isLoading}
                currentUser={data?.data}
                queryError={error}
            />
        );
    };
