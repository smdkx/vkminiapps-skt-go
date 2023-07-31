import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Banner,
    CardGrid,
    ContentCard
} from "@vkontakte/vkui";

import { 
    Icon28PinOutline 
} from '@vkontakte/icons';

import practice from '../../../img/practices/practice_group_1.png';

class Practice_Group_1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Расписание практики
                </PanelHeader>

                <Banner
                    before={<Icon28PinOutline />}
                    subheader={
                    <React.Fragment>
                        Расписание практики можно двигать, для этого проведите в одну из сторон.
                    </React.Fragment>
                    }
                />

                <Group>
                    <CardGrid size="l">
                        <ContentCard
                        disabled
                        image={practice}
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

export default connect(null, mapDispatchToProps)(Practice_Group_1);