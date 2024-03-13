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
                            <div className="Avatar__photo">
                                <Avatar size={48} src={"https://sun136-1.userapi.com/s/v1/if2/DTOIjd_si5Wi42AWsrkx7QzqArrv1d933u9RN23EZZBwpT3EBkMPCr9gmHRUt-qdRFBLTtXT4_SkRKPffP_do4gy.jpg?quality=95&crop=26,0,835,835&as=50x50,100x100,200x200,400x400&ava=1&u=WQiyUHYp0GsWN1eWFIvu5e4m1c-oORsJqCXKMkfxPJs&cs=200x200"} />
                                <div className="Avatar__indicator" >
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
                                <div className="Avatar__photo">
                                    <Avatar size={48} src={"https://sun136-2.userapi.com/s/v1/if2/HLkSlW2YQLpC7C0CM_8My2UJQigGp2-940Qr7U7q-H2CnPDmQ0MvLBtxfNetQTRVhKi1zsOtsLfkxx5vboXXb6aD.jpg?quality=95&crop=316,429,1036,1036&as=50x50,100x100,200x200,400x400&ava=1&u=WufiXWhllfVsDbgdq7ivFRImaN-1GHzdkTMQSqBggts&cs=200x200"} />
                                    <div className="Avatar__indicator" >
                                        <Icon20DonateCircleFillYellow style={numericIndicator} />
                                    </div>
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
