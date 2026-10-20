import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
    Box, Group, Panel,
    PanelHeaderBack, Title,
} from '@vkontakte/vkui';
import Snackbar from './AppSnackbar';
import NoticeBanner from './NoticeBanner';
import PanelHeader from './AppPanelHeader';
import {goBack} from '../store/router/actions';
import DocumentImage from './DocumentImage';


function SchedulePanel({id, title, documentTitle, notice, src, documents, goBack}) {
    const [error, setError] = useState(null);
    const images = documents || [{src, title: documentTitle}];

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>{title}</PanelHeader>
            <Group mode="plain" separator="hide">
                <Box padding="system"><NoticeBanner appearance="warning" title="Сохранённое расписание" subtitle={notice}/></Box>
                <Box padding="system" className="SchedulePanel__document">
                    <Title level="2" weight="2" Component="h2">{documentTitle}</Title>
                    <p className="SchedulePanel__hint">Нажмите на изображение, чтобы рассмотреть детали.</p>
                    {images.map(image => <React.Fragment key={image.src}>
                        {images.length > 1 && <Title level="3" weight="2" Component="h3">{image.title}</Title>}
                        <div className="SchedulePanel__image"><DocumentImage src={image.src} title={image.title} onError={setError}/></div>
                    </React.Fragment>)}
                </Box>
            </Group>
            {error && <Snackbar key={error} onClosed={() => setError(null)}>{error}</Snackbar>}
        </Panel>
    );
}

export default connect(null, {goBack})(SchedulePanel);
