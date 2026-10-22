import React from 'react';
import {connect} from 'react-redux';
import {Panel, PanelHeaderBack, Group, Title, Text, Footnote, Button} from '@vkontakte/vkui';
import {Icon28MessageOutline, Icon28LikeOutline, Icon28LightbulbOutline, Icon28BugOutline} from '@vkontakte/icons';
import {goBack} from '../store/router/actions';
import PanelHeader from '../components/AppPanelHeader';

const topics = [
    {title: 'Поделиться впечатлениями', description: 'Что нравится и что можно сделать удобнее.', Icon: Icon28LikeOutline},
    {title: 'Предложить идею', description: 'Какой возможности вам не хватает.', Icon: Icon28LightbulbOutline},
    {title: 'Сообщить об ошибке', description: 'Что не работает и как это повторить.', Icon: Icon28BugOutline},
];

function Feedback({id, goBack}) {
    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>Отзыв о приложении</PanelHeader>
        <div className="FeedbackLayout">
            <Group mode="card" separator="hide" className="FeedbackSection">
                <div className="FeedbackContent">
                    <div className="FeedbackIntro">
                        <span className="FeedbackIntro__icon"><Icon28MessageOutline width={32} height={32} aria-hidden="true"/></span>
                        <Title Component="h2" level="1" weight="2" className="FeedbackIntro__title">Вам слово</Title>
                        <Text className="FeedbackIntro__description">Помогите сделать SKT Go лучше. Расскажите о своем опыте в анкете.</Text>
                    </div>
                    <ul className="FeedbackTopics" aria-label="О чем можно написать">
                        {topics.map(({title, description, Icon}) => <li key={title} className="FeedbackTopic">
                            <span className="FeedbackTopic__icon"><Icon aria-hidden="true"/></span>
                            <div className="FeedbackTopic__text">
                                <Text Component="h3" weight="2" className="FeedbackTopic__title">{title}</Text>
                                <Footnote Component="p" className="FeedbackTopic__description">{description}</Footnote>
                            </div>
                        </li>)}
                    </ul>
                    <div className="FeedbackActions">
                        <Button href="https://vk.com/app5619682_-204275493#574358" target="_blank" rel="noopener noreferrer" size="l" stretched>Перейти к анкете</Button>
                        <Footnote Component="p" className="FeedbackActions__hint">Анкета откроется в VK. Оставить отзыв можно несколько раз.</Footnote>
                    </div>
                </div>
            </Group>
        </div>
    </Panel>;
}

export default connect(null, {goBack})(Feedback);
