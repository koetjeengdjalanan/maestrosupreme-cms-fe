import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useMemo, useRef, useState } from 'react';
// import RichTextEditor from '@/components/RichTextEditor';
import { useDeleteBlog, usePaginatedBlog } from '@/hooks/blog';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const ROWS = 10;

const FILTER = {
    first: 0,
    rows: ROWS,
    sortField: null,
    sortOrder: null,
    multiSortMeta: [],
    filters: {
        title: {
            // operator: ,
            constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            ],
        },
        'author.name': {
            constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            ],
        },
        'category.title': {
            constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            ],
        },
        tags: {
            constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            ],
        },
    },
    page: 1,
    pageCount: 21,
};

function getParams(tableOptions) {
    const sortField = tableOptions.sortField
        ? tableOptions.sortOrder > 0
            ? String(tableOptions.sortField)
            : `-${String(tableOptions.sortField)}`
        : '';
    return {
        page: tableOptions.page,
        perPage: tableOptions.rows,
        sort: sortField,
        'filter.title': tableOptions.filters.title?.constraints[0].value ?? '',
        'filter.author.name':
            tableOptions.filters['author.name']?.constraints[0].value ?? '',
        'filter.category.title':
            tableOptions.filters['category.title']?.constraints[0].value ?? '',
        'filter.tags.title':
            tableOptions.filters['tags']?.constraints[0].value ?? '',
    };
}

const BlogPost = () => {
    const [lazyParams, setLazyParams] = useState(FILTER);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDelete, setIsDelete] = useState(false);

    const toast = useRef(null);

    const router = useRouter();

    const newParams = useMemo(
        () => ({
            ...getParams(lazyParams),
        }),
        [lazyParams]
    );
    const { data: blogList, isFetching } = usePaginatedBlog({
        params: newParams,
    });

    const { mutate: deletePost, isLoading: deleting } = useDeleteBlog();

    const onPageChange = e => {
        setLazyParams(prev => ({
            ...prev,
            page: e.page + 1,
            first: e.first,
        }));
    };

    const onSort = e => {
        setLazyParams(prev => ({
            ...prev,
            sortField: e.sortField,
            sortOrder: e.sortOrder,
        }));
    };

    const onFilter = e => {
        setLazyParams(prev => ({
            ...prev,
            filters: e.filters,
            sortField: e.sortField,
            sortOrder: e.sortOrder,
        }));
    };

    const tagBodyTemplate = rowData => {
        const tagLists = rowData.tags.map(res => res.title);
        return tagLists.join(', ');
    };

    const actionsTemplate = rowData => {
        return (
            <div className="flex align-items-center gap-3">
                <Button
                    className="p-button-success"
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => {
                        router.push(`/blog-post/edit/${rowData.slug}`);
                    }}
                />
                <Button
                    className="p-button-danger"
                    label="Delete"
                    icon="pi pi-trash"
                    onClick={() => {
                        setSelectedPost(rowData);
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
                        <div className="flex justify-content-between flex-wrap mb-3">
                            <h1 className="m-0">Post List</h1>
                            <div className="flex justify-content-end gap-3">
                                <Button
                                    label="Add New Post"
                                    icon="pi pi-fw pi-plus-circle"
                                    onClick={() =>
                                        router.push('/blog-post/create')
                                    }
                                    className="p-button-raised p-button-success"
                                />
                            </div>
                        </div>
                        <DataTable
                            value={blogList?.items}
                            paginator
                            rows={lazyParams.rows}
                            lazy={isFetching}
                            filterDisplay="menu"
                            responsiveLayout="scroll"
                            dataKey="id"
                            first={lazyParams.first}
                            totalRecords={blogList?.total}
                            onPage={onPageChange}
                            onSort={onSort}
                            sortField={lazyParams.sortField}
                            sortOrder={lazyParams.sortOrder}
                            onFilter={onFilter}
                            filters={lazyParams.filters}
                            loading={isFetching}
                            rowHover
                        >
                            <Column
                                field="title"
                                header="title"
                                sortable
                                filter
                                filterPlaceholder="Search title"
                            />
                            <Column
                                field="author.name"
                                sortable
                                header="author"
                                filterField="author.name"
                                filter
                                filterPlaceholder="Search author"
                            />
                            <Column
                                field="category.title"
                                // sortable
                                // filter
                                header="Category"
                                filterPlaceholder="Search category"
                            />
                            <Column
                                field="tags"
                                // sortable
                                // filter
                                body={tagBodyTemplate}
                                header="Tags"
                                filterPlaceholder="Search tags"
                            />
                            <Column
                                header="Action"
                                body={actionsTemplate}
                                exportable={false}
                                style={{ minWidth: '8rem' }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
            <ModalDeletePost
                visible={isDelete}
                onHide={() => setIsDelete(false)}
                onDelete={() => {
                    deletePost(selectedPost?.id, {
                        onSuccess: res => {
                            if (res) {
                                setIsDelete(false);
                                toast.current.show({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Post was deleted',
                                    life: 3000,
                                });
                                return;
                            }
                            toast.current.show({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Oops, something wrong!!!',
                                life: 3000,
                            });
                        },
                    });
                }}
                isLoading={deleting}
            />
        </>
    );
};

function ModalDeletePost({ visible, onHide, onDelete, isLoading }) {
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
            <p className="m-0">Are you sure you want to delete this Post?</p>
        </Dialog>
    );
}

export default BlogPost;
