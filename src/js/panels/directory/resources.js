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
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Ресурсы
                </PanelHeader>

                <Group header={<Header mode="secondary">Общеобразовательные проекты</Header>}> 
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />}
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="http://arzamas.academy/courses">http://arzamas.academy/courses</Link> – Курсы Арзамас. <p />
                            <Link href="https://www.lektorium.tv/">https://www.lektorium.tv/</Link> – Академические лекции онлайн "Лекториум". <p />
                            <Link href="http://universarium.org/">http://universarium.org/</Link> – Открытая образовательная площадка "Универсариум". <p />
                            <Link href="http://lectoriy.mipt.ru/">http://lectoriy.mipt.ru/</Link> – Онлайн - площадка для лекций "Лекторий". <p />
                            <Link href="http://teachpro.ru/">http://teachpro.ru/</Link> – Интерактивные видеокурсы "TeachPro". <p />
                            <Link href="https://ru.khanacademy.org/">https://ru.khanacademy.org/</Link> – Некоммерческий проект "Khan Academy". <p />
                            <Link href="https://www.coursera.org/ ">https://www.coursera.org/ </Link> – Образовательная платформа с бесплатными русскоязычными онлайн курсами "Coursera". <p />
                            <Link href="http://tvkultura.ru/brand/show/brand_id/20898">http://tvkultura.ru/brand/show/brand_id/20898</Link> – Телевизионный проект "Академия". <p />
                            <Link href="https://openedu.ru/">https://openedu.ru/</Link> – Платформа с большим количеством курсов "Открытое образование". <p />
                            <Link href="http://univertv.ru/">http://univertv.ru/</Link> – Дистанционный университет "УниверТV". <p />
                            <Link href="https://pruffme.com/">https://pruffme.com/</Link> – Огромный архив "Pruff Me". <p />
                            <Link href="https://stepic.org/explore/courses">https://stepic.org/explore/courses</Link> – Онлайн - конструктор курсов "Stepic". <p />
                            <Link href="http://www.intuit.ru/">http://www.intuit.ru/</Link> – Бесплатное дистанционное обучение "Интуит". <p />
                            <Link href="http://uchinovoe.ru/">http://uchinovoe.ru/</Link> – Обычного набора тематик и ряд уникальных курсов "Учи новое". <p />
                            <Link href="https://4brain.ru/">https://4brain.ru/</Link> – Уроки и материалы для развития конкретных навыков "4 Brain". <p />
                            <Link href="http://universiality.com/kursi-online-obucheniya">http://universiality.com/kursi-online-obucheniya</Link> – Бесплатные онлайн - курсы " UNIVERSIALITY". <p />
                            <Link href="http://theoryandpractice.ru/videos">http://theoryandpractice.ru/videos</Link> – Платформа для обмена знаниями "Теория и практика". <p />
                            <Link href="http://samopoznanie.ru/webinars/">http://samopoznanie.ru/webinars/</Link> – Пространство для саморазвития "Samopoznanie". <p />
                            <Link href="http://vnimanietv.ru/">http://vnimanietv.ru/</Link> – Образовательное видео "Внимание ТВ".
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Бизнес-площадки для онлайн образования</Header>}>
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />} 
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="http://vsetreningi.ru/spb/">http://vsetreningi.ru/spb/</Link> – Бизнес - тренинги и семинары "Все тренинги". <p />
                            <Link href="http://businesslearning.ru/">http://businesslearning.ru/</Link> – Портал для изучения бизнеса "BusinessLearning". <p />
                            <Link href="https://www.eduson.tv/ru/courses/all">https://www.eduson.tv/ru/courses/all</Link> – Лекции для компаний целиком "Эдусон ТВ". <p />
                            <Link href="http://school.dasreda.ru/studying/catalog">http://school.dasreda.ru/studying/catalog</Link> – Много разных курсов "112 курсов по бизнесу". <p />
                            <Link href="http://elementy.ru/video">http://elementy.ru/video</Link> – Бесплатные курсы, семинары, и лекции "Династия".
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Полезные порталы для образования</Header>}>
                    <MiniInfoCell
                        before={<Icon24GlobeOutline />} 
                        textWrap="full"
                        textLevel="primary"
                        >
                            <Link href="http://www.topexpert.pro/">http://www.topexpert.pro/</Link> – Специализированный ресурс "Топ эксперт". <p />
                            <Link href="http://loftblog.ru/lessons/">http://loftblog.ru/lessons/</Link> – Курсы для интернет - профессий и программистов "Лофтблог". <p />
                            <Link href="https://mva.microsoft.com/search/SearchResults.aspx#!lang=1049">https://mva.microsoft.com/search/SearchResults.aspx#!lang=1049</Link> – Подборка для программистов "Виртуальная академия Майкрософт". <p />
                            <Link href="https://academy.yandex.ru/">https://academy.yandex.ru/</Link> – Портал для программистов "Академия Яндекса". <p />
                            <Link href="https://www.techdays.ru/">https://www.techdays.ru/</Link> – Современные технологии и разработка сайтов "Tech days". <p />
                            <Link href="https://geekbrains.ru/courses#free">https://geekbrains.ru/courses#free</Link> – Обучение и общение с ведущими IT специалистами и 12 курсов по программированию "Geekbrains". <p />
                            <Link href="https://htmlacademy.ru/">https://htmlacademy.ru/</Link> – Порталы для программистов "HtmlAcademy". <p />
                            <Link href="http://lendwings.com/catalog?courseType=free">http://lendwings.com/catalog?courseType=free</Link> – Для работы в интернете "Lend Wings". <p />
                            <Link href="https://www.cybermarketing.ru/#calendar">https://www.cybermarketing.ru/#calendar</Link> – Портал о интернет технологиях и интернет маркетинге "Кибермаркетинг".
                    </MiniInfoCell>
                </Group>

                <Group header={<Header mode="secondary">Вложения</Header>}>
                    <MiniInfoCell
                        before={<Icon24DocumentOutline />} 
                        textWrap="full"
                        textLevel="primary"
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