import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CustomerService } from '../../../demo/service/CustomerService';
import { ProductService } from '../../../demo/service/ProductService';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
// import RichTextEditor from '@/components/RichTextEditor';
import { useFormik } from 'formik';
import { ToggleButton } from 'primereact/togglebutton';
import { Chips } from 'primereact/chips';
import apiCall from 'services/_baseService';
import { usePaginatedBlog } from '@/hooks/blog';

const PostsTable = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [customFirst1, setCustomFirst1] = useState(0);
    const [customers1, setCustomers1] = useState(null);
    const [customers2, setCustomers2] = useState([]);
    const [customers3, setCustomers3] = useState([]);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [products, setProducts] = useState([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [visibleBottom, setVisibleBottom] = useState(false);

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' },
    ];

    const statuses = [
        'unqualified',
        'qualified',
        'new',
        'negotiation',
        'renewal',
        'proposal',
    ];
    const customerService = new CustomerService();
    const productService = new ProductService();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [postList, setPostList] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPostList, setSelectedPostList] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            name: { value: '', matchMode: 'contains' },
            'country.name': { value: '', matchMode: 'contains' },
            company: { value: '', matchMode: 'contains' },
            'representative.name': { value: '', matchMode: 'contains' },
        },
    });

    const { data: blogList } = usePaginatedBlog();

    console.log(blogList);

    let loadLazyTimeout = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadLazyData = () => {
        setLoading(true);

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        //imitate delay of a backend call
        loadLazyTimeout = setTimeout(() => {
            // customerService.getCustomersMedium({ lazyEvent: JSON.stringify(lazyParams) })
            apiCall.get(`/admin/post/list?page=${currentPage}`).then(data => {
                setCurrentPage(data?.data?.current_page ?? 1);
                setTotalRecords(data?.data?.total ?? 0);
                setPostList(data?.data?.items ?? null);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const onSort = event => {
        setLazyParams(event);
    };

    const onFilter = event => {
        event['first'] = 0;
        setLazyParams(event);
    };

    const onSelectionChange = event => {
        const value = event.value;
        setSelectedCustomers(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = event => {
        const selectAll = event.checked;

        if (selectAll) {
            customerService.getCustomersMedium().then(data => {
                setSelectAll(true);
                setSelectedCustomers(data.customers);
            });
        } else {
            setSelectAll(false);
            setSelectedCustomers([]);
        }
    };

    const tagBodyTemplate = rowData => {
        const tagLists = rowData.tags.map(res => res.title);
        return tagLists.join(', ');
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.DATE_IS },
                ],
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue1('');
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
                        value={postList}
                        lazy
                        filterDisplay="row"
                        responsiveLayout="scroll"
                        dataKey="id"
                        paginator
                        first={lazyParams.first}
                        rows={10}
                        totalRecords={totalRecords}
                        // onPage={currentPage}
                        onPage={e => console.log(e)}
                        onSort={onSort}
                        sortField={lazyParams.sortField}
                        sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter}
                        filters={lazyParams.filters}
                        loading={loading}
                        selection={selectedPostList}
                        onSelectionChange={onSelectionChange}
                        selectAll={selectAll}
                        onSelectAllChange={onSelectAllChange}
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

export default PostsTable;
