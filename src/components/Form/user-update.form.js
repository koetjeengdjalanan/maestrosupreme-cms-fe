import {
    useRoles,
    useUpdateRoles,
    useUpdateUser,
} from '@/hooks/user-management';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

export function UserUpdateForm({ data, visible, onHide }) {
    const { mutateAsync: updateUser, isLoading } = useUpdateUser();

    return (
        <Dialog
            header="Edit user"
            visible={visible}
            style={{ maxWidth: '500px' }}
            onHide={onHide}
        >
            {data && (
                <Formik
                    initialValues={{
                        id: data.id ?? '',
                        name: data.name ?? '',
                        username: data.username ?? '',
                        email: data.email ?? '',
                    }}
                    onSubmit={e => {
                        try {
                            updateUser(e);
                            onHide();
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {({ values, setFieldValue, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="formgrid grid mb-3">
                                <div className="field col-12">
                                    <label
                                        htmlFor="name"
                                        className="block text-900 font-medium mb-2"
                                    >
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        value={values.name}
                                        onChange={e =>
                                            setFieldValue(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        type="text"
                                        placeholder="Name"
                                        className="w-full mb-3"
                                    />
                                </div>
                                <div className="field col-12">
                                    <label
                                        htmlFor="username"
                                        className="block text-900 font-medium mb-2"
                                    >
                                        Username
                                    </label>
                                    <InputText
                                        id="username"
                                        value={values.username}
                                        onChange={e =>
                                            setFieldValue(
                                                'username',
                                                e.target.value
                                            )
                                        }
                                        type="text"
                                        placeholder="Username"
                                        className="w-full mb-3"
                                    />
                                </div>
                                <div className="field col-12">
                                    <label
                                        htmlFor="email"
                                        className="block text-900 font-medium mb-2"
                                    >
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        type="text"
                                        value={values.email}
                                        onChange={e =>
                                            setFieldValue(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Email address"
                                        className="w-full mb-3"
                                    />
                                </div>
                                <div className="field col-12">
                                    <RoleOptions data={data} />
                                </div>
                            </div>
                            <Button
                                label="Submit"
                                className="w-full"
                                type="submit"
                                loading={isLoading}
                            />
                        </form>
                    )}
                </Formik>
            )}
        </Dialog>
    );
}

function RoleOptions({ data }) {
    const [selectedRole, setSelectedRole] = useState(data.roles[0]?.id);
    const { data: roleOptions, isLoading } = useRoles();
    const { mutateAsync, isLoading: updating } = useUpdateRoles();

    return (
        <>
            <label htmlFor="role" className="block text-900 font-medium mb-2">
                Role
            </label>
            {isLoading || updating ? (
                <Dropdown
                    placeholder="Loading..."
                    className="w-full"
                    options={undefined}
                    readOnly
                />
            ) : (
                <Dropdown
                    id="role"
                    value={selectedRole}
                    onChange={e => {
                        try {
                            setSelectedRole(e.value);
                            mutateAsync({
                                user_id: data?.id,
                                role_id: e.value,
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    options={roleOptions}
                    optionLabel="name"
                    placeholder="Select Role"
                    className="w-full"
                />
            )}
        </>
    );
}

export default UserUpdateForm;
