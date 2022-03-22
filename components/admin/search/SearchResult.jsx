import React, { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

export default function SearchResults({ formData }) {
    const { data, error } = useSWR(["/api/admin/search", formData], fetcher);

    useEffect(() => {
        //console.log(data);
    }, [data]);

    if (error) {
        console.log(error);
        return <div>failed to load</div>;
    }
    if (!data) return <div>loading...</div>;

    return (
        <>
            <div className="card-header px-0">
                <h4 className=" mb-0">Result</h4> <small>Search Results: {data?.length}</small>
            </div>
            {data?.length > 0 && (
                <div className="card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive table-icon">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="col-2">User</th>
                                            <th className="col-4">Wallet</th>
                                            <th className="col-1">Twitter</th>
                                            <th className="col-2">Discord</th>
                                            <th className="col-3">Rewards</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data &&
                                            data.map((el, index) => {
                                                console.log(el);
                                                return (
                                                    <tr key={index}>
                                                        <td className="col-2">{el.userId}</td>
                                                        <td className="col-4">{el.wallet}</td>
                                                        <td className="col-1">{el.twitter}</td>
                                                        <td className="col-2">{el.discordId}</td>
                                                        <td className="col-3">
                                                            {el.rewards.map((reward, rIndex) => {
                                                                return (
                                                                    <span
                                                                        key={rIndex}
                                                                        className="text-blue-500"
                                                                    >
                                                                        {rIndex === 0
                                                                            ? `${reward.rewardType.reward} (${reward.tokens})`
                                                                            : `, ${reward.rewardType.reward} (${reward.tokens})`}
                                                                    </span>
                                                                );
                                                            })}
                                                            {/* <span>
                                                        <i className="ri-check-line text-success me-1"></i>
                                                    </span>
                                                    <span>
                                                        <i className="ri-close-line text-danger"></i>
                                                    </span> */}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
