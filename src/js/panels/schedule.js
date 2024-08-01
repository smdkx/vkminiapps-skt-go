import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Card,
    ContentCard,
    Div
} from "@vkontakte/vkui";

import { 
    Icon28InfoOutline 
} from '@vkontakte/icons';

class Schedule extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            images: [
                "https://i.postimg.cc/7hCKHXPR/schedule.png",
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
                    Расписание звонков
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">{<Icon28InfoOutline/>}</div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__subheader">Расписание звонков можно открыть во весь экран, для этого нажмите на него.</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Div>
                    <ContentCard
                        src={this.state.images[0]}
                        onClick={() => bridge.send("VKWebAppShowImages", { images: [this.state.images[0]] })}
                    />
                </Div>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Schedule);