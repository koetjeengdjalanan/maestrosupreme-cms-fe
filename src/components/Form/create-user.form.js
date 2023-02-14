import { useCreateUser } from '@/hooks/user-management';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export function CreateUserForm({ visible, onHide }) {
    const { mutateAsync: createUser, isLoading } = useCreateUser();

    return (
        <Dialog
            header="Create user"
            visible={visible}
            style={{ maxWidth: '500px' }}
            onHide={onHide}
        >
            <Formik
                initialValues={{
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                }}
                onSubmit={e => {
                    try {
                        createUser(e);
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
                                        setFieldValue('name', e.target.value)
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
                                        setFieldValue('email', e.target.value)
                                    }
                                    placeholder="Email address"
                                    className="w-full mb-3"
                                />
                            </div>
                            <div className="field col-12">
                                <label
                                    htmlFor="password"
                                    className="block text-900 font-medium mb-2"
                                >
                                    Password
                                </label>
                                <InputText
                                    id="password"
                                    type="password"
                                    value={values.password}
                                    onChange={e =>
                                        setFieldValue(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Password"
                                    className="w-full mb-3"
                                />
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
        </Dialog>
    );
}

export default CreateUserForm;
