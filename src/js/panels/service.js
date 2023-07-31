import React from 'react';
import {connect} from 'react-redux';

import {setPage, openPopout, closePopout} from "../store/router/actions";

import bridge from '@vkontakte/vk-bridge'

import {
    Panel,
    PanelHeader,
    Header,
    Group,
    Snackbar,
    Avatar,
    SimpleCell,
    Banner,
    Alert,
    Card,
    Div
} from "@vkontakte/vkui";

import { 
    Icon16ErrorCircleOutline,
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
                    autoclose: true,
                    mode: 'cancel'
                }, 
                {
                    title: 'Открыть',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => setPage('service', 'random')
                }
            ]}
            onClose={() => this.props.closePopout()}
            header="Подтвердите действие"
            text="Мемы могут содержать ненормативный конент, вы хотите продолжить?"
            />
        );
    }

    openActionClips() {
        this.props.openPopout(
            <Alert
                actions={[
                {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel',
                }, 
                {
                    title: 'Перейти',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => window.open("https://vk.com/clips214477552", "_blank"),
                }
            ]}
            onClose={() => this.props.closePopout()}
            header="Подтвердите действие"
            text="Клипы могут содержать ненормативный контент, вы хотите продолжить?"
            />
        );
    }

    openSnackbar () {
        bridge.send("VKWebAppTapticNotificationOccurred", {"type": "error"}); //вибро
        if (this.state.snackbar) return;
        this.setState({ snackbar:
          <Snackbar
            layout='vertical'
            onClose={() => this.setState({ snackbar: null })}
            before={<Avatar size={24} style={{ background: 'red' }}><Icon16ErrorCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
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
                
                {this.state.BannerNewStatus && <Banner
                    mode="image"
                    size="m"
                    header="Что-то новенькое! &#127881;"
                    subheader={<span>Общение, развлечения, <br />здоровье и не только уже <br />доступно в данном разделе</span>}
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
                    //asideMode="dismiss"
                    onDismiss={() => {
                        this.setState({
                            BannerNewStatus: false
                        });
                        BannerNew = false;
                    }}
                />}

                <Group header={<Header mode="secondary">Общение</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell className="not__ready"
                            before={<Icon28MicrophoneVideocamOutline/>} 
                            disabled
                            description='Скоро в приложении'
                            //onClick={this.openSnackbar}
                            >
                                Голосовой и текстовый чат
                            </SimpleCell>

                            <SimpleCell 
                            expandable = 'true' 
                            before={<Icon28ChatsOutline/>} 
                            href='https://vk.me/join/aDdSYMR_e_UrUqznz4AD0AtMfdYpvRtsj98=' target="_blank"
                            >
                                Общая беседа
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode="secondary">Развлечения</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28FaceRecognitionOutline/>} 
                            //onClick={() => setPage('service', 'random')}
                            onClick={() => this.openActionMemes()}
                            >
                                Случайный мем
                            </SimpleCell>

                            <SimpleCell
                            expandable = 'true' 
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
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode="secondary">Здоровье</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            expandable = 'true'
                            before={<Icon28InfoOutline/>} 
                            onClick={() => bridge.send("VKWebAppOpenApp", {"app_id": 7362610})}
                            >
                                Главное о коронавирусе
                            </SimpleCell>

                            <SimpleCell 
                            expandable = 'true'
                            before={<Icon28SneakerOutline/>} 
                            onClick={() => bridge.send("VKWebAppOpenApp", {"app_id": 7539087})}
                            >
                                Сходить на пробежку
                            </SimpleCell>
                        </Card>
                    </Div>
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

export default connect(null, mapDispatchToProps)(Other);