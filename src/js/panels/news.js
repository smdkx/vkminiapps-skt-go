import React from 'react';
import {connect} from 'react-redux';

import {setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    ContentCard,
    Div
} from "@vkontakte/vkui";

import { 
    Icon28TextLiveOutline
 } from '@vkontakte/icons';

//import img_plug from '../../img/img_plug_3.png';

class News extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: [
                {
                  id: "140691640",
                  name: "Системная запись",
                },
              ],
            snackbar: null,
            loader: false,
        };
    }

    render() {
        const {id} = this.props;

        /*return (
            <Panel id={id} centered={true}>
                <PanelHeader>Новости</PanelHeader>
                <Group>
                    <img className="news" src={img_plug} alt="news" />
                    <Placeholder
                    header="Новости не найдены"
                    >
                        К сожалению, новостей пока нет или они не были найдены.
                    </Placeholder>
                </Group>
            </Panel>
        );*/

        return (
            <Panel id={id}>
                <PanelHeader
                left={
                    <PanelHeaderButton href='https://vk.com/sktnews' target="_blank">
                        <Icon28TextLiveOutline />
                    </PanelHeaderButton>
                }
                >
                    Новости
                </PanelHeader>

                <Group>
                    <Div>
                        <ContentCard
                        image="https://media.istockphoto.com/id/845858656/vector/new-years-eve-background.jpg?s=612x612&w=0&k=20&c=tLHndy4VoL7w_LxDj6BPaKh2T5WMYe-y3WS4IY7pQlc="
                        subtitle={this.state.groups[0].name}
                        text="Немного опоздали с поздравлением на новый год, но лучше поздно, чем никогда! Было обновлено расписание для всех групп и исправили ошибки, сделав приложение еще лучше."
                        caption="18.02.22"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://sun9-63.userapi.com/impg/c857416/v857416504/1be41a/5G0m_ABVN2Y.jpg?size=2560x650&quality=96&sign=ea4f9828fe8d6079d32cbd80751eb302"
                        subtitle={this.state.groups[0].name}
                        text="Минималистичная панель навигации и плавная анимация при нажатии нее – круто! При этом убрали названия разделов под иконками (возможно вернем в будущем, но это не точно). Исправили мелкие ошибки, подготовились к следующим обновлениям. Добавили парочку новых разделов в справочник."
                        caption="01.11.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://img.freepik.com/free-vector/realistic-1-september-background_23-2149059610.jpg?w=1380&t=st=1690823900~exp=1690824500~hmac=6370a34a338225d875c7547c6930d590f0fe66def0dbc1536c8789fc0a3d081f"
                        subtitle={this.state.groups[0].name}
                        text="К 1 сентябрю готовы! Добавлено расписание для всех групп, при этом, добавив возможность открывать его во весь экран. Исправили мелкие ошибки."
                        caption="31.08.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://sun9-29.userapi.com/sun9-63/impg/c857416/v857416504/1be41a/5G0m_ABVN2Y.jpg?size=2560x650&quality=96&sign=ea4f9828fe8d6079d32cbd80751eb302&type=album"
                        subtitle={this.state.groups[0].name}
                        text="Встречайте! Вместе с текущим обновлением мы запускаем ребрендинг. Теперь приложение именуется как SKT Go с обновленным логотипом."
                        caption="26.08.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://sun9-29.userapi.com/sun9-70/impg/zk0vU_xaKKoV2krANdxQ20Kf5VlHJ6YaRUD6UQ/be-gWrxusz4.jpg?size=746x252&quality=96&sign=46d84bd9fd829d7d6d207781071a0478&type=album"
                        subtitle={this.state.groups[0].name}
                        text="Ого, еще одно обновление! В этот раз добавили топ студентов. Вся информация о том, как туда попасть и какие критерии находятся на соответствующей странице. Дерзайте! Также обновили внешний вид у некоторых разделов, добавили информацию в справочник и открыли доступ к достижениям."
                        caption="26.08.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://i.pinimg.com/736x/e1/4b/70/e14b7097d76237a8f5aba0dc66d01e1b.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Ура, обновление! Из основного: добавили новые компоненты для следующих нововведений, обновили вид разработчиков (на вкладке «Профиль»), поправили специальности и их описание, добавили список новых студентов СКТ, ну и конечно же очередное пополнение мемов!"
                        caption="24.08.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://images.all-free-download.com/images/graphiclarge/office_work_background_working_man_desk_icons_decor_6837962.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Обновленный и воздушный дизайн уже пришел к нам в приложение! Обновились карточки и блоки, став более закругленными. Поправили некоторые элементы."
                        caption="05.08.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://savings4savvymums.co.uk/wp-content/uploads/2020/09/37-Home-Based-Jobs-You-Can-Do-While-Working-From-Home_3.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Очередное обновление приложения – теперь в новостное сообщество SKT News можно перейти со вклади «Новости», нажав на иконку в левом верхнем углу. Также очередные косметические улучшения."
                        caption="17.07.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://i.postimg.cc/vmvDY3WL/2021-08-24-22-35-40.png"
                        subtitle={this.state.groups[0].name}
                        text="Подписка VK Donut, дающая преимущества в приложении, достижения, пополнение мемов, общий чат, обновленные настройки и не только уже доступно в обновлении! Попробуйте сами."
                        caption="28.06.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://images.unsplash.com/photo-1518655048521-f130df041f66?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmxhdCUyMGxheSUyMGRlc2t8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
                        subtitle={this.state.groups[0].name}
                        text="Очередные исправления по приложению в новой версии. Обновлено FAQ и некоторые другие страницы. Поправили иконки и некоторые другие вещи."
                        caption="03.06.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://png.pngtree.com/thumb_back/fw800/back_our/20190623/ourmid/pngtree-office-worker-cartoon-work-minimalist-background-image_239069.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Был добавлен пункт «Клипы» в разделе «Разное». Где-то поменяли иконки, где-то подкрутили гайки. Поправили страницу со случайными мемами. Подготовили приложение к будущим обновлениям."
                        caption="31.05.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://png.pngtree.com/thumb_back/fw800/background/20190223/ourmid/pngtree-fresh-office-background-illustration-design-paintedcartoonfresh-backgroundoffice-backgroundillustration-image_64563.jpg"
                        subtitle={this.state.groups[0].name}
                        text="В обновлении 2.4.4 добавлен раздел с расписанием текущих экзаменов групп. Была проделана работа под капотом приложения. Улучшили вид некоторых страниц."
                        caption="26.05.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://i.pinimg.com/736x/27/d4/ec/27d4ec1f4267ccc814a765d5e7427899.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Вышло небольшое обновление. Исправили некоторые ошибки, что-то подкрутили, что-то подтянули. Оптимизировали приложение под компьютерную версию (стало выглядеть лучше)."
                        caption="18.05.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://png.pngtree.com/thumb_back/fw800/back_our/20190622/ourmid/pngtree-financial-business-work-scene-banner-background-image_209865.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Новый раздел «Разное» уже доступен для использования! В данной версии немного потрогали дизайн профиля, отображение расписания звонков и занятий, сделав их в одном дизайне. Не забыли и про мелкие косметические и технические исправления."
                        caption="05.05.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://png.pngtree.com/thumb_back/fw800/back_our/20190623/ourmid/pngtree-office-worker-cartoon-work-minimalist-background-image_239069.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Стало доступно новое обновление (2.4). Небольшой редизайн вкладки «Профиль» (ранее «Информация») с сортировкой разделов, косметические и технические улучшения по работе приложения. Готовим к открытию еще один раздел!"
                        caption="23.04.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://png.pngtree.com/thumb_back/fw800/background/20190828/pngtree-top-view-background-of-desktop-with-electronic-devices-and-laptop-image_307721.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Начинаем заполнять расписания всех групп (включая практику). Ожидаемо в ближайшее время заполним все разделы."
                        caption="17.04.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://sun9-63.userapi.com/impg/c857416/v857416504/1be41a/5G0m_ABVN2Y.jpg?size=2560x650&quality=96&sign=ea4f9828fe8d6079d32cbd80751eb302"
                        subtitle={this.state.groups[0].name}
                        text="Стали доступны два новых раздела — «Справочник» и «Расписание практики». В первом можно посмотреть часть справочной информации колледжа, а во втором расписание учебной и производственной практики."
                        caption="16.04.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>

                    <Div>
                        <ContentCard
                        image="https://sun9-31.userapi.com/PQ4UCzqE_jue9hAINefBMorYCdfGXvcuV5nSjA/eYugcFYzdW8.jpg"
                        subtitle={this.state.groups[0].name}
                        text="Это первая системная новость обновленного приложения SKT App! Часть информации о приложении расположена в FAQ, советуем почитать (вкладка «Главная», кнопка в левом верхнем углу)."
                        caption="13.04.21"
                        disabled
                        maxHeight={100}
                        />
                    </Div>
                </Group>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage
};

export default connect(null, mapDispatchToProps)(News);