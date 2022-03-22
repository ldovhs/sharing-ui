import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";
import axios from "axios";
import useSWR from "swr";

const avatars = [
    "/img/sharing-ui/invite/ava1.png",
    "/img/sharing-ui/invite/ava2.png",
    "/img/sharing-ui/invite/ava3.png",
    "/img/sharing-ui/invite/ava4.png",
    "/img/sharing-ui/invite/ava5.png",
    "/img/sharing-ui/invite/ava6.png",
    "/img/sharing-ui/invite/ava7.png",
    "/img/sharing-ui/invite/ava8.png",
];

const initialValues = {
    username: "",
    type: "Discord",
    wallet: "",
    rewardTypeId: 1,
    quantity: 1,
    showInDiscord: false,
    generatedURL: "",
};

const RewardSchema = object().shape({
    username: string().required(),
    wallet: string().required(),
    quantity: number().required().min(1),
});

const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

const AddNewReward = () => {
    const [rewardTypes, setRewardTypes] = useState([]);
    const generatedRef = React.createRef();

    useEffect(async () => {
        const res = await axios.get("/api/admin/rewardType");
        if (res) {
            setRewardTypes(res.data);
        }
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={RewardSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setErrors }) => {
                alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));

                const res = await axios.post("/api/admin/pendingReward", fields);
                if (res.data?.isError) {
                    setErrors({
                        username: res.data?.message,
                    });
                } else {
                    console.log(res.data.generatedURL);
                    generatedRef.current.value = res.data.generatedURL;
                }
            }}
        >
            {({ errors, status, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    className="me-3 rounded-circle me-0 me-sm-3"
                                    src={avatars[Math.floor(Math.random() * avatars.length)]}
                                    width="55"
                                    height="55"
                                    alt=""
                                />
                                <div className="media-body">
                                    <h5 className="mb-0">Add a new reward</h5>
                                </div>
                            </div>
                        </div>

                        {/* Username Input  */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Username</label>
                            <Field
                                name="username"
                                type="text"
                                className={
                                    "form-control" +
                                    (errors.size && touched.size ? " is-invalid" : "")
                                }
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="invalid-feedback"
                            />
                        </div>

                        {/* Type of social media account  */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Type</label>
                            <Field name="type" as="select" className={"form-control"}>
                                <option value="Discord">Discord</option>
                                <option value="Twitter">Twitter</option>
                            </Field>
                        </div>

                        {/* Wallet  */}
                        <div className="col-12 mb-3">
                            <label className="form-label">Wallet Address</label>
                            <Field
                                name="wallet"
                                type="text"
                                className={
                                    "form-control" +
                                    (errors.wallet && touched.wallet ? " is-invalid" : "")
                                }
                            />
                            <ErrorMessage
                                name="wallet"
                                component="div"
                                className="invalid-feedback"
                            />
                        </div>

                        {/* Type of Reward */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Reward Type</label>
                            <Field
                                name="rewardTypeId"
                                as="select"
                                className={
                                    "form-control" +
                                    (errors.price && touched.price ? " is-invalid" : "")
                                }
                            >
                                {rewardTypes &&
                                    rewardTypes.map((type, index) => {
                                        console.log(type);
                                        return (
                                            <option key={index} value={type.id}>
                                                {type.reward}
                                            </option>
                                        );
                                    })}
                            </Field>
                        </div>

                        {/* Reward quantity  */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Quantity</label>
                            <Field
                                name="quantity"
                                type="number"
                                className={
                                    "form-control" +
                                    (errors.quantity && touched.quantity ? " is-invalid" : "")
                                }
                            />
                            <ErrorMessage
                                name="quantity"
                                component="div"
                                className="invalid-feedback"
                            />
                        </div>

                        {/* URL to claim */}
                        <div className="col-12 mb-3">
                            <label className="form-label">Generated URL</label>
                            <input
                                name="generatedURL"
                                type="text"
                                className={"form-control"}
                                disabled={true}
                                ref={generatedRef}
                            />
                        </div>

                        {/* Post on discord server */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Show in Discord</label>

                            <Field name="showInDiscord" as="select" className={"form-control"}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </Field>
                        </div>

                        {errors && <div className="text-red-500"> {errors.username}</div>}
                    </div>

                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary mr-2 w-100">
                            Submit
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
export default AddNewReward;
