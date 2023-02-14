import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TreeSelect } from 'primereact/treeselect';
import { useMemo, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import { useUploadImage } from '@/hooks/useUploadImage';
import { FileUploader } from '../BaseInput';
import { Avatar } from 'primereact/avatar';

export function ReviewInput(props) {
    const { data, onUpdate, sectionId } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    const reviews = useMemo(
        () => data?.content?.reviews?.filter(val => !!val) ?? [],
        [data]
    );

    const handleAddReview = values => {
        setIsLoading(true);
        const content = {
            body: '',
            reviews: [...reviews, values],
        };
        const payload = {
            ...data,
            section: sectionId,
            content: JSON.stringify(content),
        };
        onUpdate(payload, {
            onSuccess: () => {
                setIsCreate(false);
                setIsLoading(true);
            },
        });
    };

    return (
        <div className="p-3">
            <div className="flex justify-content-end mb-3">
                <Button
                    label="Add review"
                    icon="pi pi-plus"
                    onClick={() => setIsCreate(true)}
                />
            </div>
            <div className="grid">
                {reviews.length > 0 ? (
                    reviews.map((review, i) => (
                        <div className="col-12 mb-2 md:col-6" key={i}>
                            <div className="card">
                                <p className="m-0 text-center mb-5">
                                    &ldquo;{review.message}&rdquo;
                                </p>
                                <div className="flex align-items-center justify-content-center">
                                    <Avatar
                                        image={review.avatar}
                                        className="flex align-items-center justify-content-center mr-2"
                                        size="xlarge"
                                        shape="circle"
                                    />
                                    <div className="ml-2">
                                        <p className="vertical-align-middle m-0 font-bold text-lg">
                                            {review.name}
                                        </p>
                                        <p className="vertical-align-middle m-0">
                                            {review.job}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 mb-2 ">
                        <div className="card">
                            <p className="m-0 text-center">no reviews yet</p>
                        </div>
                    </div>
                )}
            </div>
            <ModalAddReview
                visible={isCreate}
                onHide={() => {
                    setIsCreate(false);
                }}
                onSubmit={handleAddReview}
                isLoading={isLoading}
            />
        </div>
    );
}

function ModalAddReview({ visible, onHide, onSubmit, isLoading }) {
    return (
        <Dialog
            visible={visible}
            header="Create Review"
            style={{ maxWidth: '500px' }}
            onHide={onHide}
        >
            <Formik
                initialValues={{
                    name: '',
                    job: '',
                    message: '',
                    avatar: '',
                }}
                onSubmit={(e, action) => {
                    onSubmit(e);
                    // try {
                    //     createUser(e);
                    //     onHide();
                    // } catch (error) {
                    //     console.log(error);
                    // }
                    // action.resetForm();
                }}
            >
                {({ values, setFieldValue, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="formgrid grid mb-3">
                            <div className="field col-12">
                                <label
                                    htmlFor="client-name"
                                    className="block text-900 font-medium mb-2"
                                >
                                    Client Name
                                </label>
                                <InputText
                                    id="client-name"
                                    value={values.name}
                                    onChange={e =>
                                        setFieldValue('name', e.target.value)
                                    }
                                    type="text"
                                    placeholder="Client Name"
                                    className="w-full mb-3"
                                />
                            </div>
                            <div className="field col-12">
                                <label
                                    htmlFor="client-job"
                                    className="block text-900 font-medium mb-2"
                                >
                                    Client Job
                                </label>
                                <InputText
                                    id="client-job"
                                    value={values.job}
                                    onChange={e =>
                                        setFieldValue('job', e.target.value)
                                    }
                                    type="text"
                                    placeholder="Client Job"
                                    className="w-full mb-3"
                                />
                            </div>
                            <div className="field col-12">
                                <label
                                    htmlFor="message"
                                    className="block text-900 font-medium mb-2"
                                >
                                    Message
                                </label>
                                <InputTextarea
                                    id="message"
                                    type="text"
                                    value={values.message}
                                    onChange={e =>
                                        setFieldValue('message', e.target.value)
                                    }
                                    rows={5}
                                    placeholder="Client Message"
                                    className="w-full mb-3"
                                />
                            </div>
                            <div className="field col-12">
                                <label
                                    htmlFor="avatar"
                                    className="block text-900 font-medium mb-2"
                                >
                                    Client Photo
                                </label>
                                <FileUploader
                                    isEdit
                                    defaultValue={values?.avatar}
                                    onUpload={e => {
                                        setFieldValue('avatar', e);
                                    }}
                                />
                            </div>
                        </div>
                        <Button
                            label="Submit"
                            className="w-full"
                            type="submit"
                            loading={isLoading}
                        />
                    </form>
                )}
            </Formik>
        </Dialog>
    );
}

export default ReviewInput;
