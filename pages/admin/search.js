import Multiselect from "@components/admin/MultiSelect";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin/ComponentIndex";
import s from "/sass/admin/admin.module.css";

const rewardItems = ["Mystery Bowl", "Nude", "Bored Ape", "MintList"];

const AdminSearch = () => {
    const [formData, setFormData] = useState({
        walletId: "",
        userId: "",
        twitter: "",
        discord: "",
        rewards: {},
        tokens: {
            from: 0,
            to: 0,
        },
    });
    useEffect(() => {}, []);

    const onFormInputChange = (e) => {
        const { name, value } = e.target;

        if (e.target.type === "checkbox" && e.target.name == "rewards") {
            value = e.target.checked;

            setFormData((prevState) => {
                return {
                    ...prevState,
                    rewards: {
                        ...prevState.rewards,
                        [name]: value,
                    },
                };
            });
            return;
        }

        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const onSubmit = () => {
        console.log(formData);
    };
    return (
        <>
            <div className={`${s.search_zone} py-10 px-10`}>
                <div className={`${s.search_container} bg-white p-10 md:w-3/4 lg:w-11/12 mx-auto`}>
                    <div className={s.search_form}>
                        <div className={`${s.search_form_item}`}>
                            <label for="wallet" className="w-20 mr-6 text-right font-bold">
                                Wallet:
                            </label>
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="text"
                                id="wallet"
                                name="wallet"
                                placeholder="Wallet Id"
                                onChange={onFormInputChange}
                            />
                        </div>

                        <div className={`${s.search_form_item}`}>
                            <label for="user" className="w-20 mr-6 text-right font-bold">
                                User:
                            </label>
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="text"
                                id="userId"
                                name="userId"
                                placeholder="userId (uuid auto)"
                            />
                        </div>

                        <div className={`${s.search_form_item}`}>
                            <label for="twitter" className="w-20 mr-6 text-right font-bold">
                                Twitter:
                            </label>
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="text"
                                id="twitter"
                                name="twitter"
                                placeholder="twitterid"
                            />
                        </div>

                        <div className={`${s.search_form_item}`}>
                            <label for="discord" className="w-20 mr-6 text-right font-bold">
                                Discord:
                            </label>
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="text"
                                id="discord"
                                name="discord"
                                placeholder="discordid"
                            />
                        </div>
                        <div className={`${s.search_form_item}`}>
                            <label for="rewards" className="w-20 mr-6 text-right font-bold">
                                Rewards:
                            </label>
                            <div className="w-full">
                                <Multiselect
                                    items={rewardItems}
                                    onSetSelectedItems={onFormInputChange}
                                />
                                {/* <div className="flex mb-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="checkbox-1"
                                            aria-describedby="checkbox-1"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            for="shipping-2"
                                            className="font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            Free shipping via Flowbite
                                        </label>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className={`${s.search_form_item}`}>
                            <label for="tokens" className="w-20 mr-6 text-right font-bold">
                                Tokens:
                            </label>
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="number"
                                id="tokenFrom"
                                name="tokenFrom"
                                placeholder="0"
                            />
                            -
                            <input
                                className="flex-2/3 text-gray-600 placeholder-gray-400 border-2 border-gray-400"
                                type="number"
                                id="tokenTo"
                                name="tokenTo"
                                placeholder="1000"
                            />
                        </div>
                        <div>
                            <button
                                onClick={onSubmit}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
AdminSearch.Layout = AdminLayout;

export default AdminSearch;
