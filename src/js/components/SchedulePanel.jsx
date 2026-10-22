import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Group, Panel, PanelHeaderBack, Title, Footnote} from '@vkontakte/vkui';
import Snackbar from './AppSnackbar';
import NoticeBanner from './NoticeBanner';
import PanelHeader from './AppPanelHeader';
import {goBack} from '../store/router/actions';
import DocumentImage from './DocumentImage';

function SchedulePanel({id, title, documentTitle, notice, noticeTitle = 'Сохраненное расписание', src, documents, goBack}) {
    const [error, setError] = useState(null);
    const images = documents || [{src, title: documentTitle}];

    return <Panel id={id} mode="card">
        <PanelHeader before={<PanelHeaderBack hideLabelOnIOS onClick={goBack}/>}>{title}</PanelHeader>
        <div className="ScheduleDocumentLayout">
            <NoticeBanner appearance="warning" title={noticeTitle} subtitle={notice}/>
            {images.map(image => <Group key={image.src} mode="card" separator="hide" className="ScheduleDocumentSection">
                <div className="ScheduleDocumentSection__heading">
                    <Title level="2" weight="2" Component="h2">{documentTitle}</Title>
                    {image.title !== documentTitle && <Footnote Component="p" className="ScheduleDocumentSection__groups">{image.title}</Footnote>}
                    <Footnote Component="p" className="SchedulePanel__hint">Нажмите, чтобы увеличить</Footnote>
                </div>
                <div className="SchedulePanel__image"><DocumentImage src={image.src} title={image.title} onError={setError}/></div>
            </Group>)}
        </div>
        {error && <Snackbar key={error} onClosed={() => setError(null)}>{error}</Snackbar>}
    </Panel>;
}

export default connect(null, {goBack})(SchedulePanel);
