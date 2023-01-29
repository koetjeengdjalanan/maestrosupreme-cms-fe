import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import AppConfig from '../layout/AppConfig';
import { Button } from 'primereact/button';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import Image from 'next/image';

const ForgotPassword = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <Image
                    src={`${contextPath}/layout/images/ms-logo.svg`}
                    alt="Sakai logo"
                    width={90}
                    height={90}
                    className="mb-5 w-6rem flex-shrink-0"
                />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background:
                            'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}>
                    <div
                        className="flex align-items-center justify-content-between w-full surface-card py-8 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}>
                        <div className="w-full">
                            <p>Only Administrator can recover your account, Ask them nicely!</p>
                            <label
                                htmlFor="email1"
                                className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                inputid="email1"
                                type="text"
                                placeholder="Email address"
                                className="w-full md:w-30rem mb-3"
                                style={{ padding: '1rem' }}
                            />
                            <div className="mb-2 flex justify-content-end pr-4">
                                <Link
                                    href="/login"
                                    className="font-medium no-underline mb-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}>
                                    Login Instead!
                                </Link>
                            </div>
                            <Button
                                label="Request Password Reset"
                                className="w-full p-3 text-xl"
                                onClick={() => router.push('/')}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ForgotPassword.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default ForgotPassword;
