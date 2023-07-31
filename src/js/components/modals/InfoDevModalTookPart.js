import React from 'react';
import {connect} from 'react-redux';

import {
    ModalPage, 
    ModalPageHeader, 
    PanelHeaderButton, 
    withPlatform, 
    IOS, 
    Div,
    Group,
    SimpleCell,
    Card,
    Avatar
} from "@vkontakte/vkui";

import { 
    Icon24Dismiss,
    Icon24Cancel,
    Icon20DonateCircleFillYellow
} from '@vkontakte/icons';

import queryString from 'query-string';

const numericIndicator = {
    height: 20,
    width: 20,
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 13,
    boxShadow: '0 4px 24px 0 rgb(0 0 0 / 8%), 0 0 12px 0 rgb(0 0 0 / 8%)',
}

class InfoDevModalTookPart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            device: ''
        };

    }

    componentDidMount() {
        var params = queryString.parse(window.location.search);
        this.setState({
            device: params.vk_platform
        });
    }

    render() {
        const {id, onClose, platform} = this.props;

        return (
            <ModalPage
                id={id}
                header={
                    <ModalPageHeader
                        left={platform !== IOS &&
                        <PanelHeaderButton onClick={onClose}><Icon24Cancel/></PanelHeaderButton>}
                        right={platform === IOS &&
                        <PanelHeaderButton onClick={onClose}><Icon24Dismiss/></PanelHeaderButton>}
                    >
                        Приняли участие
                    </ModalPageHeader>
                }
                onClose={() => {
                    onClose();
                    //document.body.style.overflow = 'auto';
                }}
                settlingHeight={100}
            >
                <Div>
                    <Group>
                        <Card size="l" mode="shadow">
                            <SimpleCell
                            expandable = 'true'
                            href="https://vk.com/id167786810" target="_blank"
                            before={
                            <div className="avatar">
                                <Avatar size={48} src={"https://sun9-84.userapi.com/s/v1/if2/Ko0cSBGD-BwzqulGBozgmW0EwxQlQfv_c9l-6HjLC54PKR4HAWxKXnMmMD3xsGKlIW3Yc5Z_0-eP9chofP_I7QbR.jpg?size=994x784&quality=95&type=album"} className="avatar__photo" />
                                <div className="avatar__indicator" >
                                    <Icon20DonateCircleFillYellow style={numericIndicator} />
                                </div>
                            </div>
                            }
                            description='Memes generator'
                            >
                                Андрей Харитонов
                            </SimpleCell>

                            <SimpleCell
                            expandable = 'true'
                            href="https://vk.com/id142033810" target="_blank"
                            before={
                                <div className="avatar">
                                    <Avatar size={48} src={"https://sun9-29.userapi.com/sun9-63/impf/c845521/v845521377/591d5/tQ7y7zGJ3hY.jpg?size=1455x2160&quality=96&sign=f988aba8906ce71495de33b6a6ab3e19&type=album"} className="avatar__photo" />
                                </div>
                            }
                            description='Не пытается починить настройки'
                            >
                                Александр Макаров
                            </SimpleCell>
                        </Card>
                    </Group>
                    {this.state.device !== 'mobile_iphone' && <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                    </div>}
                </Div>
            </ModalPage>
        );
    }

}

export default withPlatform(connect()(InfoDevModalTookPart));
