import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import {
    Banner, Button, Card, Div, Group, Panel, PanelHeader,
    PanelHeaderBack, Placeholder, Snackbar, Spinner, Title,
} from '@vkontakte/vkui';
import {Icon28InfoOutline} from '@vkontakte/icons';
import {goBack} from '../store/router/actions';
import {sendBridgeRequest} from '../services/bridge';

function ScheduleImage({src, title, setError}) {
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);
    const [opening, setOpening] = useState(false);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const imageFailed = () => {
        setStatus('error');
        setError('Не удалось загрузить расписание.');
    };

    useEffect(() => {
        if (status !== 'loading') return;
        const timeout = setTimeout(() => {
            setStatus('error');
            setError('Расписание загружается слишком долго.');
        }, 15000);
        return () => clearTimeout(timeout);
    }, [status, attempt, setError]);

    const openImage = (event) => {
        if (opening) {
            event.preventDefault();
            return;
        }
        // Обычная ссылка работает и вне VK; в клиенте используем его просмотрщик.
        if (!bridge.isEmbedded() || !bridge.supports('VKWebAppShowImages')) return;
        event.preventDefault();
        const imageUrl = event.currentTarget.href;
        setOpening(true);
        setError(null);
        sendBridgeRequest('VKWebAppShowImages', {images: [imageUrl], start_index: 0})
            .catch(() => {
                if (mounted.current) setError('Не удалось открыть расписание.');
            })
            .finally(() => {
                if (mounted.current) setOpening(false);
            });
    };

    const imageSrc = attempt ? `${src}?retry=${attempt}` : src;

    return (
        <div className="SchedulePanel__image">
            <Card mode="outline" className="ScheduleImage">
                {status === 'loading' && <div className="ScheduleImage__loading" role="status">
                    <Spinner size="medium"/>
                    <span>Загружаем расписание…</span>
                </div>}
                {status === 'error' ? <Placeholder
                    header="Изображение расписания"
                    action={<Button size="m" onClick={() => {
                        setError(null);
                        setAttempt(attempt + 1);
                        setStatus('loading');
                    }}>Повторить загрузку</Button>}
                /> : <a
                    className="ScheduleImage__preview"
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={openImage}
                    aria-label={`Увеличить: ${title}`}
                    aria-busy={opening}
                    style={{display: status === 'ready' ? 'block' : 'none'}}
                >
                    <img key={attempt} src={imageSrc} alt={title}
                        onLoad={() => setStatus('ready')} onError={imageFailed}/>
                </a>}
            </Card>
        </div>
    );
}

function SchedulePanel({id, title, documentTitle, notice, src, documents, goBack}) {
    const [error, setError] = useState(null);
    const images = documents || [{src, title: documentTitle}];

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack}/>}>{title}</PanelHeader>
            <Group>
                <Banner before={<Icon28InfoOutline/>} header="Сохранённое расписание" subheader={notice}/>
                <Div className="SchedulePanel__document">
                    <Title level="2" weight="2" Component="h2">{documentTitle}</Title>
                    <p className="SchedulePanel__hint">Нажмите на изображение, чтобы рассмотреть детали.</p>
                    {images.map(image => <React.Fragment key={image.src}>
                        {images.length > 1 && <Title level="3" weight="2" Component="h3">{image.title}</Title>}
                        <ScheduleImage src={image.src} title={image.title} setError={setError}/>
                    </React.Fragment>)}
                </Div>
            </Group>
            {error && <Snackbar key={error} onClose={() => setError(null)}>{error}</Snackbar>}
        </Panel>
    );
}

export default connect(null, {goBack})(SchedulePanel);
