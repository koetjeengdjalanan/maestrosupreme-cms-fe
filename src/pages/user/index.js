import { useUpdateUser } from '@/hooks/user';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useState } from 'react';

const ProfilePage = () => {
    const { data: session } = useSession();
    const toast = useRef();
    const submitButton = useRef(null);

    const [isEdit, setIsEdit] = useState(false);

    const { mutate } = useUpdateUser();

    const onSubmit = data => {
        mutate(data);
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Congratulations, User profile was updated!!!',
        });
    };

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between mb-4">
                            <h1>User Info</h1>
                            <div>
                                <Button
                                    label={isEdit ? 'Submit' : 'Edit'}
                                    onClick={() => {
                                        setIsEdit(prev => !prev);
                                        if (isEdit) {
                                            submitButton.current.click();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {isEdit ? (
                            <Formik
                                initialValues={{
                                    id: session?.user?.id ?? '',
                                    name: session?.user?.name ?? '',
                                    email: session?.user?.email ?? '',
                                    username: session?.user?.username ?? '',
                                }}
                                onSubmit={onSubmit}
                            >
                                {({ values, setFieldValue, handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex gap-5">
                                            <div
                                                className="relative"
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                }}
                                            >
                                                <Image
                                                    src={
                                                        session?.user?.imageUrl
                                                    }
                                                    alt="avatar"
                                                    fill
                                                />
                                            </div>
                                            <div className="flex flex-column gap-2 flex-grow-1">
                                                <div>
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
                                                <div>
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
                                                <div>
                                                    <label
                                                        htmlFor="username"
                                                        value={values.username}
                                                        onChange={e =>
                                                            setFieldValue(
                                                                'username',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block text-900 font-medium mb-2"
                                                    >
                                                        Username
                                                    </label>
                                                    <InputText
                                                        id="username"
                                                        type="text"
                                                        placeholder="Email address"
                                                        className="w-full mb-3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="hidden"
                                            ref={submitButton}
                                        >
                                            Submit
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                        ) : (
                            <div className="flex gap-5">
                                <div
                                    className="relative"
                                    style={{
                                        width: 200,
                                        height: 200,
                                    }}
                                >
                                    <Image
                                        src={session?.user?.imageUrl}
                                        alt="avatar"
                                        fill
                                    />
                                </div>
                                <div>
                                    <p className="text-xl">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-gray-400">
                                        {session?.user?.email}
                                    </p>
                                    <p className="text-gray-400">
                                        {session?.user?.role[0]}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    );
};

export default ProfilePage;
