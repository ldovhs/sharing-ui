import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

const ADMIN_SEARCH = "/challenger/api/admin/search";

export default function SearchResults({ formData }) {
    const { data, error } = useSWR([ADMIN_SEARCH, formData], fetcher);
    const [csvData, setCsvData] = useState(null);

    useEffect(async () => {
        if (data) {
            let csv = await BuildCsv(data);
            setCsvData(csv);
        }
    }, [data]);

    if (error) {
        return <div>{error}</div>;
    }
    if (!data) return <div>loading...</div>;

    return (
        <>
            <div className="card-header px-0">
                <h4 className=" mb-0">Result</h4>
                <div className="d-flex ">
                    {csvData && (
                        <a
                            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
                            download={`Search - ${new Date().toISOString()}.csv`}
                            className="mr-2"
                        >
                            Export as CSV
                        </a>
                    )}
                    <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(data)
                        )}`}
                        download={`Search - ${new Date().toISOString()}.json`}
                        className="mr-2"
                    >
                        Export as Json
                    </a>
                    <div className="text-green-600 font-bold">Search Results: {data?.length}</div>
                </div>
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
                                                return (
                                                    <tr key={index}>
                                                        <td className="col-2">{el.userId}</td>
                                                        <td className="col-4">{el.wallet}</td>
                                                        <td className="col-2">
                                                            {el.twitterUserName}
                                                        </td>
                                                        <td className="col-2">
                                                            {el.discordUserDiscriminator}
                                                        </td>
                                                        <td className="col-2">
                                                            {el.rewards.map((reward, rIndex) => {
                                                                return (
                                                                    <span
                                                                        key={rIndex}
                                                                        className="text-blue-500"
                                                                    >
                                                                        {rIndex === 0
                                                                            ? `${reward.rewardType.reward} (${reward.quantity})`
                                                                            : `, ${reward.rewardType.reward} (${reward.quantity})`}
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

const BuildCsv = async (data) => {
    //console.log(data);
    const csvString = [
        [
            "UserID",
            "Wallet",
            "Twitter Id",
            "TwitterUserName",
            "Discord User Discriminator",
            "Discord Id",

            "Rewards",
        ],
        ...data.map((item) => [
            item.userId,
            item.wallet,
            item.twitterId,
            item.twitterUserName,
            getDiscordUserDiscriminator(item.discordUserDiscriminator),
            item.discorId,

            flattenRewards(item.rewards),
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};

const flattenRewards = (rewards) => {
    let res = "";
    rewards.map((r) => {
        res = res + ` ${r.rewardType.reward}(${r.quantity}),`;
    });
    return res;
};

const getDiscordUserDiscriminator = (discordUserDiscriminator) => {
    if (discordUserDiscriminator === null) {
        return "";
    }
    let str = discordUserDiscriminator.split("#");
    return str[0] + "#" + str[1];
    //return str[0] + str[1];
};
