import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { PickList } from 'primereact/picklist';
import { OrderList } from 'primereact/orderlist';
import { ProductService } from '../../../demo/service/ProductService';
import { InputText } from 'primereact/inputtext';
import getConfig from 'next/config';
import Image from 'next/image';
import { Calendar } from 'primereact/calendar';

const ListDemo = () => {
    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' },
    ];

    const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [dateRanges, setDateRanges] = useState(null);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' },
    ];

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setDataViewValue(data));
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter((product) => {
                return product.name.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
        }
    };

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <div className="flex flex-row flex-grow-1 align-items-center gap-1">
                <label htmlFor="dateRange">Pick Date Ranges:</label>
                <Calendar
                    id="dateRage"
                    value={dateRanges}
                    onChange={(e) => setDateRanges(e.value)}
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

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-hashtag mr-2" />
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span
                            className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>
                            {data.inventoryStatus}
                        </span>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img
                            src={`${contextPath}/demo/images/product/${data.image}`}
                            alt={data.name}
                            className="w-9 shadow-2 my-3 mx-0"
                        />
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <p>
                            Responses: <br />
                            <span className="text-2xl font-bold">{data.price}</span>
                        </p>
                        <span className="p-buttonset flex">
                            <Button
                                className="p-button-info"
                                icon="pi pi-eye"
                                tooltip="View Response"
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
                                tooltipOptions={{
                                    position: 'bottom',
                                    mouseTrack: true,
                                    mouseTrackTop: 15,
                                }}
                            />
                            <Button
                                className="p-button-danger"
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
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h1>Event Form List</h1>
                    <DataView
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}></DataView>
                </div>
            </div>
        </div>
    );
};

export default ListDemo;
