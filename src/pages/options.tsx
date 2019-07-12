import React, { useState, useEffect, FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'Store';
import { setActiveTheme } from 'Store/user/actions';
import { saveSettings, getBadgeDisplayOpt, Theme, BadgeDisplay, isTheme, isBadgeDisplayOpt } from 'Modules/settings';
import { sendIsomorphicMessage, IsomorphicMessage } from 'Comms/isomorphic';
import styled from 'Styles';
import Button from 'Components/button';

const Page = styled.main`
	padding: 2.5rem;
`;

const OptionsPage: FC = () => {
	const activeTheme = useSelector(state => state.user.activeTheme);
	const dispatch = useDispatch();

	// TODO I feel like this theme state isn't needed
	const [themeOpt, setThemeOpt] = useState(activeTheme);
	const [badgeOpt, setBadgeOpt] = useState(BadgeDisplay.WithCount);

	useEffect(() => {
		getBadgeDisplayOpt().run().then((res) => {
			res.ifJust(setBadgeOpt);
		});
	}, []);

	useEffect(() => {
		setThemeOpt(activeTheme);
	}, [activeTheme]);

	const handleThemeOptChange = (evt: FormEvent<HTMLSelectElement>) => {
		const themeOpt = evt.currentTarget.value;
		if (!isTheme(themeOpt)) return;

		setThemeOpt(themeOpt);
	};

	const handleBadgeOptChange = (evt: FormEvent<HTMLSelectElement>) => {
		const badgeOpt = evt.currentTarget.value;
		if (!isBadgeDisplayOpt(badgeOpt)) return;

		setBadgeOpt(badgeOpt);
	};

	const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();

		dispatch(setActiveTheme(themeOpt));
		sendIsomorphicMessage(IsomorphicMessage.SettingsUpdated);
		saveSettings({ theme: themeOpt, badgeDisplay: badgeOpt });
	};

	return (
		<Page>
			<form onSubmit={handleSubmit}>
				Theme:&nbsp;
				<select value={themeOpt} onChange={handleThemeOptChange}>
					<option value={Theme.Light}>Light</option>
					<option value={Theme.Dark}>Dark</option>
				</select>

				<br />
				<br />
				Badge:&nbsp;
				<select value={badgeOpt} onChange={handleBadgeOptChange}>
					<option value={BadgeDisplay.WithCount}>Badge with count</option>
					<option value={BadgeDisplay.WithoutCount}>Badge without count</option>
					<option value={BadgeDisplay.None}>No badge</option>
				</select>

				<br />
				<br />
				<Button type="submit">Save Settings</Button>
			</form>
		</Page>
	);
};

export default OptionsPage;
