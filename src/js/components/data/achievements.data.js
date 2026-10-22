import newbie from '../../../img/achievements/newbie.svg';
import steep from '../../../img/achievements/steep.svg';
import statistics from '../../../img/achievements/static.svg';
import donut from '../../../img/achievements/donut.svg';
import subscriber from '../../../img/achievements/subscriber.svg';
import easteregg from '../../../img/achievements/easterEgg.svg';
import star from '../../../img/achievements/star.svg';
import mygroup from '../../../img/achievements/mygroup.svg';
import memologist from '../../../img/achievements/memologist.svg';
import collector from '../../../img/achievements/collector.svg';
import {Icon28UserCircleOutline, Icon28CupOutline, Icon28StatisticsOutline, Icon28DonateOutline,
    Icon28UsersOutline, Icon28GhostOutline, Icon28FavoriteOutline, Icon28EducationOutline,
    Icon28SmileOutline, Icon28PictureStackOutline} from '@vkontakte/icons';

// Images are retained for the exported story card; the interface uses VKUI icons.
export const achievementCatalog = [
    {id: 'newbie', title: 'Новичок', Icon: Icon28UserCircleOutline, image: newbie, category: 'main', description: '5 минут активного использования'},
    {id: 'steep', title: 'Крутой', Icon: Icon28CupOutline, image: steep, category: 'main', description: 'Собрать все остальные достижения'},
    {id: 'static', title: 'Статистика', Icon: Icon28StatisticsOutline, image: statistics, category: 'main', description: 'Поделиться приложением с друзьями'},
    {id: 'mygroup', title: 'Своя группа', Icon: Icon28EducationOutline, image: mygroup, category: 'main', description: 'Сохранить группу в профиле'},
    {id: 'donut', title: 'Пончик', Icon: Icon28DonateOutline, image: donut, category: 'extra', description: 'Оформить подписку VK Donut'},
    {id: 'subscriber', title: 'Подписчик', Icon: Icon28UsersOutline, image: subscriber, category: 'extra', description: 'Подписаться на сообщество приложения'},
    {id: 'easteregg', title: 'Пасхалка', Icon: Icon28GhostOutline, image: easteregg, category: 'extra', description: 'Найти пасхалку в приложении'},
    {id: 'star', title: 'Избранный', Icon: Icon28FavoriteOutline, image: star, category: 'extra', description: 'Добавить приложение в избранное'},
    {id: 'memologist', title: 'Мемолог', Icon: Icon28SmileOutline, image: memologist, category: 'extra', description: 'Посмотреть 25 разных мемов'},
    {id: 'collector', title: 'Коллекционер', Icon: Icon28PictureStackOutline, image: collector, category: 'extra', description: 'Посмотреть все доступные мемы'},
];

export const CREATOR_ID = 214477552;
