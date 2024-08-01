import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Div,
    Card,
    CardGrid,
    ContentCard
} from "@vkontakte/vkui";

import { 
    Icon28InfoOutline 
} from '@vkontakte/icons';

class Group_Panel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            images: [
                "https://sun9-29.userapi.com/impg/P8GVdwiWAfv1XYLyD6h5ZcyMH6l_pAVnvUc6qQ/S0DU1P3Gi-4.jpg?size=436x1522&quality=96&sign=c0e57291d5bb72d2b1013a51508808ee&type=album", //timetable_5
            ],
        };
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Расписание группы
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">{<Icon28InfoOutline/>}</div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__subheader">Расписание занятий можно открыть во весь экран, для этого нажмите на него.</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group>
                    <CardGrid size="l">
                        <ContentCard
                        onClick={() => bridge.send("VKWebAppShowImages", { images: [this.state.images[0]] })}
                        src={this.state.images[0]}
                        />
                    </CardGrid>
                </Group>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Group_Panel);