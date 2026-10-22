import React from 'react';
import {connect} from 'react-redux';
import {setPage, openPopout, closePopout} from '../store/router/actions';
import {isPremium, shouldShowBanners} from '../store/premium';
import {markHomeHighlightSeen} from '../store/homeHighlights';
import {sendBridgeRequest} from '../services/bridge';
import {Panel, Header, Group, SimpleCell, Banner, Tappable, Spinner} from '@vkontakte/vkui';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';
import MemesWarning from '../components/MemesWarning';
import {
    Icon20ArrowUpRightOutSquareOutline,
    Icon28ChatsOutline,
    Icon28MicrophoneVideocamOutline,
    Icon28FaceRecognitionOutline,
    Icon28ClipOutline,
    Icon28InfoOutline,
    Icon28SneakerOutline,
    Icon28SmileOutline,
} from '@vkontakte/icons';

let bannerVisible = true;

const miniApps = [
    {id: 7362610, title: 'Главное о коронавирусе', Icon: Icon28InfoOutline},
    {id: 7539087, title: 'Сходить на пробежку', Icon: Icon28SneakerOutline},
];

class Services extends React.Component {
    state = {snackbar: null, bannerVisible, openingApp: null};
    mounted = false;
    requestId = 0;

    componentDidMount() {
        this.mounted = true;
        if (this.props.active) this.markServicesSeen();
    }

    componentDidUpdate(previousProps) {
        if (this.props.active && !previousProps.active) this.markServicesSeen();
    }

    markServicesSeen = () => {
        this.props.markHomeHighlightSeen('services').catch(() => {
            if (this.mounted) this.setState({snackbar: <Snackbar
                onClosed={() => this.setState({snackbar: null})}
                action="Повторить" onActionClick={this.markServicesSeen}>Не удалось сохранить просмотр.</Snackbar>});
        });
    };

    componentWillUnmount() {
        this.mounted = false;
    }

    openMemes = () => {
        this.props.openPopout(<MemesWarning onConfirm={() => this.props.setPage('service', 'random')}
            onClosed={this.props.closePopout}/>);
    };

    openMiniApp = async appId => {
        if (this.state.openingApp) return;
        this.setState({openingApp: appId});
        const requestId = ++this.requestId;
        try {
            await sendBridgeRequest('VKWebAppOpenApp', {app_id: appId});
        } catch {
            if (this.mounted) this.setState({snackbar: <Snackbar key={requestId}
                onClosed={() => this.setState({snackbar: null})}>Не удалось открыть приложение.</Snackbar>});
        } finally {
            if (this.mounted) this.setState({openingApp: null});
        }
    };

    dismissBanner = () => {
        if (!this.props.activePremium) return;
        bannerVisible = false;
        this.setState({bannerVisible: false});
    };

    render() {
        const {id, showBanners, activePremium} = this.props;

        return <Panel id={id} mode="card">
            <PanelHeader>Сервисы</PanelHeader>
            <div className="ServicesLayout">
                {showBanners && (!activePremium || this.state.bannerVisible) && <Banner
                    className="ServicesIntro"
                    before={<span className="ServicesIcon"><Icon28SmileOutline aria-hidden="true"/></span>}
                    title="Время для себя"
                    subtitle="Общение, развлечения и полезные сервисы."
                    after={activePremium ? 'dismiss' : undefined}
                    onDismiss={this.dismissBanner}/>}

                <section className="ServicesShortcuts" aria-label="Развлечения">
                    <Tappable Component="button" type="button" className="ServicesShortcut ServicesShortcut--memes"
                        style={{borderRadius: 20}} onClick={this.openMemes}>
                        <span className="ServicesShortcut__top"><span className="ServicesIcon"><Icon28FaceRecognitionOutline aria-hidden="true"/></span></span>
                        <span className="ServicesShortcut__title">Случайный мем</span>
                        <span className="ServicesShortcut__description">Немного отвлечься от учебы</span>
                    </Tappable>
                    <Tappable Component="a" href="https://vk.com/clips214477552" target="_blank" rel="noopener noreferrer"
                        className="ServicesShortcut ServicesShortcut--clips" style={{borderRadius: 20}}>
                        <span className="ServicesShortcut__top"><span className="ServicesIcon"><Icon28ClipOutline aria-hidden="true"/></span>
                            <Icon20ArrowUpRightOutSquareOutline className="ServicesExternalIcon" aria-hidden="true"/></span>
                        <span className="ServicesShortcut__title">Эксклюзивные клипы</span>
                        <span className="ServicesShortcut__description">Короткие видео ВКонтакте</span>
                    </Tappable>
                </section>

                <Group mode="card" separator="hide" className="ServicesSection" header={<Header>Общение</Header>}>
                    <SimpleCell multiline style={{borderRadius: 0}}
                        before={<span className="ServicesIcon"><Icon28ChatsOutline aria-hidden="true"/></span>}
                        after={<Icon20ArrowUpRightOutSquareOutline className="ServicesExternalIcon" aria-hidden="true"/>}
                        subtitle="Знакомьтесь и общайтесь со студентами"
                        href="https://vk.me/join/aDdSYMR_e_UrUqznz4AD0AtMfdYpvRtsj98=" target="_blank" rel="noopener noreferrer">
                        Общая беседа
                    </SimpleCell>
                    <SimpleCell multiline disabled style={{borderRadius: 0}}
                        before={<span className="ServicesIcon ServicesIcon--muted"><Icon28MicrophoneVideocamOutline aria-hidden="true"/></span>}
                        subtitle="Скоро в приложении">Голосовой и текстовый чат</SimpleCell>
                </Group>

                <Group mode="card" separator="hide" className="ServicesSection" header={<Header>Здоровье</Header>}>
                    {miniApps.map(({id: appId, title, Icon}) => <SimpleCell key={appId} multiline
                        style={{borderRadius: 0}} disabled={this.state.openingApp !== null}
                        aria-busy={this.state.openingApp === appId}
                        before={<span className="ServicesIcon ServicesIcon--health"><Icon aria-hidden="true"/></span>}
                        after={this.state.openingApp === appId ? <Spinner size="s" aria-label="Открываем приложение"/> :
                            <Icon20ArrowUpRightOutSquareOutline className="ServicesExternalIcon" aria-hidden="true"/>}
                        subtitle="Мини-приложение VK" onClick={() => this.openMiniApp(appId)}>{title}</SimpleCell>)}
                </Group>

            </div>
            {this.state.snackbar}
        </Panel>;
    }
}

export default connect(state => ({
    showBanners: shouldShowBanners(state),
    activePremium: isPremium(state),
    active: state.router.activeStory === 'service' && state.router.activePanel === 'service_tab',
}), {setPage, openPopout, closePopout, markHomeHighlightSeen})(Services);
