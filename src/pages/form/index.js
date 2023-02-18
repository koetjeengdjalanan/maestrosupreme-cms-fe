/* eslint-disable @next/next/no-img-element */
import { FileUploader } from '@/components/Input/BaseInput';
import { useCreateForm, usePaginatedForm, useUpdateForm } from '@/hooks/form';
import { useAssignMedia } from '@/hooks/form/useAssignFormMedia';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useMemo, useRef, useState } from 'react';

const PER_PAGE = 9;
const PAGE = 1;

const DATA_VIEW_OPTIONS = {
    first: 0,
    rows: PER_PAGE,
    page: PAGE - 1,
};

const FormEvent = () => {
    const [options, setOptions] = useState(DATA_VIEW_OPTIONS);
    const [isModalFormOpen, setIsModalFormOpen] = useState(false);
    const [selectedData, setSelectedForm] = useState({});

    const params = useMemo(
        () => ({
            perPage: options.rows,
            page: options.page + 1,
        }),
        [options]
    );

    const { data: formList, isFetching } = usePaginatedForm({
        params,
        // options,
    });

    const onPageChange = e => {
        setOptions(e);
    };

    const onSelect = data => {
        setSelectedForm(data);
    };

    const handleOpenModalForm = () => {
        setIsModalFormOpen(true);
    };

    const onClose = () => {
        setIsModalFormOpen(false);
        setSelectedForm(null);
    };

    const itemTemplate = data => {
        if (!data) {
            return;
        }
        return (
            <DataViewTemplate
                data={data}
                onSelect={onSelect}
                handleModalFormOpen={handleOpenModalForm}
            />
        );
    };

    return (
        <>
            <div className="grid list-demo">
                <div className="col-12">
                    <div className="card">
                        <div className="flex align-items-center justify-content-between flex-wrap">
                            <h1>Event Form List</h1>
                            <Button
                                icon="pi pi-plus"
                                label="Add new"
                                onClick={handleOpenModalForm}
                            />
                        </div>
                        <DataView
                            value={formList?.item ?? []}
                            layout="grid"
                            paginator
                            first={options.first}
                            totalRecords={formList?.total}
                            rows={options.rows}
                            rowsPerPageOptions={[9, 15, 21, 27]}
                            onPage={onPageChange}
                            itemTemplate={itemTemplate}
                            lazy={true}
                            loading={isFetching}
                        />
                    </div>
                </div>
            </div>
            <ModalForm
                data={selectedData}
                isOpen={isModalFormOpen}
                onClose={onClose}
            />
        </>
    );
};

