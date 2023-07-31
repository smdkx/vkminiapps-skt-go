import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ContentCard,
    CardGrid,
    Footer,
    Button,
    Div
} from "@vkontakte/vkui";

class SashaFond extends React.Component {

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
                    Помощь Сашке
                </PanelHeader>

                <img className="Sasha__fond" src="https://i.postimg.cc/g2kXdqW0/imgonline-com-ua-Black-White-xu-RTRVb38-Z.jpg" alt="sasha" />

                <CardGrid size="l" style={{ marginTop: "20px", marginBottom: "20px"}}>
                    <ContentCard
                    disabled
                    className="tw"
                    header="Благотворительность Сашке (какашке)"
                    text= {
                        "Страница была создана специально для помощи Сашке, чтобы он купил кашки и починил настройки.\n\nНа странице ниже имеется две кнопки: зеленая (Пожертвовать Саше) и синяя (Саша иди на работу).\n\nС помощью первой кнопки вы можете пожертвовать Сашке на кашку (а может и какашку), а с помощью второй написать ему в ЛС, чтобы он наконец починил настройки (этот вариант бесплатный и очень выгодный!)\n\nP.S.: Почему фото оформлено в ЧБ ? Потому что Сашка каждый день устраивает 1000-7 в дотке и всю свою жизнь фармит в4, он маленький гуленок. Мы хотим сделать из него человека!" 
                    }
                    maxheight={200}
                    />
                </CardGrid>

                <Div style={{display: 'flex'}}>
                    <Button mode="commerce" size="l" stretched style={{ marginRight: 8 }} href="https://vk.com/donut/teamskt" target="_blank">Пожертвовать Саше</Button>
                </Div>

                <Div style={{display: 'flex'}}>
                    <Button size="l" stretched style={{ marginRight: 8 }} href="https://vk.me/reizyk" target="_blank">Саша иди на работу</Button>
                </Div>

                <Footer>ДАННАЯ СТРАНИЦА (ШУТКА) СОЗДАНА И (ИЛИ) РАСПРОСТРАНЕНО ШУТНИКОМ, ВЫПОЛНЯЮЩИМ ФУНКЦИИ ПРИКОЛИСТА, И (ИЛИ) РОССИЙСКИМ ЮМОРИСТОМ, ВЫПОЛНЯЮЩИМ ФУНКЦИИ ПРИКОЛИСТА.</Footer>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack
};

export default connect(null, mapDispatchToProps)(SashaFond);