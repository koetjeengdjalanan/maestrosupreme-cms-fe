import { useCategories } from '@/hooks/blog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const CategoriesTable = () => {
    const { data: categories, isLoading } = useCategories({});

    // console.log(categories);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h1>Category List</h1>
                    <DataTable
                        value={categories?.data}
                        totalRecords={categories?.total}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={15}
                        dataKey="id"
                        filterDisplay="menu"
                        loading={isLoading}
                        responsiveLayout="scroll"
                        emptyMessage="No categories found."
                    >
                        <Column
                            field="title"
                            header="Name"
                            filter
                            filterPlaceholder="Search by name"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column
                            field="created_at"
                            header="Created at"
                            filter
                            filterPlaceholder="Search by name"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column
                            field="author.name"
                            header="Author"
                            filter
                            filterPlaceholder="Search by name"
                            style={{ minWidth: '12rem' }}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default CategoriesTable;
