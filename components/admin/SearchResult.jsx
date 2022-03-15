import React, { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { RLP } from "ethers/lib/utils";

const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

export default function SearchResults({ formData }) {
    const { data, error } = useSWR(["/api/admin/search", formData], fetcher);

    useEffect(() => {
        //console.log(data);
    }, [data]);

    const renderTableRows = () => {
        return data.map((el, index) => {
            console.log(el);
            return (
                <tr key={index}>
                    <td>{el.userId}</td>
                    <td>{el.wallet}</td>
                    <td>{el.twitter}</td>
                    <td>{el.discordID}</td>
                    <td>
                        <span>
                            <i className="ri-check-line text-success me-1"></i>
                        </span>
                        <span>
                            <i className="ri-close-line text-danger"></i>
                        </span>
                    </td>
                </tr>
            );
        });
    };
    if (error) {
        console.log(error);
        return <div>failed to load</div>;
    }
    if (!data) return <div>loading...</div>;

    return (
        <>
            <div class="card-header px-0">
                <h4 class=" mb-0">Result</h4> <small>Search Results: 00000</small>
            </div>

            <div className="card">
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive table-icon">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Wallet</th>
                                        <th>Twitter</th>
                                        <th>Discord</th>
                                        <th>Rewards</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {data && renderTableRows} */}
                                    {data &&
                                        data.map((el, index) => {
                                            // console.log(el);
                                            return (
                                                <tr key={index}>
                                                    <td>{el.userId}</td>
                                                    <td>{el.wallet}</td>
                                                    <td>{el.twitter}</td>
                                                    <td>{el.discordID}</td>
                                                    <td>
                                                        {el.rewards.map((reward, rIndex) => {
                                                            return (
                                                                <span
                                                                    key={rIndex}
                                                                    className="text-blue-500"
                                                                >
                                                                    {rIndex === 0
                                                                        ? reward.type
                                                                        : `, ${reward.type}`}
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
        </>
    );
}

{
    /* <div className="card-body">
                <div className="row">
                 <div className="card-header px-0">
                      <h4 className="mb-0">Results</h4>

               
</div> */
}
