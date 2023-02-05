import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';
import Image from 'next/image';
import apiCall from 'services/_baseService';
import dayjs from 'dayjs';
export default function Dashboard() {
  const [products, setProducts] = useState(null);
  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const { layoutConfig } = useContext(LayoutContext);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const [dashData, setDashData] = useState(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['blog', 'bounce', 'Subscribed'],
      datasets: [
        {
          data: [
            dashData?.visits?.general ?? 300,
            dashData?.visits?.bounce ?? 50,
            dashData?.subscriber?.count ?? 100,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };
    const options = {
      cutout: '60%',
      borderColor: '#071426',
      borderWidth: 5,
      hoverOffset: 25,
    };

    setChartData(data);
    setChartOptions(options);
  }, [
    dashData?.subscriber?.count,
    dashData?.visits?.bounce,
    dashData?.visits?.general,
  ]);

  useEffect(() => {
    apiCall
      .get('/admin')
      .then(res => {
        setDashData(res.data);
        console.log(res.data);
      })
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    const productService = new ProductService();
    productService.getProductsSmall().then(data => setProducts(data));
  }, []);

  const dateTimeFormat = rowData => {
    return dayjs(rowData.created_at * 1).format('ddd, MMM D, YY h:mm A');
  };

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Last Post</span>
              <div className="text-900 font-medium text-xl">
                {dashData?.post_last?.touch} day(s)
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-megaphone text-blue-500 text-xl" />
            </div>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-green-500 font-medium">
              {dashData?.post_last?.post?.author?.name}
            </span>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-500 over">
              {dashData?.post_last?.post?.title}
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Draft Post
              </span>
              <div className="text-900 font-medium text-xl">
                {dashData?.post_last?.draft}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">
            Oldest Draft Update
          </span>
          <br />
          <span className="text-500">
            {dashData?.post_last?.oldest?.updated_at}
          </span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Web Visitor
              </span>
              <div className="text-900 font-medium text-xl">
                {dashData?.visits?.total}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-column">
              <span className="text-500">Bounce</span>
              <span className="text-500">Blog</span>
            </div>
            <div className="flex flex-column">
              <span className="text-green-500 font-medium">
                {dashData?.visits?.general}
              </span>
              <span className="text-green-500 font-medium">
                {dashData?.visits?.blog}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Mail Subscriber
              </span>
              <div className="text-900 font-medium text-xl">
                {dashData?.subscriber?.count}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-envelope text-cyan-500 text-xl" />
            </div>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-green-500 font-medium">
              {dashData?.post_last?.post?.author?.name}
            </span>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-500 over">
              {dashData?.post_last?.post?.title}
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Most Recent Subscription</h5>
          <DataTable
            value={dashData?.subscriber?.list}
            rows={5}
            paginator
            resizableColumns
            columnResizeMode="fit"
            responsiveLayout="scroll"
          >
            <Column field="mail" header="Email" style={{ width: '30%' }} />
            <Column
              header="Time Stamp"
              sortable
              style={{ width: '55%' }}
              body={dateTimeFormat}
            />
            <Column
              header="View"
              style={{ width: '15%' }}
              body={() => (
                <>
                  <Button
                    icon="pi pi-search"
                    type="button"
                    className="p-button-text"
                  />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="flex flex-column card gap-3 flex-grow-1 justify-content-center align-items-center">
          <h2>Visitor Overview</h2>
          <Chart
            type="doughnut"
            data={chartData}
            options={chartOptions}
            className="w-full md:w-30rem"
          />
        </div>
      </div>
    </div>
  );
}
