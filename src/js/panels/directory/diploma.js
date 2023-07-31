import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Header,
    CardScroll,
    ContentCard,
    MiniInfoCell
} from "@vkontakte/vkui";

import {
    Icon24InfoCircleOutline
} from "@vkontakte/icons";

class Diploma extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            images: [
                "https://i.postimg.cc/CMrhdjqW/diplomspo.jpg",
                "https://i.postimg.cc/7YCxzf1b/diplomspoprolozhenie.jpg",
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
                    Образцы дипломов
                </PanelHeader>

                <Group header={<Header mode="secondary">Образцы дипломов</Header>}> 
                    <CardScroll size="l" style={{ marginBottom: "-50px" }}>
                        <ContentCard
                            image={this.state.images[0]}
                            header="Образец диплома №1"
                            onClick={() => bridge.send("VKWebAppShowImages", { images: [this.state.images[0]] })}
                            caption={null}
                            maxHeight={200}
                            style={{ marginBottom: "50px" }}
                        />

                        <ContentCard
                            image={this.state.images[1]}
                            header="Образец диплома №2"
                            onClick={() => bridge.send("VKWebAppShowImages", { images: [this.state.images[1]] })}
                            caption={null}
                            maxHeight={200}
                            style={{ marginBottom: "50px" }}
                        />
                    </CardScroll>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24InfoCircleOutline />} 
                        textWrap="full"
                        textLevel="secondary"
                        >
                            На данной странице представлены образцы дипломов о среднем профессиональном образовании, выдаваемые колледжем.

                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Diploma);