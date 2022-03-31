import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosPost = (url, header = {}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [body, setBody] = useState("");

    const postData = async (body) => {
        console.log(1661);
        setError(null);
        setLoading(true);
        try {
            const { data: response } = await axios.post(url, body);
            setData(response);
        } catch (err) {
            console.error(err);
            setError(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        // if (body) {
        //     postData();
        // }
    }, []);

    return [
        {
            data,
            error,
            loading,
        },
        setBody,
        postData,
    ];
};

export default useAxiosPost;
