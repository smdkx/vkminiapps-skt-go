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
    ContentCard,
    MiniInfoCell,
    CardGrid
} from "@vkontakte/vkui";

import {
    Icon24InfoCircleOutline
} from "@vkontakte/icons";

class Structure extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            images: [
                "https://i.postimg.cc/098n9Df8/orgstruct.jpg",
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
                    Структура
                </PanelHeader>

                <Group header={<Header mode="secondary">Организационная структура</Header>}> 
                    <CardGrid size="l">
                        <ContentCard
                            image={this.state.images[0]}
                            header="Структура колледжа"
                            onClick={() => bridge.send("VKWebAppShowImages", { images: [this.state.images[0]] })}
                            maxHeight={200}
                        />
                    </CardGrid>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24InfoCircleOutline />} 
                        textWrap="full"
                        textLevel="secondary"
                        >
                            Дополнительная информация отсутствует.

                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Structure);