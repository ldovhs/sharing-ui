import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Enums from "enums";

const USER_API = `${Enums.BASEPATH}/api/user/current`;
const ADD_USER_API = `${Enums.BASEPATH}/api/admin/user/add`;
//const USER_API = `/api/user/current`;
//const ADD_USER_API = `/api/admin/user/add`;

export const withUserUpsert =
    (Component) =>
    ({ ...props }) => {
        const { data, error, isError, isLoading, mutateAsync } = useMutation(
            "mutateUser",
            (user) => axios.post(ADD_USER_API, user),
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
