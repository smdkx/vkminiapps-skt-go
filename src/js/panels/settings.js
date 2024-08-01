import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Div,
    Group,
    Button,
    FormItem,
    NativeSelect,
    Snackbar,
    Avatar,
    Header,
    SimpleCell,
    Switch,
    Card
} from "@vkontakte/vkui";

import {
    Icon16ErrorCircleOutline,
    Icon28HideOutline
} from "@vkontakte/icons";

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };

        this.openSnackbar = this.openSnackbar.bind(this);
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
              А, ой, что-то пошло не так. Настройки не были сохранены.
          </Snackbar>
        });
      }

    render() {
        const {id, goBack, setPage} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Настройки
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">
                            <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                            </div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__header">Временные неполадки</div>
                                <div className="CustomBanner__subheader">При сохранении настроек может появиться ошибка. Если это так – попробуйте зайти позже. Проблема известна, работаем над ее решением.</div>
                                <Button mode="tertiary" target="_blank" style={{paddingbefore: 4, paddingRight: 4}} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Перезагрузить сервер</Button>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group header={<Header mode='secondary'>Внешний вид</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            disabled
                            after={<Switch defaultChecked disabled/>}
                            before={<Icon28HideOutline />}
                            subtitle="Доступно Premium пользователям"
                            >
                                Отображение баннеров
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

                <Group header={<Header mode='secondary'>Основные настройки</Header>}>
                    <Div>
                        <Card size="l" mode="shadow">
                            <FormItem top="Место учебы">
                                <NativeSelect disabled>
                                <option>СКТ (ф) СПбГУТ</option>
                                </NativeSelect>
                            </FormItem>

                            <FormItem top="Факультет">
                                <NativeSelect disabled>
                                <option>Не выбрано</option>
                                </NativeSelect>
                            </FormItem>

                            <FormItem top="Группа">
                                <NativeSelect>
                                <option>Выберите группу</option>
                                <option>М9218</option>
                                <option>С9118</option>
                                <option>СП9318</option>
                                <option>СПу9418</option>
                                <option>КС9419</option>
                                <option>КС9518</option>
                                <option>КС9520</option>
                                <option>ПКС9620</option>
                                <option>ИСП9920/1</option>
                                <option>ПКС9720</option>
                                <option>ИСП9920/2</option>
                                <option>КС11519</option>
                                <option>КС11618</option>
                                <option>КС9517</option>
                                <option>М11320</option>
                                <option>ПКС9617</option>
                                <option>ПКС9717</option>
                                <option>ПКС9619</option>
                                <option>ПКС9718</option>
                                <option>ПКС11819</option>
                                <option>ПКС9818</option>
                                <option>ПКС11919</option>
                                <option>ПКС9719</option>
                                <option>С9119</option>
                                <option>М9219</option>
                                <option>СП9319</option>
                                <option>С9120</option>
                                <option>М9220</option>
                                <option>СП9420</option>
                                </NativeSelect>
                            </FormItem>
                        </Card>
                    </Div>
                </Group>

                <Div style={{display: 'flex'}}>
                    <Button onClick={() => setPage('profile', 'sasha')} size="l" stretched style={{ marginRight: 8 }}>Сохранить настройки</Button>
                </Div>

                {this.state.snackbar}

            </Panel>
        );
    }

}
const mapDispatchToProps = {
    goBack,
    setPage
};

export default connect(null, mapDispatchToProps)(Settings);