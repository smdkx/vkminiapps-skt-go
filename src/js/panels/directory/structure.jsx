import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Box, Group, Panel, PanelHeaderBack, Title, Text} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import PanelHeader from '../../components/AppPanelHeader';
import NoticeBanner from '../../components/NoticeBanner';
import DocumentImage from '../../components/DocumentImage';
import {goBack} from '../../store/router/actions';

const documents = [{'src': 'https://i.postimg.cc/098n9Df8/orgstruct.jpg', 'title': 'Организационная структура колледжа'}];

function Documents({id, goBack}) {
    const [error, setError] = useState(null);
    return <Panel id={id} className="DirectoryPanel">
        <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>
            Структура
        </PanelHeader>
        <Group mode="plain" separator="hide">
            <Box padding="system"><NoticeBanner title="Документы колледжа"
                subtitle="Сохранённая организационная структура. Актуальные сведения уточняйте на сайте колледжа."/></Box>
            <Box padding="system">
                <Text Component="p" className="DirectoryDocuments__hint">Нажмите на изображение, чтобы рассмотреть детали.</Text>
                <div className="DirectoryDocuments__grid DirectoryDocuments__grid--single">
                    {documents.map(document => <article key={document.src}>
                        <DocumentImage src={document.src} title={document.title} onError={setError}/>
                        <Title Component="h2" level="3" className="DirectoryDocuments__title">{document.title}</Title>
                    </article>)}
                </div>
            </Box>
        </Group>
        {error && <Snackbar onClosed={() => setError(null)}>{error}</Snackbar>}
    </Panel>;
}

export default connect(null, {goBack})(Documents);
