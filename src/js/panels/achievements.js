import React from 'react';
import {connect} from 'react-redux';

import {goBack, setPage} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    HorizontalScroll,
    HorizontalCell,
    Avatar,
    Header,
    Card,
    Div
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
            loader: false,
        };
    }

    render() {
        const {id, goBack, setPage} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    before={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Достижения
                </PanelHeader>

                <Div>
                    <Card size="l" mode="shadow">
                        <div className="CustomBanner">
                        <div className="CustomBanner__aside">
                            <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                            </div>
                            <div className="CustomBanner__main">
                                <div className="CustomBanner__header">Обратите внимание</div>
                                <div className="CustomBanner__subheader">Достижения за выполнения заданий временно не выдаются.</div>
                            </div>
                        </div>
                    </Card>
                </Div>

                <Group header={<Header>Основные</Header>}>
                    <HorizontalScroll className="Achievements__filter">
                        <div style={{ display: 'flex' }}>
                            <HorizontalCell size='l' header='Новичок'>
                                <Avatar size={160} mode='image' src={NewBie} onClick={() => setPage('profile', 'newbie')} />
                            </HorizontalCell>
                            
                            <HorizontalCell size='l' header='Крутой'>
                                <Avatar size={160} mode='image' src={Steep} onClick={() => setPage('profile', 'steep')} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Статистика'>
                                <Avatar size={160} mode='image' src={Static} onClick={() => setPage('profile', 'static')} />
                            </HorizontalCell>
                        </div>
                    </HorizontalScroll>
                </Group>

                <Group header={<Header>Второстепенные</Header>}>
                    <HorizontalScroll className="Achievements__filter">
                        <div style={{ display: 'flex' }}>
                            <HorizontalCell size='l' header='Пончик'>
                                <Avatar size={160} mode='image' src={Donut} onClick={() => setPage('profile', 'donut')} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Подписчик'>
                                <Avatar size={160} mode='image' src={Subscriber} onClick={() => setPage('profile', 'subscriber')} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Пасхалка'>
                                <Avatar size={160} mode='image' src={EasterEgg} onClick={() => setPage('profile', 'easteregg')} />
                            </HorizontalCell>

                            <HorizontalCell size='l' header='Избранный'>
                                <Avatar size={160} mode='image' src={Star} onClick={() => setPage('profile', 'star')} />
                            </HorizontalCell>
                        </div>
                    </HorizontalScroll>
                </Group>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    setPage
};

export default connect(null, mapDispatchToProps)(Achievements);