import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Avatar, Footnote, Group, Header, Panel, PanelHeaderBack, SimpleCell, Spinner} from '@vkontakte/vkui';
import {
    Icon201CircleFillGold, Icon202CircleFillSilver, Icon203CircleFillBronze,
    Icon20DonutCoinCircleFillYellow, Icon20FireCircleFillRed, Icon28UserStarBadgeOutline,
} from '@vkontakte/icons';
import UserAvatar from '../components/UserAvatar';
import useUserPhotos from '../hooks/useUserPhotos';
import {markHomeHighlightSeen} from '../store/homeHighlights';
import {goBack, openModal} from '../store/router/actions';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import {topStudents} from '../components/data/topStudents.data';

const userIds = topStudents.map(student => student.id);
const placeIcons = [Icon201CircleFillGold, Icon202CircleFillSilver, Icon203CircleFillBronze];

function TopStudent({id, goBack, openModal, active, markHomeHighlightSeen}) {
    const {photos, loading, error, retry} = useUserPhotos(userIds, active);
    const [snackbar, setSnackbar] = useState(null);

    useEffect(() => {
        let cancelled = false;
        if (active) markHomeHighlightSeen('top_students').catch(() => {
            if (!cancelled) setSnackbar(<Snackbar onClosed={() => setSnackbar(null)}>
                Не удалось сохранить просмотр.
            </Snackbar>);
        });
        return () => { cancelled = true; };
    }, [active, markHomeHighlightSeen]);

    useEffect(() => {
        if (!active || !error) {
            setSnackbar(null);
            return;
        }
        const notification = <Snackbar key={`photos-${error.attempt}`} duration={10000}
            onClosed={() => setSnackbar(current => current === notification ? null : current)}
            action="Повторить" onActionClick={() => { setSnackbar(null); retry(); }}>
            {error.message}
        </Snackbar>;
        setSnackbar(notification);
    }, [active, error, retry]);

    return <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>Топ студентов</PanelHeader>
        <div className="TopStudentsLayout">
            <Group mode="card" separator="hide" className="TopStudents__list" header={<Header after={
                <span className="TopStudents__headerInfo">
                    <span className="TopStudents__loading">{loading && <Spinner size="s" aria-label="Загрузка фотографий"/>}</span>
                    <Footnote>{topStudents.length} участников</Footnote>
                </span>
            }>Участники</Header>}>
                {topStudents.map((student, index) => {
                    const PlaceIcon = placeIcons[index];
                    const BadgeIcon = student.badge === 'creator' ? Icon20FireCircleFillRed : Icon20DonutCoinCircleFillYellow;
                    return <SimpleCell key={student.id} multiline chevron="auto"
                        className={`TopStudents__row${index < 3 ? ` TopStudents__row--${index + 1}` : ''}`}
                        href={`https://vk.com/id${student.id}`} target="_blank" rel="noopener noreferrer"
                        subtitle={student.subtitle} before={<div className="TopStudents__before">
                            <span className="TopStudents__rank" role="img" aria-label={`${index + 1} место`}>
                                {PlaceIcon ? <PlaceIcon width={24} height={24} aria-hidden="true"/> : index + 1}
                            </span>
                            <UserAvatar size={48} src={photos[student.id]} name={student.name}>
                                {student.badge && <Avatar.Badge role="img" aria-label={student.badge === 'creator' ? 'Создатель приложения' : 'Поддержка приложения'}>
                                    <BadgeIcon aria-hidden="true"/>
                                </Avatar.Badge>}
                            </UserAvatar>
                        </div>}>
                        {student.name}
                    </SimpleCell>;
                })}
                <SimpleCell multiline chevron="always" className="TopStudents__join" style={{borderRadius: 0}} subtitle="Узнать условия участия"
                    before={<span className="TopStudents__joinIcon"><Icon28UserStarBadgeOutline aria-hidden="true"/></span>}
                    onClick={() => openModal('MODAL_PAGE_TOP_INFO')}>
                    Как попасть в топ
                </SimpleCell>
            </Group>
        </div>
        {snackbar}
    </Panel>;
}

const mapStateToProps = ({router}) => ({
    active: router.activeStory === 'home' && router.activePanel === 'top_student',
});

export default connect(mapStateToProps, {goBack, openModal, markHomeHighlightSeen})(TopStudent);
