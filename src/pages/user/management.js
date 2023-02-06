import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../../demo/service/ProductService';
// import './DataTableDemo.css';
import getConfig from 'next/config';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'chart.js';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const UserManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [visibleRight, setVisibleRight] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // ProductService.getProductsMini().then(data => setProducts(data));
    fetch(
      getConfig().publicRuntimeConfig.contextPath +
        '/demo/data/products-small.json',
      {
        headers: { 'Cache-Control': 'no-cache' },
      }
    )
      .then(res => res.json())
      .then(d => setProducts(d.data));
  }, []);

  return (
    <div className="grid">
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
        className="w-9"
      >
        <h2>User Edit</h2>
        <div className="flex flex-row">
          <div className="field col-6 sm:col-12">
            <InputText value={name} onChange={e => setName(e.target.name)} />
          </div>
          <div className="field col-6 sm:col-12">
            <InputText value={name} onChange={e => setName(e.target.name)} />
          </div>
        </div>
        {JSON.stringify(selectedProduct1)}
      </Sidebar>
      <div className="col-12">
        <div className="card">
          <h5>User Management</h5>
          <DataTable
            value={products}
            selectionMode="single"
            selection={selectedProduct1}
            onSelectionChange={e => {
              setSelectedProduct1(e.value);
            }}
            onClick={() => setVisibleRight(true)}
            dataKey="id"
            responsiveLayout="scroll"
          >
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
