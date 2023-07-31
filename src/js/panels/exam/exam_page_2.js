import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ContentCard,
    Banner,
    Div
} from "@vkontakte/vkui";

import { 
    Icon28InfoOutline 
} from '@vkontakte/icons';

class ExamPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            images: [
                "https://i.postimg.cc/d0WKhs9m/2021-05-26-14-41-36.png",
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
                    Экзамены
                </PanelHeader>

                <Banner
                    before={<Icon28InfoOutline />}
                    subheader={
                    <React.Fragment>
                        Расписание экзаменов можно открыть во весь экран, для этого нажмите на него.
                    </React.Fragment>
                    }
                />

                <Div>
                    <ContentCard
                        image={this.state.images[0]}
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

export default connect(null, mapDispatchToProps)(ExamPage);