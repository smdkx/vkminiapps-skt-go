import React from 'react';
import {connect} from 'react-redux';

import {setPage, goBack} from "../store/router/actions";

import { images_memes } from '../components/data/random.data'

import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Div,
    Button,
    Title,
    Text,
    Footer
} from "@vkontakte/vkui";

class Random extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            loader: false,
            memes: null,
        };

        this.random = this.random.bind(this);
    }

    async componentDidMount() {
        document.getElementsByClassName('Tabbar')[0].style.display = 'none'; //отключаем таббар
    }

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    random() {
        let memes = images_memes[this.randomInteger(0, 199)].memes;
        this.setState({ memes: memes });
        bridge.send("VKWebAppTapticNotificationOccurred", {"type": "success"}); //вибро
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id} centered={true}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                     Случайный мем
                </PanelHeader>

                {this.state.memes == null && (
                <Group>
                    <Div className="random__div">
                        <Title level="1" weight="bold" style={{ marginBottom: 16 }}>
                            Случайный мем
                        </Title>
                        <Text weight="regular">
                            Хочешь получить случайный мем? Кликай на кнопку ниже!
                        </Text> <br />
                        <Button size="l" stretched mode="secondary" onClick={this.random}>
                            Погнали!
                        </Button>
                        <Footer>Общее количество мемов: более 200 шт. Присутствует шанс их повторения.</Footer>
                    </Div>
                </Group>
                )}

                {this.state.memes !== null && (
                <Group>
                    <Div className="random__div">
                        <Text weight="regular">
                            <img className="random__block" src={this.state.memes} alt="memes" />
                        </Text> <br />
                        <Button size="l" stretched mode="secondary" onClick={this.random}>
                            Получить новый мем!
                        </Button>
                    </Div>
                </Group>
                )}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack
};

export default connect(null, mapDispatchToProps)(Random);