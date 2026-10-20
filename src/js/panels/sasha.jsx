import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import {
    Box,
    Panel,
    PanelHeaderBack,
    ContentCard,
    CardGrid,
    Footer,
    Link,
} from '@vkontakte/vkui';
import NoticeBanner from '../components/NoticeBanner';
import PanelHeader from '../components/AppPanelHeader';

class Sasha extends React.Component {

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
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Саша что ты сделал
                </PanelHeader>

                <Box padding="system"><NoticeBanner title="Важное сообщение" subtitle="На вкладке «Сервисы» вы можете перейти в раздел «Благотворительность Саше» и узнать кое-что новое!"/></Box>

                <CardGrid size="l" style={{ marginTop: "20px", marginBottom: "20px"}}>
                    <ContentCard mode="outline"
                    className="tw"
                    title="Сохранение настроек"
                    description= {
                        "Вы попали на страницу сохранения настроек. Спросите – почему они не были сохранены? Во всем виноват Сашка (@reizyk) , который перестал есть кашку и не может починить настройки.\n\nПоэтому Сашке фуллстак гендеру (ну типа) мы посвятили целую страницу, чтобы он наконец починил настройки.\n\nА теперь можете взглянуть на мем внизу и узнать, каким был бы Сашка, если бы починил настройки." 
                    }
                    maxHeight={200}
                    />
                </CardGrid>

                <img className="random__block" src="https://sun9-71.userapi.com/impg/ocxqPVvXRoEBcmCQotX8GqRrbPyGc5jPSAtCsQ/y4qf71FryS0.jpg?size=950x1080&quality=96&sign=5e44eb56e79a6cccccdc5d938661351e&type=album" alt="sasha" />

                <Footer>RIP <Link href="https://vk.com/reizyk" target="_blank">Сашка </Link>2kTwentyFour</Footer>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Sasha);
