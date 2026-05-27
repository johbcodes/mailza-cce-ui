/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useLayoutEffect, useState, useContext, useEffect, ReactElement } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import {
	Checkbox,
	Container,
	Modal,
	Padding,
	Row,
	Text,
	Icon
} from '@zextras/carbonio-design-system';
import PropTypes from 'prop-types';
import { browserName } from 'react-device-detect';
import { useTranslation, Trans } from 'react-i18next';

import FormSelector from './form-selector';
import appStore from '../../assets/app-store.svg';
import backgroundImageRetina from '../../assets/carbonio_loginpage-retina.jpg';
import backgroundImage from '../../assets/carbonio_loginpage.jpg';
import logoCarbonio from '../../assets/logo-carbonio.png';
import playStore from '../../assets/play-store.svg';
import ServerNotResponding from '../components-index/server-not-responding';
import useScreenMode from '../components-index/use-screen-mode';
import useIsTouchDevice from '../components-index/use-touch-device';
import { ZimbraForm } from '../components-index/zimbra-form';
import {
	APP_STORE_URL,
	CARBONIO_LOGO_URL,
	DESKTOP,
	MOBILE,
	PLAY_STORE_URL,
	CARBONIO_CE_SUPPORTED_BROWSER_LINK,
	CARBONIO_SUPPORTED_BROWSER_LINK,
	CHROME,
	FIREFOX
} from '../constants';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';
import { useGetPrimaryColor } from '../primary-color/use-get-primary-color';
import { getLoginConfig } from '../services/login-page-services';
import { useLoginConfigStore } from '../store/login/store';
import { ThemeCallbacksContext } from '../theme-provider/theme-provider';
import { isSafeRedirect, prepareUrlForForward } from '../utils';

type LoginContainerProps = {
	backgroundImage: string;
	screenMode: string;
	isDefaultBg: boolean;
};

const LoginContainer = styled(Container)<LoginContainerProps>`
	padding: 0 100px;
	background: url(${(props): string => props.backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	${({ screenMode }): false | SerializedStyles =>
		screenMode !== DESKTOP &&
		css`
			padding: 0 12px;
			align-items: center;
		`}

	${({ isDefaultBg }): false | SerializedStyles =>
		isDefaultBg &&
		css`
			@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
				background: url(${backgroundImageRetina}) no-repeat 75% center/cover;
			}
		`}
`;

const FormContainer = styled.div<{ isWide?: boolean }>`
	max-width: 100%;
	max-height: 100vh;
	box-shadow: 0px 0px 20px -7px rgba(0, 0, 0, 0.3);
	${({ isWide }): false | SerializedStyles =>
		!!isWide &&
		css`
			width: 720px;
		`}
`;

const FormWrapper = styled(Container)<{ screenMode: string; isWide?: boolean }>`
	&& {
		height: auto;
		background: #ffffff;
		padding: 48px 48px 0;
		width: 436px;
		max-width: 100%;
		min-height: 620px;
		overflow-y: auto;
	}

	${({ isWide }): false | SerializedStyles =>
		!!isWide &&
		css`
			&& {
				width: 720px;
				min-height: auto;
				padding: 80px;
				max-height: 85vh;
			}
		`}

	${({ screenMode }): false | SerializedStyles =>
		screenMode !== DESKTOP &&
		css`
			&& {
				padding: 20px 20px 0;
				width: 360px;
				max-height: 100%;
				height: auto;
			}
		`}
`;

function DarkReaderListener(): React.JSX.Element | null {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const darkReaderResultValue = useDarkReaderResultValue();

	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkReaderState(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setDarkReaderState]);

	return null;
}

const getSafeRedirectUrl = (url: string | null): string | null => {
	if (url === null) return null;
	return isSafeRedirect(url) ? prepareUrlForForward(url) : '/';
};

