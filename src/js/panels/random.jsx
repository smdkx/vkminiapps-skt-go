import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Button, Title, Text, Footnote, Card, Spinner} from '@vkontakte/vkui';
import {Icon28SmileOutline, Icon28CheckCircleOutline, Icon28ErrorCircleOutline} from '@vkontakte/icons';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import {goBack} from '../store/router/actions';
import {memeCatalog, loadMemeProgress, markMemeSeen, saveMemeProgress} from '../store/memes';
import {hapticNotification} from '../services/bridge';

const shuffled = items => {
    const queue = [...items];
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
};

class Random extends React.Component {
    state = {progressStatus: 'loading', screen: 'intro', mode: 'new', current: null, imageStatus: 'loading', request: 0, snackbar: null};
    mounted = false;
    queue = [];
    request = 0;
    timer = null;
    runTotal = 0;
    runViewed = 0;
    image = React.createRef();

    componentDidMount() {
        this.mounted = true;
        this.loadProgress();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.request++;
        this.cancelImage();
    }

    unseen = () => memeCatalog.filter(meme => !this.props.seen.includes(meme.id));

    showMessage = (message, status = 'error') => {
        if (this.mounted) this.setState({snackbar: <Snackbar status={status} layout="vertical" onClosed={() => {
            if (this.mounted) this.setState({snackbar: null});
        }}>{message}</Snackbar>});
    };

    loadProgress = async () => {
        this.setState({progressStatus: 'loading', snackbar: null});
        try {
            await this.props.loadMemeProgress();
            if (this.mounted) this.setState({progressStatus: 'ready', screen: this.unseen().length ? 'intro' : 'empty'});
        } catch (error) {
            if (!this.mounted) return;
            this.setState({progressStatus: 'error'});
            this.showMessage(error && error.code === 'UNSUPPORTED_ENVIRONMENT'
                ? 'Откройте приложение внутри ВКонтакте.'
                : 'Не удалось загрузить историю просмотров.');
        }
    };

    start = mode => {
        this.queue = shuffled(memeCatalog.filter(meme => mode === 'old'
            ? this.props.seen.includes(meme.id) : !this.props.seen.includes(meme.id)));
        this.runTotal = this.queue.length;
        this.runViewed = 0;
        this.setState({mode}, this.showNext);
    };

