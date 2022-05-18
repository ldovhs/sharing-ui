import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, date } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";

const TwitterSpaceQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {

    const initialValues = {
        type: Enums.TWITTER_SPACE_CODE_QUEST,
        extendedQuestData: quest?.extendedQuestData ?? { twitterSpaceCode: "Anomura", dateDeadline: "", timeDeadLine: "" },
        text: quest?.text || "Twitter Space Codes",
        description: quest?.description ?? "Allow users to enter codes we give on Twitter Spaces",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
        twitterCode: quest?.twitterCode || "Code"
    };
    const TwitterSpaceQuestSchema = object().shape({
        extendedQuestData: object().shape({
            twitterSpaceCode: string().required("Code for Twitter Space is required!!"),
            dateDeadline: string().required("Date deadline for code is required!!"),
            timeDeadline: string().required("Time deadline for code is required!!"),
        }),
        text: string().required("Quest text is required"),
        completedText: string().required("Complete Text is required"),
        quantity: number().required().min(0), //optional
    });

    const onSubmit = async (fields, { setStatus }) => {
        try {
            let res = await onUpsert(fields);

            if (res?.data?.isError) {
                setStatus(res.data.message);
            } else {
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={TwitterSpaceQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create a Twitter Space Code Input</small>
                        <div className="row">
                            {/* Discord channel for quest */}
                            <QuestFormTemplate
                                values={values}
                                errors={errors}
                                touched={touched}
                                onTextChange={(t) => setFieldValue("text", t)}
                                onCompletedTextChange={(c) => setFieldValue("completedText", c)}
                                onDescriptionChange={(d) => setFieldValue("description", d)}
                                onRewardTypeChange={(rt) => setFieldValue("rewardTypeId", rt)}
                                onRewardQuantityChange={(rq) => setFieldValue("quantity", rq)}
                                onIsEnabledChange={handleChange}
                                rewardTypes={rewardTypes}
                            />
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Twitter Space Code</label>
                                <Field
                                    name="extendedQuestData.twitterSpaceCode"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                            errors?.extendedQuestData.twitterSpaceCode
                                            ? " is-invalid"
                                            : "")
                                    }

                                />
                                <ErrorMessage name="extendedQuestData.twitterSpaceCode" component="div" className="invalid-feedback" />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Time Deadline</label>
                                <Field
                                    name="extendedQuestData.timeDeadline"
                                    type="time"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                            errors?.extendedQuestData.timeDeadline
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage name="extendedQuestData.timeDeadline" component="div" className="invalid-feedback" />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Date Deadline</label>
                                <Field
                                    name="extendedQuestData.dateDeadline"
                                    type="date"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                            errors?.extendedQuestData.dateDeadline
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage name="extendedQuestData.dateDeadline" component="div" className="invalid-feedback" />
                            </div>
                            <div
                                className={`col-12 mb-3 text-red-500 ${status ? "d-block" : "d-none"
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

export default withQuestUpsert(TwitterSpaceQuest);
