import React from 'react';
import {connect} from 'react-redux';

import {goBack} from "../../store/router/actions";

import {
    Panel,
    PanelHeaderBack,
    Group,
    Header,
    MiniInfoCell,
    Link
} from '@vkontakte/vkui';
import PanelHeader from '../../components/AppPanelHeader';

import { 
    Icon24GlobeOutline,
    Icon24DocumentOutline
} from '@vkontakte/icons';

class Resources extends React.Component {

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
            <Panel id={id} className="DirectoryPanel">
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Ресурсы
                </PanelHeader>

                <Group header={<Header size="s">Общеобразовательные проекты</Header>}>
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />}
                        textWrap="full"
                        mode="accent"
                        >
                            <Link href="http://arzamas.academy/courses">http://arzamas.academy/courses</Link> – Курсы Арзамас. <p />
                            <Link href="https://www.lektorium.tv/">https://www.lektorium.tv/</Link> – Академические лекции онлайн &quot;Лекториум&quot;. <p />
                            <Link href="http://universarium.org/">http://universarium.org/</Link> – Открытая образовательная площадка &quot;Универсариум&quot;. <p />
                            <Link href="http://lectoriy.mipt.ru/">http://lectoriy.mipt.ru/</Link> – Онлайн - площадка для лекций &quot;Лекторий&quot;. <p />
                            <Link href="http://teachpro.ru/">http://teachpro.ru/</Link> – Интерактивные видеокурсы &quot;TeachPro&quot;. <p />
                            <Link href="https://ru.khanacademy.org/">https://ru.khanacademy.org/</Link> – Некоммерческий проект &quot;Khan Academy&quot;. <p />
                            <Link href="https://www.coursera.org/ ">https://www.coursera.org/ </Link> – Образовательная платформа с бесплатными русскоязычными онлайн курсами &quot;Coursera&quot;. <p />
                            <Link href="http://tvkultura.ru/brand/show/brand_id/20898">http://tvkultura.ru/brand/show/brand_id/20898</Link> – Телевизионный проект &quot;Академия&quot;. <p />
                            <Link href="https://openedu.ru/">https://openedu.ru/</Link> – Платформа с большим количеством курсов &quot;Открытое образование&quot;. <p />
                            <Link href="http://univertv.ru/">http://univertv.ru/</Link> – Дистанционный университет &quot;УниверТV&quot;. <p />
                            <Link href="https://pruffme.com/">https://pruffme.com/</Link> – Огромный архив &quot;Pruff Me&quot;. <p />
                            <Link href="https://stepic.org/explore/courses">https://stepic.org/explore/courses</Link> – Онлайн - конструктор курсов &quot;Stepic&quot;. <p />
                            <Link href="http://www.intuit.ru/">http://www.intuit.ru/</Link> – Бесплатное дистанционное обучение &quot;Интуит&quot;. <p />
                            <Link href="http://uchinovoe.ru/">http://uchinovoe.ru/</Link> – Обычного набора тематик и ряд уникальных курсов &quot;Учи новое&quot;. <p />
                            <Link href="https://4brain.ru/">https://4brain.ru/</Link> – Уроки и материалы для развития конкретных навыков &quot;4 Brain&quot;. <p />
                            <Link href="http://universiality.com/kursi-online-obucheniya">http://universiality.com/kursi-online-obucheniya</Link> – Бесплатные онлайн - курсы &quot; UNIVERSIALITY&quot;. <p />
                            <Link href="http://theoryandpractice.ru/videos">http://theoryandpractice.ru/videos</Link> – Платформа для обмена знаниями &quot;Теория и практика&quot;. <p />
                            <Link href="http://samopoznanie.ru/webinars/">http://samopoznanie.ru/webinars/</Link> – Пространство для саморазвития &quot;Samopoznanie&quot;. <p />
                            <Link href="http://vnimanietv.ru/">http://vnimanietv.ru/</Link> – Образовательное видео &quot;Внимание ТВ&quot;.
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Бизнес-площадки для онлайн образования</Header>}>
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />} 
                        textWrap="full"
                        mode="accent"
                        >
                            <Link href="http://vsetreningi.ru/spb/">http://vsetreningi.ru/spb/</Link> – Бизнес - тренинги и семинары &quot;Все тренинги&quot;. <p />
                            <Link href="http://businesslearning.ru/">http://businesslearning.ru/</Link> – Портал для изучения бизнеса &quot;BusinessLearning&quot;. <p />
                            <Link href="https://www.eduson.tv/ru/courses/all">https://www.eduson.tv/ru/courses/all</Link> – Лекции для компаний целиком &quot;Эдусон ТВ&quot;. <p />
                            <Link href="http://school.dasreda.ru/studying/catalog">http://school.dasreda.ru/studying/catalog</Link> – Много разных курсов &quot;112 курсов по бизнесу&quot;. <p />
                            <Link href="http://elementy.ru/video">http://elementy.ru/video</Link> – Бесплатные курсы, семинары, и лекции &quot;Династия&quot;.
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Полезные порталы для образования</Header>}>
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />} 
                        textWrap="full"
                        mode="accent"
                        >
                            <Link href="http://www.topexpert.pro/">http://www.topexpert.pro/</Link> – Специализированный ресурс &quot;Топ эксперт&quot;. <p />
                            <Link href="http://loftblog.ru/lessons/">http://loftblog.ru/lessons/</Link> – Курсы для интернет - профессий и программистов &quot;Лофтблог&quot;. <p />
                            <Link href="https://mva.microsoft.com/search/SearchResults.aspx#!lang=1049">https://mva.microsoft.com/search/SearchResults.aspx#!lang=1049</Link> – Подборка для программистов &quot;Виртуальная академия Майкрософт&quot;. <p />
                            <Link href="https://academy.yandex.ru/">https://academy.yandex.ru/</Link> – Портал для программистов &quot;Академия Яндекса&quot;. <p />
                            <Link href="https://www.techdays.ru/">https://www.techdays.ru/</Link> – Современные технологии и разработка сайтов &quot;Tech days&quot;. <p />
                            <Link href="https://geekbrains.ru/courses#free">https://geekbrains.ru/courses#free</Link> – Обучение и общение с ведущими IT специалистами и 12 курсов по программированию &quot;Geekbrains&quot;. <p />
                            <Link href="https://htmlacademy.ru/">https://htmlacademy.ru/</Link> – Порталы для программистов &quot;HtmlAcademy&quot;. <p />
                            <Link href="http://lendwings.com/catalog?courseType=free">http://lendwings.com/catalog?courseType=free</Link> – Для работы в интернете &quot;Lend Wings&quot;. <p />
                            <Link href="https://www.cybermarketing.ru/#calendar">https://www.cybermarketing.ru/#calendar</Link> – Портал о интернет технологиях и интернет маркетинге &quot;Кибермаркетинг&quot;.
                    </MiniInfoCell>
                </Group>

                <Group header={<Header size="s">Вложения</Header>}>
                    <MiniInfoCell
                        before={<Icon24DocumentOutline />} 
                        textWrap="full"
                        mode="accent"
                        >
                            <Link href="http://www.collegetel.ru/attachments/article/4/%D0%91%D0%B8%D0%B1%D0%BB%D0%B5%D0%BE%D1%82%D0%B5%D0%BA%D0%B0%20%D0%A1%D0%BC%D0%BE%D0%BB%D0%B5%D0%BD%D1%81%D0%BA%D0%B0.pdf">Библиотеки г. Смоленска.pdf (1295 kB)</Link>
                    </MiniInfoCell>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
};

export default connect(null, mapDispatchToProps)(Resources);