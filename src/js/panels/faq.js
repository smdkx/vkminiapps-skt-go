import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ContentCard,
    CardGrid
} from "@vkontakte/vkui";

class FAQ extends React.Component {

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
                    Справка
                </PanelHeader>

                <CardGrid size="l" style={{ marginTop: "20px", marginBottom: "30px"}}>
                    <ContentCard
                    disabled
                    className="tw"
                    header="Информация о сервисе"
                    text= {
                        "SKT Go – это небольшое мини-приложение (сервис), которое создано для помощи студентам. В самом приложении имеются разделы с учебным расписанием, расписанием самих групп, справочником и другой полезной информации!\n\nСо временем будут дополняться и обновляться уже имеющиеся разделы. Для предложения своей идеи можно связаться с разработчиком (информация расположена на вкладке «Профиль»)." 
                    }
                    maxheight={200}
                    />
                </CardGrid>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(FAQ);