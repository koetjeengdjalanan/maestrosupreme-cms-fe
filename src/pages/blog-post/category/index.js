import { TextInput } from '@/components/Input/BaseInput';
import {
    useCategories,
    useCreateCategory,
    useDeleteCategory,
} from '@/hooks/category';
import { dateTimeFormat } from '@/utils/format';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

const CategoriesTable = () => {
    const { data: categories, isLoading } = useCategories({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    const toast = useRef(null);

    const { mutate: deleteCategory, isLoading: deleting } = useDeleteCategory();
    const { mutate: createCategory, isLoading: creating } = useCreateCategory();

    const handleCreate = () => {
        setIsCreate(true);
    };

    const onClose = () => {
        setIsCreate(false);
        setSelectedCategory(null);
        setIsDelete(false);
    };

    const onCreate = values => {
        // if (e.id) {
        //     updateForm(payload, {
        //         onSuccess: () => {
        //             if (
        //                 inputImageUrl &&
        //                 inputImageUrl !== defaultImageUrl
        //             )
        //                 assignMedia({
        //                     path: inputImageUrl,
        //                     form_id: e.id,
        //                 });
        //             onClose();
        //         },
        //     });
        //     return;
        // }
        createCategory(values, {
            onSuccess: () => {
                onClose();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Post was created',
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Oops, something wrong!!!',
                    life: 3000,
                });
            },
        });
    };

    const onDelete = () => {
        deleteCategory(selectedCategory?.id, {
            onSuccess: () => {
                onClose();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Post was deleted',
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Oops, something wrong!!!',
                    life: 3000,
                });
            },
        });
    };

    const actionsTemplate = rowData => {
        return (
            <div className="flex align-items-center gap-3">
                {/* <Button
                    className="p-button-success"
                    icon="pi pi-pencil"
                    // onClick={handleCreate}
                /> */}
                <Button
                    className="p-button-danger"
                    icon="pi pi-trash"
                    onClick={() => {
                        setSelectedCategory(rowData);
                        setIsDelete(true);
                    }}
                />
            </div>
        );
    };

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between flex-wrap mb-5">
                            <h1 className="m-0">Category List</h1>
                            <div className="flex justify-content-end gap-3">
                                <Button
                                    label="Add New Category"
                                    icon="pi pi-fw pi-plus-circle"
                                    onClick={handleCreate}
                                    className="p-button-raised p-button-success"
                                />
                            </div>
                        </div>
                        <DataTable
                            value={categories?.data}
                            totalRecords={categories?.total}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="id"
                            filterDisplay="menu"
                            loading={isLoading}
                            responsiveLayout="scroll"
                            emptyMessage="No categories found."
                        >
                            <Column
                                field="title"
                                header="Name"
                                filter
                                filterPlaceholder="Search by name"
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                header="Created at"
                                sortable
                                style={{ minWidth: '12rem' }}
                                body={data =>
                                    dateTimeFormat(data.created_at ?? 0)
                                }
                            />
                            <Column
                                field="author.name"
                                header="Author"
                                sortable
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                header="Action"
                                body={actionsTemplate}
                                exportable={false}
                                style={{ minWidth: '8rem' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            <ModalDeleteCategory
                visible={isDelete}
                onHide={onClose}
                onDelete={onDelete}
                isLoading={deleting}
            />
            <ModalCreate
                // data={sele}
                isOpen={isCreate}
                onClose={onClose}
                onSubmit={onCreate}
                isLoading={creating}
            />
            <Toast ref={toast} />
        </>
    );
};

export default CategoriesTable;

function ModalDeleteCategory({ visible, onHide, onDelete, isLoading }) {
    return (
        <Dialog
            header="Delete Post"
            visible={visible}
            onHide={onHide}
            closable
            draggable={false}
            closeOnEscape
            footer={
                <div className="flex justify-content-end gap-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={onHide}
                        className="p-button-text"
                        autoFocus
                        disabled={isLoading}
                    />

                    <Button
                        className="p-button-danger"
                        label="Delete"
                        icon="pi pi-trash"
                        onClick={() => onDelete()}
                        loading={isLoading}
                    />
                </div>
            }
        >
            <p className="m-0">
                Are you sure you want to delete this category?
            </p>
        </Dialog>
    );
}

function ModalCreate({ data, isOpen, onClose, onSubmit, isLoading }) {
    const { data: session } = useSession();
    const formRef = useRef(null);

    return (
        <Dialog
            draggable={false}
            header={`${data?.id ? 'Edit' : 'Create'} Category`}
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
                        loading={isLoading}
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
                    title: data?.title ?? '',
                    slug: data?.slug ?? '',
                }}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, touched, errors }) => (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-4">
                            <TextInput
                                id="Title"
                                name="title"
                                placeholder="Category Title"
                                className="flex-grow-1"
                                label="Title"
                                errors={errors}
                                value={values.title}
                                touched={touched}
                                onChange={e => {
                                    setFieldValue('title', e.target.value);

                                    // set slug values
                                    const slug = e.target.value
                                        .toLowerCase()
                                        .replace(/^-+/, '')
                                        .replace(/-+$/, '')
                                        .replace(/\s+/g, '-')
                                        .replace(/\-\-+/g, '-')
                                        .replace(/[^\w\-]+/g, '');
                                    setFieldValue('slug', slug);
                                }}
                            />

                            <TextInput
                                name="slug"
                                placeholder="Slug"
                                className="flex-grow-1"
                                label="Slug"
                                value={values.slug}
                                disabled
                            />
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
}
