import getConfig from 'next/config';
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <div className="layout-footer">
            <Image
                src={`${contextPath}/layout/images/ms-logo.svg`}
                alt="MS-CMS Logo"
                height="20"
                width="20"
                className=""
            />
            <span className="font-medium mx-2">Maestro Supreme Content Management System</span>
            powered by
            <Image
                src={`${contextPath}/layout/images/logo-${
                    layoutConfig.colorScheme === 'light' ? 'dark' : 'white'
                }.svg`}
                alt="Logo"
                height="20"
                width="20"
                className="ml-2"
            />
            <span className="font-medium ml-2">PrimeReact</span>
        </div>
    );
};

export default AppFooter;
