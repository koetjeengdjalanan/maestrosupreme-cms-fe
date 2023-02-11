import { signOut, useSession } from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PrimeReact from 'primereact/api';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { DomHandler, classNames } from 'primereact/utils';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import AppConfig from './AppConfig';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import { LayoutContext } from './context/layoutcontext';
import Loader from '@/components/Loader';

export default function Layout(props) {
    const router = useRouter();
    const session = useSession();
    // console.log(router.pathname);
    // console.log(session);

    useEffect(() => {
        if (session?.data?.error) {
            signOut({
                callbackUrl: router.pathname,
                redirect: '/login',
            }); // Force sign in to hopefully resolve error
        }
    }, [router.pathname, session]);

    useEffect(() => {
        const redirect = () => {
            if (session.status === 'authenticated') return;
            if (session.status === 'unauthenticated') {
                router.replace(
                    {
                        pathname: '/login',
                        query: {
                            unauthorized: true,
                            callbackURL: encodeURI(router.asPath),
                        },
                    },
                    '/login',
                    { shallow: true }
                );
            }
        };
        return redirect();
    }, [router, session.status]);

    const { layoutConfig, layoutState, setLayoutState } =
        useContext(LayoutContext);
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
        useEventListener({
            type: 'click',
            listener: event => {
                const isOutsideClicked = !(
                    sidebarRef.current.isSameNode(event.target) ||
                    sidebarRef.current.contains(event.target) ||
                    topbarRef.current.menubutton.isSameNode(event.target) ||
                    topbarRef.current.menubutton.contains(event.target)
                );

                if (isOutsideClicked) {
                    hideMenu();
                }
            },
        });

    const [
        bindProfileMenuOutsideClickListener,
        unbindProfileMenuOutsideClickListener,
    ] = useEventListener({
        type: 'click',
        listener: event => {
            const isOutsideClicked = !(
                topbarRef.current.topbarmenu.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        },
    });

    const hideMenu = useCallback(() => {
        setLayoutState(prevLayoutState => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
        }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    }, [setLayoutState, unbindMenuOutsideClickListener]);

    const hideProfileMenu = useCallback(() => {
        setLayoutState(prevLayoutState => ({
            ...prevLayoutState,
            profileSidebarVisible: false,
        }));
        unbindProfileMenuOutsideClickListener();
    }, [setLayoutState, unbindProfileMenuOutsideClickListener]);

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    useEffect(() => {
        if (
            layoutState.overlayMenuActive ||
            layoutState.staticMenuMobileActive
        ) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [
        layoutState.overlayMenuActive,
        layoutState.staticMenuMobileActive,
        bindMenuOutsideClickListener,
    ]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [
        layoutState.profileSidebarVisible,
        bindProfileMenuOutsideClickListener,
    ]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
        return () =>
            router.events.on('routeChangeComplete', () => {
                hideMenu();
                hideProfileMenu();
            });
    }, [hideMenu, hideProfileMenu, router.events]);

    PrimeReact.ripple = true;

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-theme-light': layoutConfig.colorScheme === 'light',
        'layout-theme-dark': layoutConfig.colorScheme === 'dark',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive':
            layoutState.staticMenuDesktopInactive &&
            layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple,
    });

    if (session.status === 'loading') {
        return <Loader />;
    }

    return (
        <React.Fragment>
            <Head>
                <title>Maestro Supreme CMS</title>
                <meta charSet="UTF-8" />
                <meta
                    name="description"
                    content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="Maestro Supreme CMS"></meta>
                <meta
                    property="og:url"
                    content="https://www.primefaces.org/sakai-react"
                ></meta>
                <meta
                    property="og:description"
                    content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
                />
                <meta
                    property="og:image"
                    content="https://www.primefaces.org/static/social/sakai-nextjs.png"
                ></meta>
                <meta property="og:ttl" content="604800"></meta>
                <link
                    rel="icon"
                    href={`${contextPath}/favicon.ico`}
                    type="image/x-icon"
                ></link>
            </Head>

            <div className={containerClass}>
                <AppTopbar ref={topbarRef} />
                <div ref={sidebarRef} className="layout-sidebar">
                    <AppSidebar />
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">{props.children}</div>
                    <AppFooter />
                </div>
                <AppConfig />
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
}
