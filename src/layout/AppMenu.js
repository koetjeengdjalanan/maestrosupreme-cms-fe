import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const session = useSession();

    const adminModel = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                {
                    label: 'Landing Page',
                    icon: 'pi pi-fw pi-th-large',
                    to: '/site-settings',
                },
            ],
        },
        {
            label: 'Blog Post',
            items: [
                {
                    label: 'Post List',
                    icon: 'pi pi-fw pi-megaphone',
                    to: '/blog-post',
                },
                {
                    label: 'Category',
                    icon: 'pi pi-fw pi-hashtag',
                    to: '/blog-post/category',
                },
            ],
        },
        {
            label: 'Event',
            items: [
                { label: 'Form', icon: 'pi pi-fw pi-question', to: '/form' },
            ],
        },
    ];
    const writerModel = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
        },
        {
            label: 'Blog Post',
            items: [
                {
                    label: 'Post List',
                    icon: 'pi pi-fw pi-megaphone',
                    to: '/blog-post',
                },
                {
                    label: 'Tags',
                    icon: 'pi pi-fw pi-tags',
                    to: '/blog-post/tags',
                },
                {
                    label: 'Category',
                    icon: 'pi pi-fw pi-hashtag',
                    to: '/blog-post/category',
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {session.data?.user?.role[0] == 'Writer'
                    ? writerModel.map((item, i) => {
                          return !item.seperator ? (
                              <AppMenuitem
                                  item={item}
                                  root={true}
                                  index={i}
                                  key={item.label}
                              />
                          ) : (
                              <li className="menu-separator"></li>
                          );
                      })
                    : adminModel.map((item, i) => {
                          return !item.seperator ? (
                              <AppMenuitem
                                  item={item}
                                  root={true}
                                  index={i}
                                  key={item.label}
                              />
                          ) : (
                              <li className="menu-separator"></li>
                          );
                      })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