function DataViewTemplate({ data, onSelect, handleModalFormOpen }) {
    const { data: session } = useSession();
    return (
        <>
            <div className="col-12 md:col-6 xl:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-user mr-2" />
                            <span className="font-semibold">
                                {data?.author?.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img
                            src={data?.media[0]?.path}
                            alt={data.name}
                            className="w-9 shadow-2 my-3 mx-0"
                        />
                        <div className="text-2xl font-bold mb-2">
                            {data?.title}
                        </div>
                        <div className="mb-3">{data.excerpt}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <p>
                            Publish Date: <br />
                            <span className="text-2xl font-bold">
                                {dayjs(Number(data?.publish_date)).format(
                                    'DD-MM-YY'
                                )}
                            </span>
                        </p>
                        <span className="p-buttonset flex">
                            <Button
                                className="p-button-info"
                                icon="pi pi-eye"
                                tooltip="View Form"
                                onClick={() => {
                                    window.open(data?.slug, '_blank');
                                }}
                                tooltipOptions={{
                                    position: 'bottom',
                                    mouseTrack: true,
                                    mouseTrackTop: 15,
                                }}
                            />
                            <Button
                                className="p-button-success"
                                icon="pi pi-pencil"
                                tooltip="Edit"
                                onClick={() => {
                                    handleModalFormOpen();
                                    onSelect(data);
                                }}
                                tooltipOptions={{
                                    position: 'bottom',
                                    mouseTrack: true,
                                    mouseTrackTop: 15,
                                }}
                            />
                            <Button
                                className={`p-button-danger ${
                                    session?.user?.role[0] != 'Super Admin' ||
                                    session?.user?.role[0] != 'Super Admin'
                                        ? 'hidden'
                                        : ''
                                }`}
                                icon="pi pi-trash"
                                tooltip="Delete"
                                tooltipOptions={{
                                    position: 'bottom',
                                    mouseTrack: true,
                                    mouseTrackTop: 15,
                                }}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

const ModalForm = ({ data, isOpen, onClose }) => {
    const { data: session } = useSession();
    const formRef = useRef(null);

    const [imageUrl, setImageUrl] = useState(
        Array.isArray(data?.media) ? data?.media[0]?.path : ''
    );
    const [externalImageUrl, setExternalImageUrl] = useState('');

    const [useExternalLinkImage, setExternalLinkImage] = useState(false);
    const { mutate: createForm, isLoading: creating } = useCreateForm();
    const { mutate: updateForm, updating } = useUpdateForm();
    const { mutate: assignMedia } = useAssignMedia();

    const onUploadImage = newUrl => {
        assignMedia(
            {
                path: path,
                form_id: data?.id,
            },
            {
                onSuccess() {
                    setImageUrl(newUrl);
                },
            }
        );
    };

    return (
        <Dialog
            draggable={false}
            header="Edit Form / Event"
            visible={isOpen}
            style={{ width: '50vw' }}
            onHide={onClose}
            footer={
                <div>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={onClose}
                        className="p-button-text p-button-danger"
                    />
                    <Button
                        label="Submit"
                        // type="submit"
                        icon="pi pi-check"
                        loading={updating || creating}
                        onClick={() => formRef.current?.requestSubmit()}
                        autoFocus
                    />
                </div>
            }
            dismissableMask
        >
            <Formik
                initialValues={{
                    user_id: session?.user?.id ?? '',
                    id: data?.id,
                    title: data?.title,
                    slug: data?.slug,
                    blog_url: data?.blog_url,
                    excerpt: data?.excerpt,
                    description: data?.description,
                    publish_date: data?.publish_date,
                    expire: data?.expire,
                }}
                onSubmit={e => {
                    const expireDate = Math.floor(e.expire / 1000);
                    const publishDate = Math.floor(e.publish_date / 1000);
                    const payload = {
                        ...e,
                        expire: expireDate,
                        publish_date: publishDate,
                    };
                    if (e.id) {
                        updateForm(payload, {
                            onSuccess: () => {
                                onClose();
                            },
                        });
                        return;
                    }
                    createForm(payload, {
                        onSuccess: () => {
                            onClose();
                        },
                    });
                }}
            >
                {({ values, setFieldValue, handleSubmit }) => (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-4">
                            {values?.id && (
                                <div className="flex flex-column mt-5 gap-5">
                                    <div className="flex flex-column flex-grow-1">
                                        <div className="flex flex-row justify-content-end align-items-center mb-3 gap-3">
                                            <label htmlFor="externalLink">
                                                Use External Link?
                                            </label>
                                            <InputSwitch
                                                id="externalLink"
                                                name="externalLink"
                                                checked={useExternalLinkImage}
                                                onChange={e =>
                                                    setExternalLinkImage(
                                                        e.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={`flex-column flex-grow-1 ${
                                                !useExternalLinkImage
                                                    ? 'hidden'
                                                    : 'flex'
                                            }`}
                                        >
                                            <label
                                                htmlFor="path"
                                                className="mb-2"
                                            >
                                                Image Url
                                            </label>
                                            <InputText
                                                id="path"
                                                name="path"
                                                value={externalImageUrl ?? ''}
                                                onChange={e =>
                                                    setExternalImageUrl(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={`flex-column flex-grow-1 ${
                                                useExternalLinkImage
                                                    ? 'hidden'
                                                    : 'flex'
                                            }`}
                                        >
                                            <FileUploader
                                                isEdit
                                                defaultValue={imageUrl}
                                                onUpload={onUploadImage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-column">
                                <label htmlFor="title" className="mb-2">
                                    Title
                                </label>
                                <InputText
                                    id="title"
                                    name="title"
                                    placeholder="Form Title"
                                    className="p-inputtext-md w-full h-full"
                                    value={values.title}
                                    onChange={e =>
                                        setFieldValue('title', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="slug" className="mb-2">
                                    Survey Link
                                </label>
                                <InputText
                                    id="slug"
                                    name="slug"
                                    placeholder="Lime Survey Link"
                                    className="p-inputtext-md w-full h-full"
                                    value={values.slug}
                                    onChange={e =>
                                        setFieldValue('slug', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="blog_url" className="mb-2">
                                    External URL
                                </label>
                                <InputText
                                    id="blog_url"
                                    name="blog_url"
                                    placeholder="Related BlogPost or Other External URL"
                                    className="p-inputtext-md w-full h-full"
                                    value={values.blog_url}
                                    onChange={e =>
                                        setFieldValue(
                                            'blog_url',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="excerpt" className="mb-2">
                                    Excerpt (Short Description)
                                </label>
                                <InputText
                                    disabled
                                    id="excerpt"
                                    name="excerpt"
                                    placeholder="Auto Generated From Description"
                                    className="p-inputtext-md w-full h-full"
                                    value={values.excerpt}
                                />
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="description" className="mb-2">
                                    Description
                                </label>
                                <InputTextarea
                                    autoResize
                                    id="description"
                                    name="description"
                                    placeholder="Event / Form Description"
                                    className="p-inputtext-md w-full"
                                    rows={5}
                                    value={values.description}
                                    onChange={e => {
                                        setFieldValue(
                                            'description',
                                            e.target.value
                                        );
                                        setFieldValue(
                                            'excerpt',
                                            e.target.value.slice(0, 75)
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex flex-column">
                                <div className="flex flex-row justify-content-between flex-wrap gap-4">
                                    <div className="flex flex-column flex-grow-1">
                                        <label
                                            htmlFor="publish_date"
                                            className="mb-2"
                                        >
                                            Publish Date
                                        </label>
                                        <Calendar
                                            showIcon
                                            showButtonBar
                                            id="publish_date"
                                            name="publish_date"
                                            value={
                                                new Date(
                                                    Number(values.publish_date)
                                                )
                                            }
                                            onChange={e =>
                                                setFieldValue(
                                                    'publish_date',
                                                    Number(
                                                        new Date(
                                                            e.value
                                                        ).getTime()
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-column flex-grow-1">
                                        <label
                                            htmlFor="expire"
                                            className="mb-2"
                                        >
                                            Expire Date
                                        </label>
                                        <Calendar
                                            showIcon
                                            showButtonBar
                                            id="expire"
                                            name="expire"
                                            value={
                                                new Date(Number(values.expire))
                                            }
                                            onChange={e =>
                                                setFieldValue(
                                                    'expire',
                                                    Number(
                                                        new Date(
                                                            e.value
                                                        ).getTime()
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};
export default FormEvent;
