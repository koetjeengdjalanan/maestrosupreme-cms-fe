/* eslint-disable @next/next/no-img-element */
import { usePaginatedForm, useUpdateForm } from '@/hooks/form';
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
import { Paginator } from 'primereact/paginator';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';

function getParams() {
    null;
}

const FormEvent = () => {
    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' },
    ];

    const [dataViewValue, setDataViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [dateRanges, setDateRanges] = useState(null);
    const [lazyParams, setLazyParams] = useState(null);
    const [options, setOptions] = useState({});
    const [selectedForm, setSelectedForm] = useState({});
    const [paginateFirst, setPaginateFirst] = useState(0);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' },
    ];

    const newParams = useMemo(
        () => ({
            ...getParams(lazyParams),
        }),
        [lazyParams]
    );

    const { data: formList, isFetching } = usePaginatedForm({
        params: null,
        options,
    });
    // console.log(formList);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setDataViewValue(data));
        setGlobalFilterValue('');
    }, []);

    const onFilter = e => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter(product => {
                return product.name.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <div className="flex flex-row flex-grow-1 align-items-center gap-1">
                <label htmlFor="dateRange">Pick Date Ranges:</label>
                <Calendar
                    id="dateRage"
                    value={dateRanges}
                    onChange={e => setDateRanges(e.value)}
                    selectionMode="range"
                    readOnlyInput
                />
                <Button
                    icon="pi pi-times-circle"
                    className="p-button-rounded p-button-plain p-button-text"
                    aria-label="clear"
                    onClick={() => setDateRanges(null)}
                    visible={dateRanges !== null}
                />
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    onChange={onFilter}
                    placeholder="Search by Name"
                />
            </span>
        </div>
    );

    const itemTemplate = data => {
        if (!data) {
            return;
        }
        return (
            <DataViewTemplate
                data={data}
                onSelect={data => setSelectedForm(data)}
            />
        );
    };

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h1>Event Form List</h1>
                    <DataView
                        value={formList?.item ?? []}
                        layout="grid"
                        paginator
                        first={paginateFirst}
                        totalRecords={formList?.total}
                        rows={formList?.per_page ?? 9}
                        rowsPerPageOptions={[9, 15, 21, 27]}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        lazy={true}
                        // header={dataViewHeader}
                        loading={isFetching}
                    ></DataView>
                </div>
            </div>
        </div>
    );
};

function DataViewTemplate({ data, onSelect, onHide }) {
    const formRef = useRef(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [imageThumbnail, setImageThumbnail] = useState(
        data?.media[0]?.path ?? null
    );
    const [useExternalLinkImage, setExternalLinkImage] = useState(false);
    const { mutate } = useUpdateForm();
    const { data: session } = useSession();

    return (
        <>
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-user mr-2" />
                            <span className="font-semibold">
                                {data?.author?.name}
                            </span>
                        </div>
                        {/* <span
                        className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}
                    >
                        {data.inventoryStatus}
                    </span> */}
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
                                    setDialogVisible(true);
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
                                    session.user?.role[0] != 'Super Admin' ||
                                    session.user?.role[0] != 'Super Admin'
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
            <Formik
                initialValues={{
                    user_id: session.user?.id,
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
                    mutate(payload);
                }}
            >
                {({ values, setFieldValue, handleSubmit }) => (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <Dialog
                            draggable={false}
                            header="Edit Form / Event"
                            visible={dialogVisible}
                            style={{ width: '50vw' }}
                            onHide={() => {
                                setDialogVisible(false);
                            }}
                            footer={
                                <div>
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        onClick={() => setDialogVisible(false)}
                                        className="p-button-text p-button-danger"
                                    />
                                    <Button
                                        label="Submit"
                                        // type="submit"
                                        icon="pi pi-check"
                                        onClick={() =>
                                            formRef.current?.requestSubmit()
                                        }
                                        autoFocus
                                    />
                                </div>
                            }
                            dismissableMask
                        >
                            <div className="flex flex-column gap-4">
                                <div className="flex flex-row mt-5 gap-5">
                                    <div
                                        className={`flex-column justify-content-center ${
                                            imageThumbnail != null
                                                ? 'flex'
                                                : 'hidden'
                                        }`}
                                    >
                                        <img
                                            src={imageThumbnail}
                                            alt={data.name}
                                            className="max-h-20rem w-min"
                                        />
                                    </div>
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
                                                Image Link
                                            </label>
                                            <InputText
                                                id="path"
                                                name="path"
                                                value={imageThumbnail}
                                            />
                                        </div>
                                        <div
                                            className={`flex-column flex-grow-1 ${
                                                useExternalLinkImage
                                                    ? 'hidden'
                                                    : 'flex'
                                            }`}
                                        >
                                            <FileUpload
                                                name="demo[]"
                                                url={'/api/upload'}
                                                multiple
                                                accept="image/*"
                                                maxFileSize={1000000}
                                                emptyTemplate={
                                                    <p className="m-0">
                                                        Drag and drop files to
                                                        here to upload.
                                                    </p>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                            setFieldValue(
                                                'title',
                                                e.target.value
                                            )
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
                                            setFieldValue(
                                                'slug',
                                                e.target.value
                                            )
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
                                    <label
                                        htmlFor="description"
                                        className="mb-2"
                                    >
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
                                                        Number(
                                                            values.publish_date
                                                        )
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
                                                    new Date(
                                                        Number(values.expire)
                                                    )
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
                        </Dialog>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default FormEvent;
