import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React from 'react';

export function UserForm({ data }) {
    return (
        <Formik
            initialValues={{
                name: '',
                username: '',
                email: '',
                password: '',
            }}
            onSubmit={e => {
                console.log(e);
            }}
        >
            {({ values, setFieldValue, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
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
                                placeholder="Email address"
                                className="w-full mb-3"
                            />
                        </div>
                        <div class="field col-12 md:col-6">
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
                                    setFieldValue('username', e.target.value)
                                }
                                type="text"
                                placeholder="Username"
                                className="w-full mb-3"
                            />
                        </div>
                        <div class="field col-12 md:col-6">
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
                        <div class="field col-12 md:col-6">
                            <label
                                htmlFor="Password"
                                className="block text-900 font-medium mb-2"
                            >
                                Password
                            </label>
                            <InputText
                                id="Password"
                                type="password"
                                value={values.password}
                                onChange={e =>
                                    setFieldValue('password', e.target.value)
                                }
                                placeholder="Password"
                                className="w-full mb-3"
                            />
                        </div>

                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default UserForm;
