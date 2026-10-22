import React, {useState} from 'react';
import {Title, Footnote} from '@vkontakte/vkui';
import {Icon28Cards2Outline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection} from '../../components/DirectoryPage';
import {diplomaDocuments} from '../../components/data/directory.data';
import DocumentImage from '../../components/DocumentImage';
import Snackbar from '../../components/AppSnackbar';

export default function Diploma({id}) {
    const [error, setError] = useState(null);
    return <DirectoryPage id={id} title="Дипломы" introTitle="Образцы дипломов"
        description="Документы о среднем профессиональном образовании из галереи колледжа." Icon={Icon28Cards2Outline}
        snackbar={error && <Snackbar key={error} onClosed={() => setError(null)}>{error}</Snackbar>}>
        <Footnote Component="p" className="DirectoryDocuments__hint">Нажмите на изображение, чтобы увеличить</Footnote>
        <div className="DirectoryDiplomas">{diplomaDocuments.map(document => <DirectorySection key={document.src} className="DirectoryDocument">
            <div className="DirectoryDocument__image"><DocumentImage src={document.src} title={document.title} onError={setError} preview/></div>
            <Title Component="h3" level="3" weight="2" className="DirectoryDocument__title">{document.title}</Title>
        </DirectorySection>)}</div>
    </DirectoryPage>;
}
