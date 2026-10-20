import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeaderBack,
    Group,
    Box,
    SimpleCell
} from '@vkontakte/vkui';
import NoticeBanner from '../components/NoticeBanner';
import PanelHeader from '../components/AppPanelHeader';

import {
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

                <Box padding="system"><NoticeBanner title="Справочные материалы" subtitle="В разделе собрана справочная информация о колледже. Данные могут меняться — актуальные сведения уточняйте на официальном сайте."/></Box>

                <Group>
                    <SimpleCell multiline
                    before={<Icon28TearOffFlyerOutline/>}
                    onClick={() => setPage('home', 'basic_info')}
                    >
                        Основные сведения
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28NameTagOutline/>}
                    onClick={() => setPage('home', 'commission')}
                    >
                        Приемная комиссия
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28WorkOutline/>}
                    onClick={() => setPage('home', 'spec')}
                    >
                        Специальности
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28EducationOutline/>}
                    onClick={() => setPage('home', 'resources')}
                    >
                        Образовательные ресурсы
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28CheckShieldDeviceOutline/>}
                    onClick={() => setPage('home', 'security')}
                    >
                        Информационная безопасность
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28SchoolOutline/>}
                    onClick={() => setPage('home', 'structure')}
                    >
                        Организационная структура
                    </SimpleCell>

                    <SimpleCell multiline
                    chevron="auto"
                    before={<Icon28Users3Outline/>}
                    href='http://www.collegetel.ru/sveden/employees' target="_blank"
                    >
                        Педагогический состав
                    </SimpleCell>

                    <SimpleCell multiline
                    before={<Icon28Cards2Outline/>}
                    onClick={() => setPage('home', 'diploma')}
                    >
                        Образцы дипломов
                    </SimpleCell>
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