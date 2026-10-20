import React from 'react';
import {connect} from 'react-redux';

import {setPage, openPopout, closePopout} from "../store/router/actions";
import {isPremium, shouldShowBanners} from '../store/premium';

import bridge from '@vkontakte/vk-bridge'

import {
    Panel,
    Header,
    Group,
    SimpleCell,
    Banner,
    Alert,
    Box
} from '@vkontakte/vkui';
import Snackbar from '../components/AppSnackbar';
import PanelHeader from '../components/AppPanelHeader';

import {
    Icon28ChatsOutline,
    Icon28MicrophoneVideocamOutline,
    Icon28FaceRecognitionOutline,
    Icon28ClipOutline,
    Icon28HeartCircleOutline,
    Icon28InfoOutline,
    Icon28SneakerOutline
} from '@vkontakte/icons';

var BannerNew = true;

class Other extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            BannerNewStatus: BannerNew,
        };

        this.openSnackbar = this.openSnackbar.bind(this);
        this.openActionMemes = this.openActionMemes.bind(this);
        this.openActionClips = this.openActionClips.bind(this);
    }

    openActionMemes() {
        const {setPage} = this.props;

        this.props.openPopout(
            <Alert
                actions={[
                {
                    title: 'Отмена',
                    mode: 'cancel'
                },
                {
                    title: 'Открыть',
                    mode: 'destructive',
                    action: () => setPage('service', 'random')
                }
            ]}
            actionsLayout="horizontal"
            onClosed={() => this.props.closePopout()}
            title="Подтвердите действие"
            description="Мемы могут содержать ненормативный конент, вы хотите продолжить?"
            />
        );
    }

    openActionClips() {
        this.props.openPopout(
            <Alert
                actions={[
                {
                    title: 'Отмена',
                    mode: 'cancel',
                },
                {
                    title: 'Перейти',
                    mode: 'destructive',
                    action: () => window.open("https://vk.com/clips214477552", "_blank"),
                }
            ]}
            onClosed={() => this.props.closePopout()}
            title="Подтвердите действие"
            description="Клипы могут содержать ненормативный контент, вы хотите продолжить?"
            />
        );
    }

    openSnackbar () {
        bridge.send("VKWebAppTapticNotificationOccurred", {"type": "error"}); //вибро
        if (this.state.snackbar) return;
        this.setState({ snackbar:
          <Snackbar status="info"
            layout='vertical'
            onClosed={() => this.setState({ snackbar: null })}
          >
              Станет доступно совсем скоро..
          </Snackbar>
        });
      }

    render() {
        const {id, setPage} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader>Сервисы</PanelHeader>

                {this.props.showBanners && (!this.props.activePremium || this.state.BannerNewStatus) && <Box padding="system" className="StandaloneBanner"><Banner
                    mode="image" imageTheme="dark"
                    size="m"
                    title="Что-то новенькое! &#127881;"
                    subtitle={<span>Общение, развлечения, <br />здоровье и не только уже <br />доступно в данном разделе</span>}
                    background={
                    <div
                        style={{
                        backgroundColor: 'rgb(124, 169, 230)',
                        backgroundImage: 'url(https://i.postimg.cc/fWqJ2dd1/image.png)',
                        backgroundPosition: 'right bottom',
                        backgroundSize: '85%',
                        backgroundRepeat: 'no-repeat',
                        }}
                    />
                    }
                    after={this.props.activePremium ? 'dismiss' : undefined}
                    onDismiss={() => {
                        if (!this.props.activePremium) return;
                        this.setState({
                            BannerNewStatus: false
                        });
                        BannerNew = false;
                    }}
                /></Box>}

                <Group header={<Header size="s">Общение</Header>}>
                    <SimpleCell className="not__ready"
                    before={<Icon28MicrophoneVideocamOutline/>}
                    disabled
                    subtitle='Скоро в приложении'
                    //onClick={this.openSnackbar}
                    >
                        Голосовой и текстовый чат
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
                    before={<Icon28ChatsOutline/>}
                    href='https://vk.me/join/aDdSYMR_e_UrUqznz4AD0AtMfdYpvRtsj98=' target="_blank"
                    >
                        Общая беседа
                    </SimpleCell>
                </Group>

                <Group header={<Header size="s">Развлечения</Header>}>
                    <SimpleCell
                    before={<Icon28FaceRecognitionOutline/>}
                    //onClick={() => setPage('service', 'random')}
                    onClick={() => this.openActionMemes()}
                    >
                        Случайный мем
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
                    before={<Icon28ClipOutline/>}
                    href="https://vk.com/clips214477552" target="_blank"
                    //onClick={() => this.openActionClips()}
                    >
                        Эксклюзивные клипы
                    </SimpleCell>

                    <SimpleCell
                    before={<Icon28HeartCircleOutline/>}
                    onClick={() => setPage('service', 'sasha_fond')}
                    >
                        Благотворительность Саше
                    </SimpleCell>
                </Group>

                <Group header={<Header size="s">Здоровье</Header>}>
                    <SimpleCell
                    chevron="auto"
                    before={<Icon28InfoOutline/>}
                    onClick={() => bridge.send("VKWebAppOpenApp", {"app_id": 7362610})}
                    >
                        Главное о коронавирусе
                    </SimpleCell>

                    <SimpleCell
                    chevron="auto"
                    before={<Icon28SneakerOutline/>}
                    onClick={() => bridge.send("VKWebAppOpenApp", {"app_id": 7539087})}
                    >
                        Сходить на пробежку
                    </SimpleCell>
                </Group>

                {this.state.snackbar}

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    openPopout,
    closePopout
};

export default connect(state => ({showBanners: shouldShowBanners(state), activePremium: isPremium(state)}), mapDispatchToProps)(Other);
