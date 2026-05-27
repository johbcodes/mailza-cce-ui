/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { useLogo } from '../store/login/hooks';
import { useLoginConfigStore } from '../store/login/store';

export const Logo = (props: Record<string, unknown>): React.JSX.Element => {
	const loaded = useLoginConfigStore((s) => s.loaded);

	return loaded ? (
		<img alt="Mailza" {...props} src="/static/iris/mailza-logo.png" style={{ height: '32px', objectFit: 'contain' }} />
	) : (
		<></>
	);
};
