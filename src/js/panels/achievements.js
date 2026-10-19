import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";
import {loadAchievements} from '../store/achievements';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    HorizontalScroll,
    HorizontalCell,
    Avatar,
    Header,
    Snackbar
} from "@vkontakte/vkui";

import NewBie from "../../img/achievements/newbie.svg";
import Steep from "../../img/achievements/steep.svg";
import Static from "../../img/achievements/static.svg";
import Donut from "../../img/achievements/donut.svg";
import Subscriber from "../../img/achievements/subscriber.svg";
import EasterEgg from "../../img/achievements/easterEgg.svg";
import Star from "../../img/achievements/star.svg";

//import test from '../../img/achievements/donut.svg';

class Achievements extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.props.loadAchievements().catch(() => {
            if (this.mounted) this.setState({snackbar: <Snackbar onClose={() => {
                if (this.mounted) this.setState({snackbar: null});
            }}>Не удалось загрузить достижения.</Snackbar>});
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const {id, goBack, setPage, earned} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Достижения
                </PanelHeader>

                <Group header={<Header>Основные</Header>}>
                    <HorizontalScroll>
                        <div style={{ display: 'flex' }}>
                            <HorizontalCell size='l' header='Новичок' onClick={() => setPage('profile', 'newbie')} aria-label={`Достижение «Новичок»${earned.newbie ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={NewBie} className={earned.newbie ? '' : 'Achievements__filter'} />
                            </HorizontalCell>
                            
                            <HorizontalCell size='l' header='Крутой' onClick={() => setPage('profile', 'steep')} aria-label={`Достижение «Крутой»${earned.steep ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={Steep} className={earned.steep ? '' : 'Achievements__filter'} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Статистика' onClick={() => setPage('profile', 'static')} aria-label={`Достижение «Статистика»${earned.static ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={Static} className={earned.static ? '' : 'Achievements__filter'} />
                            </HorizontalCell>
                        </div>
                    </HorizontalScroll>
                </Group>

                <Group header={<Header>Второстепенные</Header>}>
                    <HorizontalScroll>
                        <div style={{ display: 'flex' }}>
                            <HorizontalCell size='l' header='Пончик' onClick={() => setPage('profile', 'donut')} aria-label={`Достижение «Пончик»${earned.donut ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={Donut} className={earned.donut ? '' : 'Achievements__filter'} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Подписчик' onClick={() => setPage('profile', 'subscriber')} aria-label={`Достижение «Подписчик»${earned.subscriber ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={Subscriber} className={earned.subscriber ? '' : 'Achievements__filter'} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Пасхалка' onClick={() => setPage('profile', 'easteregg')} aria-label={`Достижение «Пасхалка»${earned.easteregg ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={EasterEgg} className={earned.easteregg ? '' : 'Achievements__filter'} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Избранный' onClick={() => setPage('profile', 'star')} aria-label={`Достижение «Избранный»${earned.star ? ': получено' : ''}`}>
                                <Avatar size={160} mode='image' src={Star} className={earned.star ? '' : 'Achievements__filter'} />
                            </HorizontalCell>
                        </div>
                    </HorizontalScroll>
                </Group>

                {this.state.snackbar}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    setPage,
    loadAchievements
};

export default connect(state => ({earned: state.achievements.earned}), mapDispatchToProps)(Achievements);
