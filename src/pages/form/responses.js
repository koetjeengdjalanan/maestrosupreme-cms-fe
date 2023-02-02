import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { CustomerService } from '../../../demo/service/CustomerService';
import { ProductService } from '../../../demo/service/ProductService';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { Ripple } from 'primereact/ripple';

const TagsTable = () => {
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

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];
    const customerService = new CustomerService();
    const productService = new ProductService();
    const currentPage = 1;

    const clearFilter1 = () => {
        initFilters1();
    };
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;
        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    className="p-button-outlined"
                    onClick={clearFilter1}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue1}
                        onChange={onGlobalFilterChange1}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };
    useEffect(() => {
        setLoading2(true);
        customerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        customerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        customerService.getCustomersMedium().then((data) => setCustomers3(data));
        productService.getProductsWithOrdersSmall().then((data) => setProducts(data));
        initFilters1();
    }, []);
    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };
    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue1('');
    };
    const countryBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <img
                    alt="flag"
                    src={`${contextPath}/demo/images/flag/flag_placeholder.png`}
                    className={`flag flag-${rowData.country.code}`}
                    width={30}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>
                    {rowData.country.name}
                </span>
            </React.Fragment>
        );
    };
    const filterClearTemplate = (options) => {
        return (
            <Button
                type="button"
                icon="pi pi-times"
                onClick={options.filterClearCallback}
                className="p-button-secondary"></Button>
        );
    };
    const filterApplyTemplate = (options) => {
        return (
            <Button
                type="button"
                icon="pi pi-check"
                onClick={options.filterApplyCallback}
                className="p-button-success"></Button>
        );
    };
    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`${contextPath}/demo/images/avatar/${representative.image}`}
                    onError={(e) =>
                        (e.target.src =
                            'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                    }
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>
                    {representative.name}
                </span>
            </React.Fragment>
        );
    };
    const representativeFilterTemplate = (options) => {
        return (
            <>
                <div className="mb-3 text-bold">Agent Picker</div>
                <MultiSelect
                    value={options.value}
                    options={representatives}
                    itemTemplate={representativesItemTemplate}
                    onChange={(e) => options.filterCallback(e.value)}
                    optionLabel="name"
                    placeholder="Any"
                    className="p-column-filter"
                />
            </>
        );
    };
    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <img
                    alt={option.name}
                    src={`${contextPath}/demo/images/avatar/${option.image}`}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };
    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                mask="99/99/9999"
            />
        );
    };
    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.balance);
    };
    const balanceFilterTemplate = (options) => {
        return (
            <InputNumber
                value={options.value}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                mode="currency"
                currency="USD"
                locale="en-US"
            />
        );
    };
    const statusBodyTemplate = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                itemTemplate={statusItemTemplate}
                placeholder="Select a Status"
                className="p-column-filter"
                showClear
            />
        );
    };
    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };
    const activityBodyTemplate = (rowData) => {
        return (
            <ProgressBar
                value={rowData.activity}
                showValue={false}
                style={{ height: '.5rem' }}></ProgressBar>
        );
    };
    const activityFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <Slider
                    value={options.value}
                    onChange={(e) => options.filterCallback(e.value)}
                    range
                    className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };
    const verifiedBodyTemplate = (rowData) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified,
                })}></i>
        );
    };
    const verifiedFilterTemplate = (options) => {
        return (
            <TriStateCheckbox
                value={options.value}
                onChange={(e) => options.filterCallback(e.value)}
            />
        );
    };
    const onPageInputKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(currentPage);
            if (page < 0 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            } else {
                const first = currentPage ? options.rows * (page - 1) : 0;
                setCustomFirst1(first);
                setPageInputTooltip("Press 'Enter' key to go to this page.");
            }
        }
    };
    const header1 = renderHeader1();
    const onCustomPageChange1 = (event) => {
        setCustomFirst1(event.first);
        setCustomRows1(event.rows);
        setCurrentPage(event.page + 1);
    };
    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if (
                (options.view.startPage === options.page && options.view.startPage !== 0) ||
                (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
            ) {
                const className = classNames(options.className, { 'p-disabled': true });
                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }
            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 },
                { label: 'All', value: options.totalRecords },
            ];
            return (
                <Dropdown
                    value={options.value}
                    options={dropdownOptions}
                    onChange={options.onChange}
                />
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to{' '}
                    <InputText
                        size="2"
                        className="ml-1"
                        value={currentPage}
                        // tooltip={pageInputTooltip}
                        onKeyDown={(e) => onPageInputKeyDown(e, options)}
                        // onChange={onPageInputChange}
                    />
                </span>
            );
        },
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h1>Category List</h1>
                    <DataTable
                        value={customers1}
                        paginator
                        paginatorTemplate={template1}
                        first={customFirst1}
                        onPage={1}
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="No customers found."
                        header={header1}>
                        <Column
                            field="name"
                            header="Name"
                            filter
                            filterPlaceholder="Search by name"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column
                            header="Country"
                            filterField="country.name"
                            style={{ minWidth: '12rem' }}
                            body={countryBodyTemplate}
                            filter
                            filterPlaceholder="Search by country"
                            filterClear={filterClearTemplate}
                            filterApply={filterApplyTemplate}
                        />
                        <Column
                            header="Agent"
                            filterField="representative"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={representativeBodyTemplate}
                            filter
                            filterElement={representativeFilterTemplate}
                        />
                        <Column
                            header="Date"
                            filterField="date"
                            dataType="date"
                            style={{ minWidth: '10rem' }}
                            body={dateBodyTemplate}
                            filter
                            filterElement={dateFilterTemplate}
                        />
                        <Column
                            header="Balance"
                            filterField="balance"
                            dataType="numeric"
                            style={{ minWidth: '10rem' }}
                            body={balanceBodyTemplate}
                            filter
                            filterElement={balanceFilterTemplate}
                        />
                        <Column
                            field="status"
                            header="Status"
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '12rem' }}
                            body={statusBodyTemplate}
                            filter
                            filterElement={statusFilterTemplate}
                        />
                        <Column
                            field="activity"
                            header="Activity"
                            showFilterMatchModes={false}
                            style={{ minWidth: '12rem' }}
                            body={activityBodyTemplate}
                            filter
                            filterElement={activityFilterTemplate}
                        />
                        <Column
                            field="verified"
                            header="Verified"
                            dataType="boolean"
                            bodyClassName="text-center"
                            style={{ minWidth: '8rem' }}
                            body={verifiedBodyTemplate}
                            filter
                            filterElement={verifiedFilterTemplate}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TagsTable;
