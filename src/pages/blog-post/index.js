import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useMemo, useState } from 'react';
// import RichTextEditor from '@/components/RichTextEditor';
import { usePaginatedBlog } from '@/hooks/blog';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';

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
    const [options, setOptions] = useState({});
    const [lazyParams, setLazyParams] = useState(FILTER);
    const [selectedPost, setSelectedPost] = useState(null);

    const router = useRouter();

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

    const onSelectionChange = e => {
        setSelectedPost(e.value);
    };

    const tagBodyTemplate = rowData => {
        const tagLists = rowData.tags.map(res => res.title);
        return tagLists.join(', ');
    };

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
                                onClick={() => router.push('/blog-post/create')}
                                className="p-button-raised p-button-success"
                            />
                        </div>
                    </div>
                    <DataTable
                        value={blogList?.items}
                        paginator
                        rows={lazyParams.rows}
                        lazy
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
                        selection={selectedPost}
                        onSelectionChange={onSelectionChange}
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
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
