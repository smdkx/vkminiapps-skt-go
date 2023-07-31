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
    Icon28UsersOutline 
} from '@vkontakte/icons';

class Timetable extends React.Component {

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
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Расписание занятий
                </PanelHeader>

                <Group>
                    <Div>
                        <Card size="l" mode="shadow">
                            <div className="CustomBanner">
                            <div className="CustomBanner__aside">{<Icon28InfoOutline/>}</div>
                                <div className="CustomBanner__main">
                                    <div className="CustomBanner__subheader">Расписания на 2-й семестр 2021/2022 учебного года</div>
                                </div>
                            </div>
                        </Card>
                    </Div>
                    <Div>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="СП9121, ИКСС9221, ИКСС9321"
                            onClick={() => setPage('home', 'group_1')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ИКСС9421, ССА9521, ИСП9621"
                            onClick={() => setPage('home', 'group_2')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ИСП9721, ИСП9921"
                            onClick={() => setPage('home', 'group_3')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="С9120, М9220, СП9420"
                            onClick={() => setPage('home', 'group_4')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="КС9520"
                            onClick={() => setPage('home', 'group_5')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ПКС9620"
                            onClick={() => setPage('home', 'group_6')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ПКС9720"
                            onClick={() => setPage('home', 'group_7')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="КС9419"
                            onClick={() => setPage('home', 'group_8')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ПКС9718, ПКС9818, ПКС11819, ПКС11919 "
                            onClick={() => setPage('home', 'group_9')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="ПКС9619, ПКС9719"
                            onClick={() => setPage('home', 'group_10')}
                            >
                                Учебное расписание групп
                            </SimpleCell>

                            <SimpleCell
                            before={<Icon28UsersOutline/>} 
                            description="КС11519, КС9518"
                            onClick={() => setPage('home', 'group_11')}
                            >
                                Учебное расписание групп
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

export default connect(null, mapDispatchToProps)(Timetable);