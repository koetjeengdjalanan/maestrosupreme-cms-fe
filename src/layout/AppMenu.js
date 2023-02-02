import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
        },
        {
            label: 'Blog Post',
            items: [
                { label: 'Post List', icon: 'pi pi-fw pi-megaphone', to: '/blog-post' },
                { label: 'Tags', icon: 'pi pi-fw pi-tags', to: '/blog-post/tags' },
                { label: 'Category', icon: 'pi pi-fw pi-hashtag', to: '/blog-post/category' },
            ],
        },
        {
            label: 'Event',
            items: [
                { label: 'Form', icon: 'pi pi-fw pi-question', to: '/form' },
                { label: 'Responses', icon: 'pi pi-fw pi-file', to: '/form/responses' },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
