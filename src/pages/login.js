'use client';

import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useContext, useState } from 'react';
import AppConfig from '../layout/AppConfig';
import { LayoutContext } from '../layout/context/layoutcontext';
import { authOptions } from './api/auth/[...nextauth]';
import { Formik } from 'formik';

const LoginPage = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const containerClassName = classNames(
    'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
  );
  // const handleSubmit = e => {
  //   e.preventDefault();
  //   // setLoginLoading(true);
  //   console.log(data);
  //   signIn('credentials', {
  //     email: userEmail,
  //     password: userPassword,
  //     redirect: false,
  //   });
  // };

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
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: '53px' }}
          >
            <div>
              <h2>
                Maestro Supreme <span>CMS</span>
              </h2>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  remember: 0,
                }}
                onSubmit={async (values, actions) => {
                  await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                  });
                  actions.setSubmitting(false);
                }}
              >
                {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <label
                      htmlFor="email1"
                      className="block text-900 text-xl font-medium mb-2"
                    >
                      Email
                    </label>
                    <InputText
                      value={values.email}
                      onChange={val => {
                        setFieldValue('email', val.target.value);
                      }}
                      inputid="email"
                      type="text"
                      placeholder="Email address"
                      className="w-full md:w-30rem mb-5"
                      style={{ padding: '1rem' }}
                    />
                    <label
                      htmlFor="password"
                      className="block text-900 font-medium text-xl mb-2"
                    >
                      Password
                    </label>
                    <Password
                      value={values.password}
                      onChange={val => {
                        setFieldValue('password', val.target.value);
                      }}
                      inputid="password"
                      placeholder="Password"
                      toggleMask
                      feedback={false}
                      className="w-full mb-5"
                      inputClassName="w-full p-3 md:w-30rem"
                    ></Password>
                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                      <div className="flex align-items-center">
                        <Checkbox
                          inputid="rememberme"
                          checked={values.remember}
                          onChange={e => {
                            console.log(e.checked, e);
                            setFieldValue('remember', e.checked);
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="rememberme">Remember me</label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="font-medium no-underline ml-2 text-right cursor-pointer"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      label="Sign In"
                      className="w-full p-3 text-xl"
                      type="submit"
                      loading={isSubmitting}
                    />
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default LoginPage;
