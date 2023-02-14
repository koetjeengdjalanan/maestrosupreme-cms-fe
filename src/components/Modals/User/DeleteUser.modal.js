import { useDeleteUser, useUpdateUser } from '@/hooks/user-management';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export function ModalDeleteUser({ visible, onHide, data }) {
    const { mutateAsync: deleteUser, isLoading } = useDeleteUser();
    const onDelete = id => {
        try {
            deleteUser(id);
            onHide();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog
            header="Delete user"
            visible={visible}
            style={{ maxWidth: '500px' }}
            onHide={onHide}
            footer={
                <div className="flex justify-content-end gap-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={onHide}
                        className="p-button-text"
                        autoFocus
                        disabled={isLoading}
                    />

                    <Button
                        className="p-button-danger"
                        label="Delete"
                        icon="pi pi-trash"
                        onClick={() => onDelete(data?.id)}
                        loading={isLoading}
                    />
                </div>
            }
        >
            <p className="m-0">Are you sure you want to delete your account?</p>
        </Dialog>
    );
}

export default ModalDeleteUser;