    cancelImage = () => {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.image.current) this.image.current.removeAttribute('src');
    };

    showNext = () => {
        const request = ++this.request;
        this.cancelImage();
        const current = this.queue.shift();
        if (!current) {
            this.setState({screen: 'empty', current: null, snackbar: null});
            return;
        }
        this.setState({screen: 'image', current, imageStatus: 'loading', request, snackbar: null}, () => {
            if (!this.mounted || request !== this.request) return;
            this.timer = setTimeout(() => this.imageFailed(request,
                'Мем загружается слишком долго.'), 15000);
        });
    };

    retryImage = () => {
        if (!this.state.current) return;
        this.queue.unshift(this.state.current);
        this.showNext();
    };

    imageFailed = (request, message = 'Не удалось загрузить мем.') => {
        if (!this.mounted || request !== this.request || this.state.imageStatus !== 'loading') return;
        clearTimeout(this.timer);
        this.setState({imageStatus: 'error'});
        this.showMessage(message);
    };

    imageLoaded = request => {
        if (!this.mounted || request !== this.request || this.state.imageStatus !== 'loading') return;
        clearTimeout(this.timer);
        this.runViewed++;
        this.setState({imageStatus: 'ready'});
        hapticNotification('success');
        if (this.state.mode === 'new') {
            this.props.markMemeSeen(this.state.current.id).catch(this.saveFailed);
        }
    };

    saveFailed = () => this.showMessage('Не удалось сохранить просмотры.');

    retrySave = () => {
        this.setState({snackbar: null});
        this.props.saveMemeProgress().then(() => this.showMessage('История просмотров сохранена.', 'success')).catch(this.saveFailed);
    };

    render() {
        const {id, goBack, seen, saving, saveFailed, backLabel = 'Вернуться к сервисам'} = this.props;
        const {progressStatus, screen, mode, current, imageStatus, request} = this.state;
        const remaining = this.unseen().length;
        const viewed = memeCatalog.length - remaining;
        const canReplay = seen.some(id => memeCatalog.some(meme => meme.id === id));

        return <Panel id={id} mode="card">
            <PanelHeader before={<PanelHeaderBack aria-label={backLabel} onClick={goBack}/>}>Мемы</PanelHeader>
            <div className="MemesLayout">
                <div className="MemePanel">
                    {progressStatus === 'loading' ? <Group mode="card" padding="s" separator="hide" className="MemesSection">
                        <div className="MemePanel__loading" role="status">
                            <Spinner aria-label="Загрузка" size="l"/><span>Загружаем историю просмотров…</span>
                        </div>
                    </Group> : progressStatus === 'error' ? <Group mode="card" padding="s" separator="hide" className="MemesSection">
                        <div className="MemesState">
                            <span className="MemesState__icon"><Icon28ErrorCircleOutline aria-hidden="true"/></span>
                            <Title Component="h2" level="2" weight="2" className="MemesState__title">История просмотров</Title>
                            <Text className="MemesState__description">Повторите загрузку, чтобы продолжить просмотр.</Text>
                            <div className="MemePanel__actions">
                                <Button size="l" stretched onClick={this.loadProgress}>Повторить загрузку</Button>
                            </div>
                        </div>
                    </Group>
                    : <React.Fragment>
                        {screen === 'intro' && <Group mode="card" padding="s" separator="hide" className="MemesSection MemesIntro">
                            <div className="MemesIntro__content">
                                <span className="MemesIntro__icon"><Icon28SmileOutline width={32} height={32} aria-hidden="true"/></span>
                                <Title Component="h2" level="2" weight="2" className="MemesIntro__title">Немного отвлечемся</Title>
                                <Text className="MemesIntro__description">Случайные мемы без повторов. Просмотры сохраняются.</Text>
                            </div>
                            <div className="MemePanel__actions MemesIntro__actions">
                                <Button size="l" stretched onClick={() => this.start('new')}>Погнали</Button>
                                {canReplay && <Button size="l" stretched mode="secondary" onClick={() => this.start('old')}>Посмотреть старые</Button>}
                            </div>
                        </Group>}

                        {screen === 'image' && current && <Card Component="div" mode="plain" className="MemesViewer">
                            <div className="MemePanel__image" aria-busy={imageStatus === 'loading'}>
                                {imageStatus === 'loading' && <div className="MemePanel__loading" role="status">
                                    <Spinner aria-label="Загрузка" size="l"/><span>Загружаем мем…</span>
                                </div>}
                                {imageStatus === 'error' ? <div className="MemesState" role="status">
                                    <span className="MemesState__icon"><Icon28ErrorCircleOutline aria-hidden="true"/></span>
                                    <Title Component="h2" level="2" weight="2" className="MemesState__title">Мем не загрузился</Title>
                                    <Button size="m" onClick={this.retryImage}>Повторить загрузку</Button>
                                </div> : <img ref={this.image} key={request} src={current.src} className="random__block" alt="Мем из подборки"
                                    style={{display: imageStatus === 'ready' ? 'block' : 'none'}}
                                    onLoad={() => this.imageLoaded(request)} onError={() => this.imageFailed(request)}/>}
                            </div>
                            <div className="MemesViewer__controls">
                                <div className="MemePanel__actions">
                                    <Button size="l" stretched onClick={this.showNext}>{imageStatus !== 'ready'
                                        ? 'Пропустить' : mode === 'old' ? 'Следующий старый мем' : 'Следующий мем'}</Button>
                                    {mode === 'old' && <Button size="l" stretched mode="secondary" onClick={() => this.start('new')}>Вернуться к новым</Button>}
                                </div>
                            </div>
                        </Card>}

                        {screen === 'empty' && <Group mode="card" padding="s" separator="hide" className="MemesSection">
                            <div className="MemesState">
                                <span className="MemesState__icon"><Icon28CheckCircleOutline aria-hidden="true"/></span>
                                <Title Component="h2" level="2" weight="2" className="MemesState__title">
                                    {mode === 'old' ? 'Старые мемы закончились' : remaining ? 'На этот раз все' : 'Все мемы просмотрены'}
                                </Title>
                                <Text className="MemesState__description">{mode === 'old' ? 'Можно пересмотреть их еще раз или вернуться к новым.'
                                    : remaining ? 'Некоторые мемы пропущены или не загрузились. Попробуйте еще раз.'
                                    : 'Вы посмотрели всю подборку. Пока можно пересмотреть старые мемы.'}</Text>
                                <div className="MemePanel__actions">
                                    {mode === 'new' && remaining > 0 && <Button size="l" stretched onClick={() => this.start('new')}>Попробовать еще раз</Button>}
                                    {canReplay && <Button size="l" stretched mode={mode === 'old' || !remaining ? 'primary' : 'secondary'} onClick={() => this.start('old')}>
                                        {mode === 'old' ? 'Посмотреть еще раз' : 'Посмотреть старые'}
                                    </Button>}
                                    {mode === 'old' && <Button size="l" stretched mode="secondary" onClick={() => this.start('new')}>Вернуться к новым</Button>}
                                </div>
                            </div>
                        </Group>}

                        <Footnote Component="p" className="MemePanel__stats" role="status" aria-live="polite">{mode === 'old' && screen === 'image'
                            ? `Старые мемы: показано ${this.runViewed} из ${this.runTotal}`
                            : `Просмотрено ${viewed} из ${memeCatalog.length} · Осталось ${remaining}`}</Footnote>
                        {saveFailed && <Button size="l" stretched mode="secondary" loading={saving} disabled={saving} onClick={this.retrySave}>Сохранить просмотры</Button>}
                    </React.Fragment>}
                </div>
            </div>
            {this.state.snackbar}
        </Panel>;
    }
}

export default connect(({memes}) => ({seen: memes.seen, saving: memes.saving, saveFailed: memes.saveFailed}), {
    goBack, loadMemeProgress, markMemeSeen, saveMemeProgress,
})(Random);
