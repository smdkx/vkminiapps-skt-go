import React from 'react';
import {connect} from 'react-redux';

import {setPage, openModal} from "../store/router/actions";

import { __version } from '../components/data/profile.data';

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelSpinner,
    Group,
    Header,
    SimpleCell,
    Snackbar,
    Gradient,
    Avatar,
    Title,
    Text,
    Button,
    Link,
    Card,
    Div
} from "@vkontakte/vkui";

import { 
    Icon28SettingsOutline,
    Icon28EducationOutline,
    Icon28Users3Outline,
    Icon28UsersOutline,
    Icon28FavoriteOutline, 
    Icon28ShareOutline,
    Icon28ServicesOutline, 
    Icon16CheckCircleOutline, 
    Icon16ErrorCircleOutline,
    Icon28EmployeeOutline
} from '@vkontakte/icons';

import AchievementsLogo from "../../img/achievements.png";

var FirstOpen = true;

let avatar_profile, first_name, last_name, sex;

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };

        this.AddToFavorites = this.AddToFavorites.bind(this);
        this.openSnackbar = this.openSnackbar.bind(this);
    }

    async componentDidMount() {

        if(FirstOpen) {
            FirstOpen = false;
            this.setState({
                loader: true
            });
        }

        await bridge.send('VKWebAppGetUserInfo').then((data) => {
            avatar_profile = data.photo_200;
            first_name = data.first_name;
            last_name = data.last_name;
            sex = data.sex;
        });

        this.setState({
            loader: false
        });
    }

    async AddToFavorites() { //функция добавления в избранное
        try {
            await bridge.send('VKWebAppAddToFavorites')
            bridge.send("VKWebAppTapticNotificationOccurred", {"type": "success"}); //вибро
                if (this.state.snackbar) return;
                this.setState({ snackbar:
                <Snackbar
                layout='vertical'
                onClose={() => this.setState({ snackbar: null })}
                before={<Avatar size={24} style={{ background: 'green' }}><Icon16CheckCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Сервис успешно добавлен в избранное!
                </Snackbar>
            })
        } catch (error) { //обработка ошибки
            bridge.send("VKWebAppTapticNotificationOccurred", {"type": "error"}); //вибро
            console.log(error);
            if (this.state.snackbar) return;
            this.setState({ snackbar:
            <Snackbar
            layout='vertical'
            onClose={() => this.setState({ snackbar: null })}
            before={<Avatar size={24} style={{ background: 'red' }}><Icon16ErrorCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
            >
                Произошла ошибка, попробуйте снова!
            </Snackbar>
            })
        }
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
              Достижения временно недоступны.
          </Snackbar>
        });
      }

    render() {
        const {id, setPage} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                left={
                    <PanelHeaderButton onClick={() => setPage('profile', 'settings')}>
                        <Icon28SettingsOutline />
                    </PanelHeaderButton>
                }
                >
                    Профиль
                </PanelHeader>

                <Group>
                    {this.state.loader ? <PanelSpinner/> : <Gradient style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: 15,
                    }}>
                        <Avatar size={96} src={avatar_profile} />
                        <Title style={{ marginBottom: 8, marginTop: 15 }} level="2" weight="medium">{first_name} {last_name}</Title>
                        <Text style={{ marginBottom: 20, color: 'var(--text_secondary)' }}>{sex === 1 ? "Студентка" : "Студент"}</Text>
                        <Button size="m" mode="secondary" onClick={() => setPage('profile', 'donate')}>Подробнее о VK Donut</Button>
                    </Gradient> }

                    <Group header={<Header mode='secondary' aside={<Link onClick={() => setPage('profile', 'achievements')}>Подробнее</Link>}>Достижения</Header>}>
                        <Div>
                            <Card size="l" mode="shadow">
                                <img width="330" height="96" src={AchievementsLogo} alt="achievements" className="Achievements_logo" />
                            </Card>
                        </Div>
                    </Group>
                </Group>

                <Group header={<Header mode='secondary'>Общая информация</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            disabled
                            before={<Icon28EducationOutline/>} 
                            description='СКТ (ф) СПбГУТ'
                            >
                                Место учебы
                            </SimpleCell>

                            <SimpleCell
                            disabled
                            before={<Icon28Users3Outline/>} 
                            description='Не указано'
                            >
                                Факультет
                            </SimpleCell>

                            <SimpleCell
                            disabled
                            before={<Icon28UsersOutline/>} 
                            description='Не указано'
                            >
                                Группа
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Дополнительно</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28FavoriteOutline/>} 
                            description='Добавляет сервис в избранные приложения'
                            onClick={this.AddToFavorites}
                            >
                                Добавить в избранное
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28ShareOutline/>} 
                            description='Поделитесь с друзьями нашим приложением'
                            onClick={() => bridge.send("VKWebAppShare", {"link": "https://vk.com/app7469712"})}
                            //onClick={() =>  bridge.send("VKWebAppShowWallPostBox", {"message": "Я использую SKT APP, а ты?"})}
                            >
                                Поделиться с друзьями
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Информация</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28EmployeeOutline/>} 
                            description='Показать всех разработчиков'
                            onClick={() => this.props.openModal('MODAL_PAGE_DEV_INFO')}
                            >
                                Разработчики
                            </SimpleCell>

                            <SimpleCell
                            disabled
                            before={<Icon28ServicesOutline/>} 
                            description={__version}
                            >
                                Версия приложения
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
    openModal
};

export default connect(null, mapDispatchToProps)(Profile);