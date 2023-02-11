import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React from 'react';

const accessor = {
    name: { value: '', matchMode: 'contains' },
    'country.name': { value: '', matchMode: 'contains' },
    company: { value: '', matchMode: 'contains' },
    'representative.name': { value: '', matchMode: 'contains' },
};

const accessorAlt = {
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
};

export function BlogTable(props) {
    const { data, isLoading, total } = props;
    console.log(data);

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    className="p-button-outlined"
                    // onClick={clearFilter1}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        // value={globalFilterValue1}
                        // onChange={onGlobalFilterChange1}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };
    return (
        <DataTable
            value={data}
            paginator
            rows={10}
            dataKey="id"
            filters={accessor}
            filterDisplay="row"
            responsiveLayout="scroll"
            totalRecords={total}
            // className="p-datatable-gridlines"
            // showGridlines
            // rows={10}
            // dataKey="id"
            loading={isLoading}
            emptyMessage="No Post Found"
            header={renderHeader1}
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
                // body={tagBodyTemplate}
                header="Tags"
                filterPlaceholder="Search tags"
            />

            {/* <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" filterClear={filterClearTemplate} filterApply={filterApplyTemplate} />
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
                        <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                        <Column header="Balance" filterField="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
                        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} /> */}
        </DataTable>
    );
}

export default BlogTable;
