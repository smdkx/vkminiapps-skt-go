import React from 'react';
import {Panel, PanelHeaderBack, Group, Title, Text, Header, Box} from '@vkontakte/vkui';
import {Icon20CheckCircleOutline, Icon20LockOutline, Icon20InfoCircleOutline} from '@vkontakte/icons';
import PanelHeader from './AppPanelHeader';
import AchievementIcon from './AchievementIcon';

// Only the shared presentation lives here. Awarding and verification stay in each panel.
export default function AchievementDetails({id, goBack, title, description, achievement = id, earnedAt, loaded, progress, actions, snackbar}) {
    const StatusIcon = earnedAt ? Icon20CheckCircleOutline : loaded ? Icon20LockOutline : Icon20InfoCircleOutline;
    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Достижение</PanelHeader>
        <div className="AchievementDetailsLayout">
            <Group mode="card" separator="hide" className={`AchievementSection AchievementDetailsHero${earnedAt ? ' AchievementDetailsHero--earned' : ''}`}>
                <div className="AchievementDetailsHero__content">
                    <AchievementIcon achievement={achievement} earned={Boolean(earnedAt)} large/>
                    <div className="AchievementDetailsHero__identity">
                        <Title level="2" weight="2" className="AchievementDetailsHero__title">{title}</Title>
                        <Text normalize={false} role="status" aria-live="polite" className={`AchievementStatus${earnedAt ? ' AchievementStatus--earned' : ''}`}>
                            <StatusIcon aria-hidden="true"/>
                            <span>{earnedAt ? 'Достижение получено' : loaded ? 'Достижение не получено' : 'Статус неизвестен'}</span>
                        </Text>
                    </div>
                </div>
            </Group>
            <Group mode="card" separator="hide" className="AchievementSection" header={<Header>Как получить</Header>}>
                <Box padding="system" className="AchievementDetails__condition">
                    <Text className="AchievementDetails__description">{description}</Text>
                    {!earnedAt && progress}
                    {!earnedAt && actions && <div className="AchievementDetails__actions">{actions}</div>}
                </Box>
            </Group>
        </div>
        {snackbar}
    </Panel>;
}
