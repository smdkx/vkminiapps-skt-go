import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Header, Title, Text, Box, Progress, Tappable, Spinner, Button} from '@vkontakte/vkui';
import {Icon28CupOutline, Icon20CheckCircleOutline, Icon20LockOutline, Icon20InfoCircleOutline} from '@vkontakte/icons';
import {goBack, setPage} from '../store/router/actions';
import {loadAchievements} from '../store/achievements';
import {achievementCatalog} from '../components/data/achievements.data';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import AchievementIcon from '../components/AchievementIcon';

const categories = [{id: 'main', title: 'Основные'}, {id: 'extra', title: 'Второстепенные'}];

class Achievements extends React.Component {
    state = {snackbar: null, loading: true};
    mounted = false;
    pending = false;

    componentDidMount() {
        this.mounted = true;
        this.load();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    load = async () => {
        if (this.pending) return;
        this.pending = true;
        this.setState({loading: true, snackbar: null});
        try {
            await this.props.loadAchievements();
        } catch (error) {
            if (this.mounted) this.setState({snackbar: <Snackbar action="Повторить" onActionClick={this.load}
                onClosed={() => { if (this.mounted) this.setState({snackbar: null}); }}>
                Не удалось загрузить достижения.
            </Snackbar>});
        } finally {
            this.pending = false;
            if (this.mounted) this.setState({loading: false});
        }
    };

    render() {
        const {id, goBack, setPage, earned, loaded} = this.props;
        const received = achievementCatalog.filter(item => earned[item.id]).length;
        const total = achievementCatalog.length;
        return <Panel id={id} mode="card">
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Достижения</PanelHeader>
            <div className="AchievementsLayout">
                <Group mode="card" separator="hide" className="AchievementSection AchievementsSummary">
                    <Box padding="system" className="AchievementsSummary__content">
                        <div className="AchievementsSummary__heading">
                            <span className="AchievementsSummary__icon"><Icon28CupOutline width={32} height={32} aria-hidden="true"/></span>
                            <div>
                                <Text className="AchievementsSummary__eyebrow">Мой прогресс</Text>
                                <Title level="2" weight="2" className="AchievementsSummary__value">{loaded ? `${received} из ${total}` : 'Моя коллекция'}</Title>
                            </div>
                        </div>
                        {loaded ? <>
                            <Progress height={6} value={received / total * 100} aria-label="Прогресс достижений"
                                aria-valuetext={`Получено ${received} из ${total}`}/>
                            <Text className="AchievementsSummary__hint">{received === total ? 'Вся коллекция собрана!' : `Осталось: ${total - received}`}</Text>
                        </> : this.state.loading ? <div className="AchievementsSummary__loading" role="status">
                            <Spinner size="s" aria-label="Загрузка достижений"/><Text>Загружаем достижения...</Text>
                        </div> : <Button size="l" mode="secondary" stretched onClick={this.load}>Повторить загрузку</Button>}
                    </Box>
                </Group>

                {categories.map(category => {
                    const items = achievementCatalog.filter(item => item.category === category.id);
                    const count = items.filter(item => earned[item.id]).length;
                    return <section key={category.id} className="AchievementsCategory" aria-labelledby={`achievements-${category.id}`}>
                        <Header id={`achievements-${category.id}`} indicator={loaded ? `${count} / ${items.length}` : undefined}>{category.title}</Header>
                        <div className="AchievementGrid">
                            {items.map(item => {
                                const received = Boolean(earned[item.id]);
                                const status = received ? 'Получено' : loaded ? 'Не получено' : 'Статус неизвестен';
                                const StatusIcon = received ? Icon20CheckCircleOutline : loaded ? Icon20LockOutline : Icon20InfoCircleOutline;
                                return <Tappable key={item.id} Component="button" type="button"
                                    className={`AchievementCard${received ? ' AchievementCard--earned' : ''}`}
                                    onClick={() => setPage('profile', item.id)} aria-label={`Достижение «${item.title}»: ${status.toLowerCase()}`}>
                                    <AchievementIcon achievement={item.id} earned={received}/>
                                    <span className="AchievementCard__title">{item.title}</span>
                                    <span className="AchievementCard__description">{item.description}</span>
                                    <span className={`AchievementStatus${received ? ' AchievementStatus--earned' : ''}`}>
                                        <StatusIcon width={16} height={16} aria-hidden="true"/><span>{loaded || received ? status : 'Неизвестно'}</span>
                                    </span>
                                </Tappable>;
                            })}
                        </div>
                    </section>;
                })}
            </div>
            {this.state.snackbar}
        </Panel>;
    }
}

export default connect(({achievements}) => ({earned: achievements.earned, loaded: achievements.loaded}), {
    goBack, setPage, loadAchievements,
})(Achievements);
