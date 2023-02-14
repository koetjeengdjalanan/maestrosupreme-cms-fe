import { CreateUserForm, UserUpdateForm } from '@/components/Form';
import { ModalDeleteUser } from '@/components/Modals/User';
import { useUserManagement } from '@/hooks/user-management';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState } from 'react';

const UserManagement = () => {
    const [selected, setSelected] = useState(null);
    const [isCreate, setIsCreate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const { data: users, isLoading } = useUserManagement();

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

    const deleteButtonTemplate = rowData => {
        return (
            <div className="flex align-items-center ">
                <Button
                    className="p-button-danger"
                    label="Delete"
                    icon="pi pi-trash"
                    onClick={() => {
                        setSelected(rowData);
                        setIsDelete(true);
                    }}
                />
            </div>
        );
    };

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-3">
                            <h5 className="m-0">User Management</h5>
                            <Button
                                className="m-0"
                                onClick={() => setIsCreate(true)}
                            >
                                Create User
                            </Button>
                        </div>
                        <DataTable
                            value={users?.data ?? []}
                            selectionMode="single"
                            selection={selected}
                            onSelectionChange={e => {
                                setSelected(e.value);
                                setIsUpdate(true);
                            }}
                            loading={isLoading}
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
                            <Column
                                header="Action"
                                body={deleteButtonTemplate}
                                exportable={false}
                                style={{ minWidth: '8rem' }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <UserUpdateForm
                data={selected}
                visible={isUpdate}
                onHide={() => {
                    setIsUpdate(false);
                    setSelected(null);
                }}
            />
            <CreateUserForm
                visible={isCreate}
                onHide={() => {
                    setIsCreate(false);
                }}
            />
            <ModalDeleteUser
                visible={isDelete}
                onHide={() => {
                    setIsDelete(false);
                    setSelected(null);
                }}
                data={selected}
            />
        </>
    );
};

export default UserManagement;
