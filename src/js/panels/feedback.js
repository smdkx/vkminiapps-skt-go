import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ContentCard,
    CardGrid,
    Button,
    Div
} from "@vkontakte/vkui";

class Feedback extends React.Component {

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
                    Отзыв о приложении
                </PanelHeader>

                <Div style={{ paddingTop: 20 }}>
                    <div className="FeedbackPanel__icons  vkuiFormItem vkuiFormItem--ios FormItem FormItem--ios vkuiFormItem--default FormItem--default vkuiFormItem--sizeY-regular FormItem--sizeY-regular">
                        <div className="FeedbackPanel__icon FeedbackPanel__icon--1"></div>
                        <div className="FeedbackPanel__icon FeedbackPanel__icon--2"></div>
                        <div className="FeedbackPanel__icon FeedbackPanel__icon--3 FeedbackPanel__icon--active"></div>
                        <div className="FeedbackPanel__icon FeedbackPanel__icon--4"></div>
                        <div className="FeedbackPanel__icon FeedbackPanel__icon--5"></div>
                    </div>
                </Div>

                <CardGrid size="l" style={{ marginTop: "10px", marginBottom: "30px"}}>
                    <ContentCard
                    disabled
                    className="tw"
                    header="Оставьте ваш отзыв о приложении"
                    text= {
                        "На данной странице вы можете перейти к анкете и оставить отзыв о пользовании приложением, предложить идею или высказать свою точку зрения о текущем функционале.\n\nВсе предложения будут рассмотрены. Заполнять анкету можно неограниченное количество раз. Исследуя заполненные вами анкеты мы делаем приложение лучше." 
                    }
                    maxheight={200}
                    />
                </CardGrid>

                <Div style={{display: 'flex'}}>
                    <Button href='https://vk.com/app5619682_-204275493#574358' target="_blank" size="l" stretched style={{ marginRight: 8 }}>Перейти к анкете</Button>
                </Div>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(Feedback);