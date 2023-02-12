import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState } from 'react';
// import './DataTableDemo.css';
import { useUserManagement } from '@/hooks/user-management';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';

const UserManagement = () => {
    const [selectedProduct1, setSelectedProduct1] = useState(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const [name, setName] = useState('');

    const { data: users } = useUserManagement();

    const roleTemplate = rowData => {
        const roles = rowData?.roles?.map(res => res.name);
        return roles.join(', ');
    };

    const userNameTemplate = rowData => {
        const name = rowData.name;
        const imageUrl = `${rowData?.media?.path}=${rowData?.media?.mediable_id}`;
        return (
            <div className="flex align-items-center">
                <Avatar
                    image={imageUrl}
                    className="flex align-items-center justify-content-center mr-2"
                    size="large"
                    shape="circle"
                />

                <span className="vertical-align-middle ml-2">{name}</span>
            </div>
        );
    };

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
                        <InputText
                            value={name}
                            onChange={e => setName(e.target.name)}
                        />
                    </div>
                    <div className="field col-6 sm:col-12">
                        <InputText
                            value={name}
                            onChange={e => setName(e.target.name)}
                        />
                    </div>
                </div>
                {JSON.stringify(selectedProduct1)}
            </Sidebar>
            <div className="col-12">
                <div className="card">
                    <h5>User Management</h5>
                    <DataTable
                        value={users?.data ?? []}
                        selectionMode="single"
                        selection={selectedProduct1}
                        onSelectionChange={e => {
                            setSelectedProduct1(e.value);
                        }}
                        onClick={() => setVisibleRight(true)}
                        dataKey="id"
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="name"
                            header="Name"
                            body={userNameTemplate}
                        ></Column>
                        <Column field="email" header="Email"></Column>
                        <Column
                            field="roles"
                            header="Role"
                            body={roleTemplate}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
