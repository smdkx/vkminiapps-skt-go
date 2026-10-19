import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeader, PanelHeaderBack, Group, Div, Button, Title, Text, Footer, Card, Placeholder, Snackbar, Spinner} from '@vkontakte/vkui';
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
    state = {progressStatus: 'loading', screen: 'intro', mode: 'new', current: null, imageStatus: 'loading', request: 0, position: 0, snackbar: null};
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

    showMessage = message => {
        if (this.mounted) this.setState({snackbar: <Snackbar layout="vertical" onClose={() => {
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
                ? 'Откройте приложение во ВКонтакте.'
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
        this.setState({screen: 'image', current, imageStatus: 'loading', request,
            position: this.runTotal - this.queue.length, snackbar: null}, () => {
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
        this.props.saveMemeProgress().then(() => this.showMessage('История просмотров сохранена.')).catch(this.saveFailed);
    };

    render() {
        const {id, goBack, seen, saving, saveFailed} = this.props;
        const {progressStatus, screen, mode, current, imageStatus, request, position} = this.state;
        const remaining = this.unseen().length;
        const viewed = memeCatalog.length - remaining;
        const canReplay = seen.some(id => memeCatalog.some(meme => meme.id === id));

        return <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Мемы</PanelHeader>
            <Group>
                <Div className="MemePanel">
                    {progressStatus === 'loading' ? <div className="MemePanel__loading" role="status">
                        <Spinner size="medium"/><span>Загружаем историю просмотров…</span>
                    </div> : progressStatus === 'error' ? <Placeholder header="История просмотров"
                        action={<Button size="m" onClick={this.loadProgress}>Повторить загрузку</Button>}/>
                    : <React.Fragment>
                        {screen === 'intro' && <div className="MemePanel__intro">
                            <Title level="1" weight="2">Мемы без повторов</Title>
                            <Text>Покажем все мемы в случайном порядке. Просмотренные сохраним, чтобы в следующий раз начать с новых.</Text>
                            <Button size="l" stretched onClick={() => this.start('new')}>Погнали</Button>
                            {canReplay && <Button size="l" stretched mode="secondary" onClick={() => this.start('old')}>Посмотреть старые</Button>}
                        </div>}

                        {screen === 'image' && current && <React.Fragment>
                            <Text role="status" aria-live="polite" style={{marginBottom: 12}}>Мем {position} из {this.runTotal}</Text>
                            <Card mode="outline" className="MemePanel__image" aria-busy={imageStatus === 'loading'}>
                                {imageStatus === 'loading' && <div className="MemePanel__loading" role="status">
                                    <Spinner size="medium"/><span>Загружаем мем…</span>
                                </div>}
                                {imageStatus === 'error' ? <Placeholder header="Изображение мема"
                                    action={<Button size="m" onClick={this.retryImage}>Повторить загрузку</Button>}/>
                                : <img ref={this.image} key={request} src={current.src} className="random__block" alt="Мем из подборки"
                                    style={{display: imageStatus === 'ready' ? 'block' : 'none'}}
                                    onLoad={() => this.imageLoaded(request)} onError={() => this.imageFailed(request)}/>}
                            </Card>
                            <div className="MemePanel__actions">
                                <Button size="l" stretched onClick={this.showNext}>{imageStatus !== 'ready'
                                    ? 'Пропустить' : mode === 'old' ? 'Следующий старый мем' : 'Следующий мем'}</Button>
                                {mode === 'old' && <Button size="l" stretched mode="secondary" onClick={() => this.start('new')}>Вернуться к новым</Button>}
                            </div>
                        </React.Fragment>}

                        {screen === 'empty' && <Placeholder
                            header={mode === 'old' ? 'Старые мемы закончились' : remaining ? 'На этот раз всё' : 'Новых мемов пока нет'}
                            action={<div className="MemePanel__actions">
                                {mode === 'new' && remaining > 0 && <Button size="l" stretched onClick={() => this.start('new')}>Попробовать ещё раз</Button>}
                                {canReplay && <Button size="l" stretched mode="secondary" onClick={() => this.start('old')}>{mode === 'old' ? 'Посмотреть ещё раз' : 'Посмотреть старые'}</Button>}
                                {mode === 'old' && <Button size="l" stretched mode="secondary" onClick={() => this.start('new')}>Вернуться к новым</Button>}
                            </div>}
                        >{mode === 'old' ? 'Можно пересмотреть их ещё раз или вернуться к новым.'
                            : remaining ? 'Часть мемов вы пропустили или они не загрузились. Попробуйте открыть их ещё раз.'
                            : 'Вы посмотрели всю подборку. Пока новые мемы не появились, можно пересмотреть старые.'}</Placeholder>}

                        <Footer role="status" aria-live="polite">{mode === 'old' && screen === 'image'
                            ? `Старые мемы: показано ${this.runViewed} из ${this.runTotal}`
                            : `Просмотрено ${viewed} из ${memeCatalog.length} · Осталось ${remaining}`}</Footer>
                        <div className="MemePanel__actions">
                            {saveFailed && <Button size="l" stretched mode="secondary" loading={saving} disabled={saving} onClick={this.retrySave}>Сохранить просмотры</Button>}
                            <Button size="l" stretched mode="tertiary" onClick={goBack}>Вернуться к сервисам</Button>
                        </div>
                    </React.Fragment>}
                </Div>
            </Group>
            {this.state.snackbar}
        </Panel>;
    }
}

export default connect(({memes}) => ({seen: memes.seen, saving: memes.saving, saveFailed: memes.saveFailed}), {
    goBack, loadMemeProgress, markMemeSeen, saveMemeProgress,
})(Random);
