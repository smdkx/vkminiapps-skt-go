import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    SimpleCell,
    Card,
    Div
} from "@vkontakte/vkui";

import { 
    Icon28InfoOutline,
    Icon28NameTagOutline,
    Icon28WorkOutline,
    Icon28EducationOutline,
    Icon28CheckShieldDeviceOutline,
    Icon28SchoolOutline,
    Icon28Users3Outline,
    Icon28TearOffFlyerOutline,
    Icon28Cards2Outline
} from '@vkontakte/icons';

class Directory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id, goBack, setPage} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Справочник
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">{<Icon28InfoOutline/>}</div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__subheader">В данном разделе предоставлена некоторая часть справочной информации. Обращаем ваше внимание на то, что возможны изменения, которые на данный момент мы отслеживать, к сожалению, не в силах.</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group> 
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell 
                            before={<Icon28TearOffFlyerOutline/>} 
                            onClick={() => setPage('home', 'basic_info')}
                            >
                                Основные сведения
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28NameTagOutline/>} 
                            onClick={() => setPage('home', 'commission')}
                            >
                                Приемная комиссия
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28WorkOutline/>} 
                            onClick={() => setPage('home', 'spec')}
                            >
                                Специальности
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28EducationOutline/>} 
                            onClick={() => setPage('home', 'resources')}
                            >
                                Образовательные ресурсы
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28CheckShieldDeviceOutline/>} 
                            onClick={() => setPage('home', 'security')}
                            >
                                Информационная безопасность
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28SchoolOutline/>} 
                            onClick={() => setPage('home', 'structure')}
                            >
                                Организационная структура
                            </SimpleCell>

                            <SimpleCell 
                            expandable = 'true' 
                            before={<Icon28Users3Outline/>} 
                            href='http://www.collegetel.ru/sveden/employees' target="_blank"
                            >
                                Педагогический состав
                            </SimpleCell>

                            <SimpleCell 
                            before={<Icon28Cards2Outline/>} 
                            onClick={() => setPage('home', 'diploma')}
                            >
                                Образцы дипломов
                            </SimpleCell>
                        </Card>
                    </Div>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    setPage
};

export default connect(null, mapDispatchToProps)(Directory);