import { useQuery, useMutation } from "react-query";
import axios from "axios";

const USER_API = "/api/user";

export const withUserUpsert =
    (Component) =>
    ({ ...props }) => {
        const { data, error, isError, isLoading, mutateAsync } = useMutation(
            "mutateUser",
            (user) => axios.post(USER_API, user),
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
            axios.get(USER_API)
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
