import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell,
    Link
} from "@vkontakte/vkui";

import { 
    Icon24GlobeOutline,
    Icon24InfoCircleOutline
} from '@vkontakte/icons';

class Security extends React.Component {

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
                    Безопасность
                </PanelHeader>

                <Group header={<Header mode="secondary">Безопасные сайты</Header>}> 
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="http://i-deti.org/">http://i-deti.org/</Link> – портал «Безопасный инет для детей», ресурсы, рекомендации, комиксы. <p />
                            <Link href="http://dotdeti.ru/">http://dotdeti.ru/</Link> – Фонд "Разумный интернет", развитие в России детского интернета и поддержкой гуманитарных проектов во всемирной сети. <p />
                            <Link href="http://www.gogul.tv/">http://www.gogul.tv/</Link> – Федеральная программа безопасного детского интернета "Гогуль". <p />
                            <Link href="http://сетевичок.рф/">http://сетевичок.рф/</Link> – сайт для детей, обучение и онлайн-консультирование по вопросам кибербезопасности, сетевой безопасности. <p />
                            <Link href="http://www.igra-internet.ru/">http://www.igra-internet.ru/</Link> – онлайн интернет-игра «Изучи Интернет – управляй им». <p />
                            <Link href="http://www.safe-internet.ru/">http://www.safe-internet.ru/</Link> – сайт Ростелеком «Безопасность детей в Интернете, библиотека с материалами, памятками, рекомендациями по возрастам. <p />
                            <Link href="http://www.fid.su/projects/deti-v-internete">http://www.fid.su/projects/deti-v-internete</Link> – сайт Фонда Развития Интернет. <p />
                            <Link href="http://content-filtering.ru/">http://content-filtering.ru/</Link> – сайт «Ваш личный интернет», советы, рекомендации для детей и родителей по безопасной работе в Интернет. <p />
                            <Link href="http://www.ligainternet.ru/">http://www.ligainternet.ru/</Link> – Лиги безопасного Интернета. <p />
                            <Link href="http://www.microsoft.com/ru-ru/security/default.aspx">http://www.microsoft.com/ru-ru/security/default.aspx</Link> – сайт Центра безопасности Майкрософт. <p />
                            <Link href="http://www.saferunet.org/children/">http://www.saferunet.org/children/</Link> – Центр безопасности Интернета в России. <p />
                            <Link href="http://www.iprbookshop.ru">http://www.iprbookshop.ru</Link> – Электронно-библиотечная система IPRbooks. <p />
                            <Link href="http://нэб.рф">http://нэб.рф</Link> – Национальная Электронная Библиотека. <p />
                            <Link href="https://infourok.ru">https://infourok.ru</Link> – Инфоурок (Ведущий образовательный портал России). <p />
                            <Link href="https://www.prodlenka.org">https://www.prodlenka.org</Link> – Продленка (Образовательный портал). <p />
                            <Link href="http://ege-go.ru/math-ege/">http://ege-go.ru/math-ege/</Link> – Информатика и математика (Образовательный ресурс). <p />
                            <Link href="https://nsportal.ru">https://nsportal.ru</Link> – Социальная сеть работников образования «Наша сеть». <p />
                            <Link href="http://rosmetod.ru">http://rosmetod.ru</Link> – Росметод.
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Дополнительная информация</Header>}>
                    <MiniInfoCell
                        before={<Icon24InfoCircleOutline />} 
                        textWrap="full"
                        textLevel="secondary"
                        >
                            На данной странице представлены безопасные сайты, куда может зайти каждый и не волноваться по поводу конфиденциальности (все сайты проверены колледжем).
                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
};

export default connect(null, mapDispatchToProps)(Security);