import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useMemo, useState } from 'react';
import apiCall from 'services/_baseService';
import { authOptions } from './api/auth/[...nextauth]';

const chartOptions = {
  cutout: '60%',
  borderColor: '#071426',
  borderWidth: 5,
  hoverOffset: 25,
};

export default function Dashboard({ data }) {
  const [products, setProducts] = useState(null);
  // const menu1 = useRef(null);
  // const menu2 = useRef(null);
  // const { layoutConfig } = useContext(LayoutContext);
  // const contextPath = getConfig().publicRuntimeConfig.contextPath;
  // const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});

  const chartData = useMemo(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
      labels: ['blog', 'bounce', 'Subscribed'],
      datasets: [
        {
          data: [
            data?.visits?.general ?? 300,
            data?.visits?.bounce ?? 50,
            data?.subscriber?.count ?? 100,
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
  }, [data]);

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
                {data?.post_last?.touch} day(s)
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
              {data?.post_last?.post?.author?.name}
            </span>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-500 over">
              {data?.post_last?.post?.title}
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
                {data?.post_last?.draft}
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
            {data?.post_last?.oldest?.updated_at}
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
                {data?.visits?.total}
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
                {data?.visits?.general}
              </span>
              <span className="text-green-500 font-medium">
                {data?.visits?.blog}
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
                {data?.subscriber?.count}
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
              {data?.post_last?.post?.author?.name}
            </span>
          </div>
          <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
            <span className="text-500 over">
              {data?.post_last?.post?.title}
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Most Recent Subscription</h5>
          <DataTable
            value={data?.subscriber?.list}
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

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { data } = await apiCall.get('/admin', {
    headers: {
      Authorization: `Bearer ${session?.accessToken || ''}`,
    },
  });

  // const productService = new ProductService();
  // productService.getProductsSmall().then(data => console.log(data));

  return {
    props: { data: data || '' }, // will be passed to the page component as props
  };
}
