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
                "https://sun9-47.userapi.com/impg/PdDyeZwqSeXizM7I59lxVwBuqRtJDkrwDmCKNg/W2mKFVBNZkk.jpg?size=684x1508&quality=96&sign=c65981e002f9c0182910680b33c07d61&type=album", //timetable_3
            ],
        };
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
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
                        image={this.state.images[0]}
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