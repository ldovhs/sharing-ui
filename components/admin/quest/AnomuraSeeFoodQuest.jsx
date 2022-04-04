import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";

const AnomuraSeeFoodQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.ANOMURA_SUBMISSION_QUEST,
        extendedQuestData: quest?.extendedQuestData ?? { discordChannel: "" },
        text: quest?.text || "An app submission for #SUBMISSION",
        description: quest?.description ?? "Allow the user to upload their submission",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };
    const AnomuraSeeFoodQuestSchema = object().shape({
        extendedQuestData: object().shape({
            discordChannel: string().required("A Discord channel Id is required!"),
        }),
        text: string().required("Quest text is required"),
        completedText: string().required("Complete Text is required"),
        quantity: number().required().min(0), //optional
    });

    const onSubmit = async (fields, { setStatus }) => {
        // alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
        try {
            let res = await onUpsert(fields);

            if (res.data.isError) {
                setStatus(res.data.message);
            } else {
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (quest) {
        // console.log(quest);
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={AnomuraSeeFoodQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create an app submission</small>
                        <div className="row">
                            {/* Follow Twitter Account */}
                            <div className="col-xxl-12 col-xl-12 col-lg-12">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">
                                        Discord channel id (947009220262363136)
                                    </label>
                                    <Field
                                        name={`extendedQuestData.discordChannel`}
                                        type="text"
                                        className={
                                            "form-control" +
                                            (errors.extendedQuestData &&
                                            errors.extendedQuestData?.discordChannel &&
                                            touched.extendedQuestData?.discordChannel
                                                ? " is-invalid"
                                                : "")
                                        }
                                    />
                                    <ErrorMessage
                                        name={`extendedQuestData.discordChannel`}
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>
                            </div>
                            {/* Quest Text */}
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Quest Text</label>
                                <Field
                                    name="text"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.text && touched.text ? " is-invalid" : "")
                                    }
                                />
                                <ErrorMessage
                                    name="text"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Completed</label>
                                <Field
                                    name="completedText"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.completedText && touched.completedText
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="completedText"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            {/* Description */}
                            <div className="col-xxl-12 col-xl-12 col-lg-12 mb-3">
                                <label className="form-label">Description</label>
                                <Field
                                    name="description"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.description && touched.description
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="description"
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
                                        (errors.rewardTypeId && touched.rewardTypeId
                                            ? " is-invalid"
                                            : "")
                                    }
                                >
                                    {rewardTypes &&
                                        rewardTypes.map((type, index) => {
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
                            {/* Enabled  */}
                            <div className="col-6 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultChecked={values.isEnabled}
                                        name="isEnabled"
                                        onChange={handleChange}
                                    />
                                    Enabled
                                </div>
                            </div>
                            <div
                                className={`col-12 mb-3 text-red-500 ${
                                    status ? "d-block" : "d-none"
                                }`}
                            >
                                <label className="form-label">API error: {status}</label>
                            </div>

                            <div className="col-12 mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-success mr-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default withQuestUpsert(AnomuraSeeFoodQuest);