export default function PageLayout({
	version,
	isAdvanced
}: {
	version?: number;
	isAdvanced: boolean;
}): React.JSX.Element | null {
	const [t] = useTranslation();
	type logoType = {
		image: string;
		width: string;
		url?: string;
	};

	const [logo, setLogo] = useState<logoType>();
	const [serverError, setServerError] = useState(false);

	const urlParams = new URLSearchParams(window.location.search);
	const safeRedirectUrl = getSafeRedirectUrl(urlParams.get('destinationUrl'));
	const [destinationUrl, setDestinationUrl] = useState(safeRedirectUrl);
	const [domain, setDomain] = useState(urlParams.get('domain') ?? destinationUrl);

	const [bg, setBg] = useState(backgroundImage);
	const [isDefaultBg, setIsDefaultBg] = useState(true);
	const [copyrightBanner, setCopyrightBanner] = useState('');
	// @ts-expect-error probably unused
	const { setDomainName, isOtpWizardActive } = useLoginConfigStore();
	const [showModal, setShowModal] = useState(true);
	const [showMobileAppModal, setShowMobileAppModal] = useState(true);
	const [doNotShowAgain, setDoNotShowAgain] = useState(false);
	const screenMode = useScreenMode();
	const isTouchDevice = useIsTouchDevice();

	useEffect(() => {
		const storedState = localStorage.getItem('doNotShowMobileAppModal');
		if (storedState) {
			setShowMobileAppModal(false);
		}
	}, []);

	const primaryColor = useGetPrimaryColor();
	const isSupportedBrowser = browserName === CHROME || browserName === FIREFOX;

	useLayoutEffect(() => {
		let componentIsMounted = true;

		if (isAdvanced) {
			getLoginConfig(version, domain, domain)
				.then((res) => {
					if (!destinationUrl) {
						const targetUrl = prepareUrlForForward(res.publicUrl);
						const safeDestinationUrl = isSafeRedirect(targetUrl) ? targetUrl : '/';
						setDestinationUrl(safeDestinationUrl);
					}
					if (!domain) setDomain(res.zimbraDomainName);
					setDomainName(res.zimbraDomainName);

					const _logo: logoType = { image: '', width: '221px', url: '' };

					if (componentIsMounted) {
						if (res.loginPageBackgroundImage) {
							setBg(res.loginPageBackgroundImage);
							setIsDefaultBg(false);
						}

						if (res.loginPageLogo) {
							_logo.image = res.loginPageLogo;
							_logo.width = '100%';
						} else {
							_logo.image = logoCarbonio;
							_logo.width = '221px';
						}

						if (res.loginPageSkinLogoUrl) {
							_logo.url = res.loginPageSkinLogoUrl;
						} else {
							_logo.url = '';
						}

						if (res.loginPageTitle) {
							document.title = res.loginPageTitle;
						} else {
							document.title = t('carbonio_authentication', 'Carbonio Authentication');
						}

						if (res.loginPageFavicon) {
							const existingOrNewLink =
								document.querySelector("link[rel*='icon']") || document.createElement('link');
							const link = existingOrNewLink as HTMLLinkElement;
							link.type = 'image/x-icon';
							link.rel = 'shortcut icon';
							link.href = res.loginPageFavicon;
							document.getElementsByTagName('head')[0].appendChild(link);
						}

						if (version === 3) {
							useLoginConfigStore.setState(res);

							if (res?.carbonioWebUiTitle) {
								document.title = res.carbonioWebUiTitle;
							}
							if (res?.carbonioWebUiFavicon) {
								const existingOrNewLink =
									document.querySelector("link[rel*='icon']") || document.createElement('link');
								const link = existingOrNewLink as HTMLLinkElement;
								link.type = 'image/x-icon';
								link.rel = 'shortcut icon';
								link.href = res.carbonioWebUiFavicon;
								document.getElementsByTagName('head')[0].appendChild(link);
							}
							if (res?.carbonioWebUiDarkMode) {
								if (res?.carbonioWebUiDarkLoginBackground) {
									setBg(res.carbonioWebUiDarkLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiDarkLoginLogo) {
									_logo.image = res.carbonioWebUiDarkLoginLogo;
									_logo.width = '100%';
								}
							} else {
								if (res?.carbonioWebUiLoginBackground) {
									setBg(res.carbonioWebUiLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiLoginLogo) {
									_logo.image = res.carbonioWebUiLoginLogo;
									_logo.width = '100%';
								}
							}

							if (res?.carbonioWebUiDescription) {
								setCopyrightBanner(res.carbonioWebUiDescription);
							}

							_logo.url = res?.carbonioLogoURL ? res.carbonioLogoURL : CARBONIO_LOGO_URL;
						}

						setLogo(_logo);
						useLoginConfigStore.setState({ loginLogo: _logo });
					}
				})
				.catch(() => {
					if (componentIsMounted) setServerError(true);
				});
		} else {
			setLogo({ image: logoCarbonio, width: '221px', url: CARBONIO_LOGO_URL });
			useLoginConfigStore.setState({
				loginLogo: { image: logoCarbonio, width: '221px', url: CARBONIO_LOGO_URL }
			});
			document.title = t('carbonio_authentication', 'Carbonio Authentication');
		}

		return (): void => {
			componentIsMounted = false;
		};
	}, [t, version, domain, destinationUrl, isAdvanced, setDomainName]);

	const LinkText = (props: { to?: string; children?: React.ReactNode }): ReactElement => {
		const { to, children } = props || {};
		return (
			<a
				href={to || '#'}
				target="_blank"
				rel="noreferrer"
				style={{
					textDecorationLine: 'underline',
					cursor: 'pointer',
					color: primaryColor || '#2b73d2'
				}}
			>
				{children}
			</a>
		);
	};

	if (serverError) return <ServerNotResponding />;

	if (logo) {
		const logoHtml = (
			<img
				alt="Logo"
				src={logo.image}
				width={logo.width}
				style={{
					maxWidth: '100%',
					maxHeight: '150px',
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
				data-testid="logo"
			/>
		);

		return (
			<div id="module-auth" className="auth-viewport" data-testid="login-container">
				<DarkReaderListener />
				<div className="auth-card-container">
					
					{/* Left Branding Panel */}
					<div className="auth-graphic-side">
						<div className="auth-logo-row">
							<div className="logo-mark">
                                {/* Use Carbonio logo config dynamically */}
								{logo.url ? (
									<a target="_blank" href={logo.url} rel="noreferrer">
										{logoHtml}
									</a>
								) : (
									logoHtml
								)}
							</div>
							<span className="logo-text brand-font">Mailza</span>
						</div>
						<div className="auth-graphic-content">
							<h1>Smarter B2B Collaboration for East African SMEs</h1>
							<p>Bring your emails, calendar schedules, workspace folders, and instant chats into one highly secure, consumer-grade desktop platform.</p>
							<div className="trusted-badge-row">
								<div className="badge-item"><span>256-bit Encryption</span></div>
								<div className="badge-item"><span>Instant Syncing</span></div>
							</div>
						</div>
					</div>
					
					{/* Right Form Control Panel */}
					<div className="auth-form-side">
						<div className="form-scroll-wrapper">
							<div className="auth-form-header">
								<h2 id="auth-welcome-header">Welcome back to Mailza</h2>
								<p className="text-muted" id="auth-welcome-subheader">Your secure B2B gateway for SME collaboration in East Africa.</p>
							</div>
							
							{/* Credentials Input Form (Delegated to Carbonio Components) */}
							<div className="auth-fields-stack">
								{isAdvanced ? (
									<FormSelector domain={domain} destinationUrl={destinationUrl} />
								) : (
									<ZimbraForm destinationUrl={destinationUrl} />
								)}
							</div>
							
							<div className="auth-form-footer">
								<span className="text-muted text-xs" id="auth-secure-badge">Industry-grade 256-bit secure collaboration layer</span>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		);
	}

	return null;
}

PageLayout.propTypes = {
	version: PropTypes.number,
	isAdvanced: PropTypes.bool.isRequired
};
