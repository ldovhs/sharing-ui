import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";
import { withUserUpsert } from "shared/HOC/user";

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
    discordId: "",
    discordUserDiscriminator: "",
    twitterId: "",
    twitterUserName: "",
    wallet: "",
};

const UserSchema = object().shape({
    discordId: string(),
    twitterId: string(),
    twitterUserName: string(),
    discordUserDiscriminator: string(),
    wallet: string()
        .required()
        .test("valid address", "Wallet Address is not valid!", function () {
            if (utils.isAddress(this.parent.wallet)) return true;
            else return false;
        }),
});

const AddNewUser = ({ isLoading, mutationError, onUpsert, data }) => {
    const [avatar, setAvatar] = useState(null);

    useEffect(async () => {
        let ava = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(ava);
    }, []);

    const onSubmit = async (fields, { setStatus, resetForm }) => {
        try {
            let res = await onUpsert(fields);

            if (res.data.isError) {
                setStatus(res.data.message);
            } else {
                // toast later
                resetForm();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ errors, status, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    className="me-3 rounded-circle me-0 me-sm-3"
                                    src={avatar}
                                    width="55"
                                    height="55"
                                    alt=""
                                />
                                <div className="media-body">
                                    <h5 className="mb-0">Add new user</h5>
                                </div>
                            </div>
                        </div>

                        {/* Discord Input  */}
                        <div className="col-12 mb-3">
                            <div className="col col-sm-12 col-md-12 col-lg-6">
                                <label className="form-label">Discord Id:</label>
                                <Field
                                    name="discordId"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.discordId && touched.discordId ? " is-invalid" : "")
                                    }
                                />
                            </div>
                            <div className="col col-sm-12 col-md-12 col-lg-6">
                                <label className="form-label">Discord User Discriminator:</label>
                                <Field
                                    name="discordUserDiscriminator"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.discordUserDiscriminator &&
                                        touched.discordUserDiscriminator
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                            </div>
                        </div>
                        {/* Type of social media account  */}
                        {/* <div className="col-6 mb-3">
                            <label className="form-label">Type</label>
                            <Field name="type" as="select" className={"form-control"}>
                                <option value="Discord">Discord</option>
                            </Field>
                        </div> */}

                        {/* Twitter Input  */}
                        <div className="col-12 mb-3">
                            <div className="col col-sm-12 col-md-12 col-lg-6">
                                <label className="form-label">Twitter Id</label>
                                <Field
                                    name="twitterId"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.twitterId && touched.twitterId ? " is-invalid" : "")
                                    }
                                />
                            </div>
                            <div className="col col-sm-12 col-md-12 col-lg-6">
                                <label className="form-label">Twitter Username</label>
                                <Field
                                    name="twitterUserName"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.twitterUserName && touched.twitterUserName
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                            </div>
                        </div>
                        {/* Wallet */}
                        <div className="col-12 mb-3">
                            <label className="form-label">Wallet Address*</label>
                            <Field
                                name="wallet"
                                type="text"
                                className={
                                    "form-control" +
                                    (errors.wallet && touched.wallet ? " is-invalid" : "")
                                }
                            />
                        </div>

                        <div className="text-red-500"> {errors && errors.wallet}</div>
                        <div className="text-red-500"> {status && "API error:" + status}</div>
                        <div className="text-green-500 h6">
                            {data &&
                                data?.wallet &&
                                `User with wallet: ${data?.wallet} updated successfully.`}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary mr-2 w-100"
                            disabled={isLoading}
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default withUserUpsert(AddNewUser);
