import React from 'react';
import {connect} from 'react-redux';

import { newsData } from '../components/data/news.data'

import {setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    ContentCard,
    Div,
    Placeholder
} from "@vkontakte/vkui";

import { 
    Icon28TextLiveOutline
 } from '@vkontakte/icons';

import img_plug from '../../img/img_plug_3.png';

class News extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id} = this.props;

        return (

            <Panel id={id}>
                <PanelHeader
                before={
                    <PanelHeaderButton href='https://vk.com/sktnews' target="_blank">
                        <Icon28TextLiveOutline />
                    </PanelHeaderButton>
                }
                >
                    Новости
                </PanelHeader>

                <Group>
                    {newsData.length ? newsData.toReversed().map(newsData => (
                    <Div key={newsData.id}>
                        <ContentCard
                        src={newsData.image}
                        subtitle="Системная запись"
                        text={newsData.text}
                        caption={newsData.date}
                        maxHeight={100}
                        />
                    </Div>
                    )) :         
                    <Group>
                        <img className="news" src={img_plug} alt="news" style={{ marginTop: 100 }}/>
                        <Placeholder
                        header="Новости не найдены"
                        >
                            К сожалению, новостей пока нет или они не были найдены.
                        </Placeholder>
                    </Group>
                    }
                </Group>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage
};

export default connect(null, mapDispatchToProps)(News);