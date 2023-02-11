import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useMemo, useState } from 'react';
// import RichTextEditor from '@/components/RichTextEditor';
import { usePaginatedBlog } from '@/hooks/blog';
import { useFormik } from 'formik';
import { Chips } from 'primereact/chips';
import { ToggleButton } from 'primereact/togglebutton';
import { combineKeys } from '@/utils/convertParamsObject';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const ROWS = 10;

const PARAMS = {
    page: 1,
    published_only: true,
    perPage: ROWS,
    published_only: true,
    sort: 'title',
    draft: true,
    filter: {
        body: '',
        tags: {
            title: '',
            slug: '',
        },
        author: {
            title: '',
            slug: '',
        },
        category: {
            title: '',
            slug: '',
        },
        published_before: '',
    },
};

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

const calculateCurrentPage = (first, perPage) => {
    return first / perPage + 1;
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
    const [options, setOptions] = useState({});
    const [visibleBottom, setVisibleBottom] = useState(false);
    const [lazyParams, setLazyParams] = useState(FILTER);

    const newParams = useMemo(
        () => ({
            ...getParams(lazyParams),
        }),
        [lazyParams]
    );

    const { data: blogList, isFetching } = usePaginatedBlog({
        params: newParams,
        options,
    });

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

    const onSelectionChange = event => {
        const value = event.value;
        // setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = event => {
        const selectAll = event.checked;

        // if (selectAll) {
        //     customerService.getCustomersMedium().then(data => {
        //         setSelectAll(true);
        //         setSelectedCustomers(data.customers);
        //     });
        // } else {
        //     setSelectAll(false);
        //     setSelectedCustomers([]);
        // }
    };

    const tagBodyTemplate = rowData => {
        const tagLists = rowData.tags.map(res => res.title);
        return tagLists.join(', ');
    };

    const postTagsChip = item => {
        return (
            <div>
                <span>{item} - (active) </span>
                <i className="pi pi-user-plus" style={{ fontSize: '14px' }}></i>
            </div>
        );
    };
    const postForm = useFormik({
        initialValues: {
            title: null,
            publishOnSubmit: false,
            tags: [],
        },
    });

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between flex-wrap">
                        <h1>Post List</h1>
                        <div>
                            <Button
                                label="Add New Post"
                                icon="pi pi-fw pi-plus-circle"
                                onClick={() => setVisibleBottom(true)}
                                className="p-button-raised p-button-success"
                            />
                            <Sidebar
                                visible={visibleBottom}
                                onHide={() => setVisibleBottom(false)}
                                baseZIndex={1000}
                                position="bottom"
                                style={{ height: '90vh' }}
                            >
                                <div className="card h-full">
                                    <div class="flex justify-content-between">
                                        <h1
                                            style={{
                                                fontWeight: 'normal',
                                                marginBottom: '1.25em',
                                                textAlign: 'start',
                                            }}
                                        >
                                            Make New Post
                                        </h1>
                                        <h2>
                                            {process.env.FE_URI}/
                                            {postForm.value?.title}
                                        </h2>
                                    </div>
                                    <form>
                                        <div className="flex flex-column flex-nowrap justify-content-start align-items-start gap-4">
                                            <div className="flex gap-6 align-items-center w-full">
                                                <div class="flex flex-grow-1">
                                                    <span className="p-float-label w-full">
                                                        <InputText
                                                            id="title"
                                                            className="p-inputtext-lg w-full h-full"
                                                            onChange={
                                                                postForm.handleChange
                                                            }
                                                            value={
                                                                postForm.values
                                                                    .title
                                                            }
                                                        />
                                                        <label htmlFor="title mb-2">
                                                            Title
                                                        </label>
                                                    </span>
                                                </div>
                                                <div class="flex flex-none">
                                                    <ToggleButton
                                                        onLabel="Publish"
                                                        offLabel="Draft"
                                                        id="publishOnSubmit"
                                                        tooltip="Publish On Submit?"
                                                        tooltipOptions={{
                                                            position: 'left',
                                                        }}
                                                        checked={
                                                            postForm.values
                                                                .publishOnSubmit
                                                        }
                                                        onChange={
                                                            postForm.handleChange
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-6 align-items-center w-full p-fluid">
                                                <div className="flex-grow-1">
                                                    <label htmlFor="postTags mb-2">
                                                        Tags
                                                    </label>
                                                    <Chips
                                                        id="postTags"
                                                        value={
                                                            postForm.values.tags
                                                        }
                                                        onChange={
                                                            postForm.handleChange
                                                        }
                                                        multiple="true"
                                                        separator=","
                                                        itemTemplate={
                                                            postTagsChip
                                                        }
                                                    />
                                                </div>
                                                <div className="w-4">
                                                    <label htmlFor="postCategory">
                                                        Category
                                                    </label>
                                                    <InputText
                                                        id="postCategory"
                                                        value={
                                                            postForm.values
                                                                .category
                                                        }
                                                        onChange={
                                                            postForm.handleChange
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-column w-full gap-3">
                                                <label>Body</label>
                                                {/* <RichTextEditor /> */}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Sidebar>
                        </div>
                    </div>
                    <DataTable
                        value={blogList?.items}
                        paginator
                        rows={lazyParams.rows}
                        lazy
                        // filterDisplay="row"

                        filterDisplay="menu"
                        responsiveLayout="scroll"
                        dataKey="id"
                        first={lazyParams.first}
                        totalRecords={blogList?.total}
                        onPage={onPageChange}
                        onSort={onSort}
                        sortField={lazyParams.sortField}
                        sortOrder={lazyParams.sortOrder}
                        // page
                        // onPage={e => {
                        //     setFirst(e.first);
                        // }}
                        // paginatorTemplate={{

                        // }}
                        // selectionPageOnly
                        // sortField={lazyParams.sortField}
                        // sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter}
                        filters={lazyParams.filters}
                        loading={isFetching}
                        // selection={selectedPostList}
                        // onSelectionChange={onSelectionChange}
                        // selectAll={selectAll}
                        // onSelectAllChange={onSelectAllChange}
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: '3em' }}
                        ></Column>
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
                            sortable
                            filter
                            header="Category"
                            filterPlaceholder="Search category"
                        />
                        <Column
                            field="tags"
                            sortable
                            filter
                            body={tagBodyTemplate}
                            header="Tags"
                            filterPlaceholder="Search tags"
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
