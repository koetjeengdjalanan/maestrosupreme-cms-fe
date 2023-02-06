import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import { LayoutContext } from './context/layoutcontext';
import { TieredMenu } from 'primereact/tieredmenu';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const AppTopbar = forwardRef((props, ref) => {
  const { layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const profileMenuButtonRef = useRef(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  const items = [
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user-edit',
      command: () => {
        router.push('/user');
      },
    },
    {
      separator: true,
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        signOut({ redirect: true, callbackUrl: '/login' });
      },
      // onclick: { handleSignOut },
    },
  ];
  return (
    <div className="layout-topbar">
      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        style={{ marginLeft: 0, marginRight: 2 + 'em' }}
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>
      <Link legacyBehavior href="/">
        <a className="layout-topbar-logo">
          <>
            <Image
              src={`${contextPath}/layout/images/ms-logo.svg`}
              width={47.22}
              height={35}
              // widt={'true'}
              alt="logo"
            />
            <span>MaestroSupreme-CMS</span>
          </>
        </a>
      </Link>
      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>
      <div
        ref={topbarmenuRef}
        className={classNames('layout-topbar-menu', {
          'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
        })}
      >
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={() => {
            router.push('/user/management');
          }}
        >
          <i className="pi pi-sitemap"></i>
          <span>CMS Management</span>
        </button>
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={tog => profileMenuButtonRef.current.toggle(tog)}
          model={items}
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
          <TieredMenu model={items} popup ref={profileMenuButtonRef} />
        </button>
      </div>
    </div>
  );
});
AppTopbar.displayName = 'AppTopBar';

export default AppTopbar;
