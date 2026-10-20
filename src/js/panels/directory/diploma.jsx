import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Box, Group, Panel, PanelHeaderBack, Title, Text} from '@vkontakte/vkui';
import Snackbar from '../../components/AppSnackbar';
import PanelHeader from '../../components/AppPanelHeader';
import NoticeBanner from '../../components/NoticeBanner';
import DocumentImage from '../../components/DocumentImage';
import {goBack} from '../../store/router/actions';

const documents = [{'src': 'https://collegetel.ru/new_site/images/blocks/1716816191.jpg', 'title': 'Образец диплома №1'}, {'src': 'https://collegetel.ru/new_site/images/blocks/1716816190.jpg', 'title': 'Образец диплома №2'}, {'src': 'https://collegetel.ru/new_site/images/blocks/1716816189.jpg', 'title': 'Образец диплома №3'}];

function Documents({id, goBack}) {
    const [error, setError] = useState(null);
    return <Panel id={id} className="DirectoryPanel">
        <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>
            Дипломы
        </PanelHeader>
        <Group mode="plain" separator="hide">
            <Box padding="system"><NoticeBanner title="Документы колледжа"
                subtitle="Образцы дипломов о среднем профессиональном образовании, опубликованные колледжем."/></Box>
            <Box padding="system">
                <Text Component="p" className="DirectoryDocuments__hint">Нажмите на изображение, чтобы рассмотреть детали.</Text>
                <div className="DirectoryDocuments__grid">
                    {documents.map(document => <article key={document.src}>
                        <DocumentImage src={document.src} title={document.title} onError={setError} preview/>
                        <Title Component="h2" level="3" className="DirectoryDocuments__title">{document.title}</Title>
                    </article>)}
                </div>
            </Box>
        </Group>
        {error && <Snackbar onClosed={() => setError(null)}>{error}</Snackbar>}
    </Panel>;
}

export default connect(null, {goBack})(Documents);
