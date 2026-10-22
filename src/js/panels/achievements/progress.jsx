import React from 'react';
import {connect} from 'react-redux';
import {Button, Progress, Text, Spinner} from '@vkontakte/vkui';
import AchievementDetails from '../../components/AchievementDetails';
import Snackbar from '../../components/AppSnackbar';
import MemesWarning from '../../components/MemesWarning';
import {achievementCatalog} from '../../components/data/achievements.data';
import {loadAchievements, awardProgressAchievements, getProgressAchievement} from '../../store/achievements';
import {loadStudentSettings} from '../../store/studentSettings';
import {loadMemeProgress} from '../../store/memes';
import {goBack, setPage, openPopout, closePopout} from '../../store/router/actions';

class ProgressAchievement extends React.Component {
    state = {loading: true, failed: false, snackbar: null};
    mounted = false;
    pending = false;

    componentDidMount() {
        this.mounted = true;
        this.load();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    openSection = () => {
        const {id, setPage, openPopout, closePopout} = this.props;
        if (id === 'mygroup') setPage('profile', 'settings');
        else openPopout(<MemesWarning onConfirm={() => setPage('profile', 'random')} onClosed={closePopout}/>);
    };

    load = async () => {
        if (this.pending) return;
        this.pending = true;
        this.setState({loading: true, failed: false, snackbar: null});
        try {
            const results = await Promise.allSettled([
                this.props.loadAchievements(),
                this.props.id === 'mygroup' ? this.props.loadStudentSettings() : this.props.loadMemeProgress(),
            ]);
            if (results.some(result => result.status === 'rejected')) throw new Error('Не удалось загрузить прогресс.');
            await this.props.awardProgressAchievements();
        } catch {
            if (this.mounted) this.setState({failed: true, snackbar: <Snackbar action="Повторить" onActionClick={this.load}
                onClosed={() => { if (this.mounted) this.setState({snackbar: null}); }}>Не удалось проверить достижение.</Snackbar>});
        } finally {
            this.pending = false;
            if (this.mounted) this.setState({loading: false});
        }
    };

    render() {
        const {id, goBack, earnedAt, loaded, progress} = this.props;
        const item = achievementCatalog.find(item => item.id === id);
        const group = id === 'mygroup';
        const current = Math.min(progress.current, progress.total);
        return <AchievementDetails id={id} goBack={goBack} title={item.title} description={group
            ? 'Выбрать группу в настройках профиля и сохранить изменения.'
            : id === 'memologist' ? 'Посмотреть 25 разных мемов. Повторные просмотры не учитываются.'
                : 'Посмотреть все мемы из текущего каталога. Полученное достижение останется при добавлении новых мемов.'}
            earnedAt={earnedAt} loaded={loaded} snackbar={this.state.snackbar}
            progress={<div className="AchievementDetails__progress">
                {this.state.loading ? <Spinner size="s" aria-label="Загрузка прогресса"/> : progress.loaded && <>
                    <Text>{group ? `Прогресс: ${current} из 1` : `Просмотрено: ${current} из ${progress.total}`}</Text>
                    <Progress height={6} value={progress.total ? current / progress.total * 100 : 0}
                        aria-label="Прогресс достижения" aria-valuetext={`${current} из ${progress.total}`}/>
                </>}
            </div>}
            actions={<>
                <Button size="l" stretched onClick={this.openSection}>
                    {group ? 'Выбрать группу' : 'Смотреть мемы'}
                </Button>
                {this.state.failed && <Button size="l" stretched mode="secondary" onClick={this.load}>Повторить проверку</Button>}
            </>}/>;
    }
}

export default connect((state, {id}) => ({
    earnedAt: state.achievements.earned[id],
    loaded: state.achievements.loaded,
    progress: getProgressAchievement(state, id),
}), {goBack, setPage, openPopout, closePopout, loadAchievements, loadStudentSettings, loadMemeProgress, awardProgressAchievements})(ProgressAchievement);
