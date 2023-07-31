import React from 'react';
import {connect} from 'react-redux';

import {goBack, openModal} from "../store/router/actions";

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderButton,
    SimpleCell,
    Avatar
} from "@vkontakte/vkui";

import { 
    Icon28HelpCircleOutline,
    Icon20DonateCircleFillYellow 
} from '@vkontakte/icons';

const numericIndicator = {
    height: 20,
    width: 20,
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 13,
    boxShadow: '0 4px 24px 0 rgb(0 0 0 / 8%), 0 0 12px 0 rgb(0 0 0 / 8%)',
}

class TopStudent extends React.Component {

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
                    style={{paddingBottom: 5}}
                    left={
                        <React.Fragment>
                          <PanelHeaderBack onClick={() => goBack()}/>
                          <PanelHeaderButton><Icon28HelpCircleOutline onClick={() => this.props.openModal('MODAL_PAGE_TOP_INFO')} /></PanelHeaderButton>
                        </React.Fragment>
                      }
                >
                    Топ студентов
                </PanelHeader>
                
                <SimpleCell
                expandable = 'true'
                description="Гений разработки и дизайна"
                href="https://vk.com/id214477552" target="_blank"
                before={
                    <div className="GlobalPlace__container">
                        <div className="GlobalPlace__indicator">
                            1
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun1-15.userapi.com/impg/MvErWkYtBrLQcYNg_ubfiuqvfNT3dIC02Elr-Q/XedyG5QFNK8.jpg?size=1620x2160&quality=95&sign=98ba5a99b44fec8c9568985c65058bb3&type=album"} className="avatar__photo" />
                            <div className="avatar__indicator" >
                                <svg style={numericIndicator} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 14C0 6.268 6.268 0 14 0C21.732 0 28 6.268 28 14C28 21.732 21.732 28 14 28C6.268 28 0 21.732 0 14Z" fill="url(#paint_linear)"/>
                                    <path d="M11.3325 21.1202L9.16742 19.8702" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8877 6.48039C16.0084 6.76786 9.3357 8.39974 9.33491 17.0801L13.665 19.5801C21.1013 15.1987 19.2403 8.64157 18.5652 6.87447C18.5144 6.74122 18.4194 6.62943 18.2961 6.55772C18.1728 6.48601 18.0287 6.45872 17.8877 6.48039V6.48039Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10.9874 10.7596L7.39676 12.0803C7.30707 12.1133 7.22614 12.1664 7.1602 12.2356C7.09425 12.3047 7.04504 12.3881 7.01635 12.4792L5.67963 16.7262C5.64777 16.8274 5.64221 16.9351 5.66348 17.0391C5.68475 17.1431 5.73215 17.2399 5.80121 17.3205C5.87027 17.4011 5.95872 17.4628 6.05822 17.4998C6.15771 17.5367 6.26498 17.5477 6.3699 17.5317L9.3349 17.0801" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.3 14.9164L18.9641 18.7587C18.9804 18.8529 18.9748 18.9495 18.9479 19.0412C18.921 19.1329 18.8734 19.2172 18.8088 19.2876L15.7992 22.5687C15.7275 22.647 15.637 22.7056 15.5363 22.7392C15.4356 22.7727 15.328 22.7801 15.2237 22.7606C15.1194 22.7411 15.0217 22.6953 14.94 22.6276C14.8583 22.56 14.7951 22.4726 14.7565 22.3737L13.665 19.5801" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.6288 12.0537C15.508 12.2629 15.2405 12.3346 15.0312 12.2138C14.8219 12.093 14.7502 11.8254 14.8711 11.6162C14.9919 11.4069 15.2594 11.3352 15.4687 11.4561C15.678 11.5769 15.7496 11.8444 15.6288 12.0537Z" fill="white" stroke="white"/>
                                    <defs>
                                        <linearGradient id="paint_linear" x1="-14" y1="14" x2="14" y2="42" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#70B2FF"/>
                                            <stop offset="1" stopColor="#5C9CE6"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                }
                >
                    Сергей Ушаков
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Отец русских мемов"
                href="https://vk.com/id167786810" target="_blank"
                before={
                    <div className="GlobalPlace__container">
                        <div className="GlobalPlace__indicator">
                            2
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-84.userapi.com/s/v1/if2/Ko0cSBGD-BwzqulGBozgmW0EwxQlQfv_c9l-6HjLC54PKR4HAWxKXnMmMD3xsGKlIW3Yc5Z_0-eP9chofP_I7QbR.jpg?size=994x784&quality=95&type=album"} className="avatar__photo" />
                            <div className="avatar__indicator" >
                                <Icon20DonateCircleFillYellow style={numericIndicator} />
                            </div>
                        </div>
                    </div>
                }
                >
                    Андрей Харитонов
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Пожизненный фармер V4"
                href="https://vk.com/id142033810" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            3
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-63/impf/c845521/v845521377/591d5/tQ7y7zGJ3hY.jpg?size=1455x2160&quality=96&sign=f988aba8906ce71495de33b6a6ab3e19&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Александр Макаров
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Главный спортик на районе"
                href="https://vk.com/id535529459" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            4
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-26/impg/WF15zKBdDGp95p4E4fuaREOz1EGHI5L5mvkM3Q/F63LD-YKEXw.jpg?size=2160x2160&quality=96&sign=cfbd0c031ed0c361ea121cecdfc07b50&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Илья Некрасов
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Ответственный за холодильник"
                href="https://vk.com/id370154348" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            5
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-54/impg/BOZq69dHaojKUOMOephi3huDlbHQ5reEnM3Mtg/KbzBI_xzNc8.jpg?size=1200x1600&quality=96&sign=e0175425a52a63c1e2aba4f074949b09&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Николай Прусаков
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Спортик XXL"
                href="https://vk.com/id234042829" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            6
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-34.userapi.com/impg/ng5xdkJX6Pz65MYjMdQrH6MSQFiNJEPOufdg2g/-zNQ6HWdJeA.jpg?size=1620x2160&quality=95&sign=06208e0751992167024af12046451061&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Александр Цыганков
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Ответственный за сервер"
                href="https://vk.com/id166167463" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            7
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-54/impg/VCXeDshShuvV-qXIMSmyeejaYMrv4Mil2BcHEQ/bDs0Nu0vFnE.jpg?size=1622x2160&quality=96&sign=c0562c92699542aaf0f8aaac37ab16ff&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Никита Мосалыгин
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Работник года"
                href="https://vk.com/id186241000" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            8
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-74.userapi.com/impg/q7zhvQbal-fWakBJtqNjL9NVVerDUVnQ_RbACw/QwMNKhwkwUw.jpg?size=1620x2160&quality=95&sign=4eb6e1ab6fccb772c429a3b1c9713809&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Иван Ерёменко
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Темные очки (тартар)"
                href="https://vk.com/id181256924" target="_blank"
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            9
                        </div>
                        <div className="avatar">
                            <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-85/impg/671acVSTpP_yWuYrFO6B8wAz1uig-k37nt2v8A/h3rZChtgbU8.jpg?size=2080x2080&quality=96&sign=555f9e75150ed072d82e3c954cd53458&type=album"} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Артём Лукашов
                </SimpleCell>

                <SimpleCell
                expandable = 'true'
                description="Тут может быть твое имя"
                onClick={() => this.props.openModal('MODAL_PAGE_TOP_INFO')}
                before={
                    <div className="GlobalPlace__container" >
                        <div className="GlobalPlace__indicator">
                            10
                        </div>
                        <div className="avatar">
                            <Avatar size={48} className="avatar__photo" />
                        </div>
                    </div>
                }
                >
                    Your Name
                </SimpleCell>

            </Panel>
        );
    }

}

const mapDispatchToProps = {
    goBack,
    openModal
};

export default connect(null, mapDispatchToProps)(TopStudent);