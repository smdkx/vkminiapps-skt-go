import React, {useEffect, useRef, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Button, Card, Placeholder, Spinner} from '@vkontakte/vkui';
import {sendBridgeRequest} from '../services/bridge';

export default function DocumentImage(props) {
    return <DocumentImageSource key={props.src} {...props}/>;
}

function DocumentImageSource({src, title, onError, preview = false}) {
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);
    const [opening, setOpening] = useState(false);
    const [nativeViewer, setNativeViewer] = useState(false);
    const mounted = useRef(false);
    const currentAttempt = useRef(0);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (!bridge.isEmbedded()) return;
        let cancelled = false;
        const timeout = setTimeout(() => { cancelled = true; }, 15000);
        bridge.supportsAsync('VKWebAppShowImages').then(supported => {
            if (!cancelled) setNativeViewer(supported);
        }).catch(() => {}).finally(() => clearTimeout(timeout));
        return () => { cancelled = true; clearTimeout(timeout); };
    }, []);

    useEffect(() => {
        if (status !== 'loading') return;
        const timeout = setTimeout(() => {
            setStatus('error');
            onError('Изображение загружается слишком долго.');
        }, 15000);
        return () => clearTimeout(timeout);
    }, [status, attempt, onError]);

    const retry = () => {
        currentAttempt.current++;
        setAttempt(currentAttempt.current);
        setStatus('loading');
        onError(null);
    };

    const openImage = event => {
        if (opening) { event.preventDefault(); return; }
        if (!nativeViewer) return;
        event.preventDefault();
        setOpening(true);
        onError(null);
        sendBridgeRequest('VKWebAppShowImages', {images: [event.currentTarget.href], start_index: 0})
            .catch(() => { if (mounted.current) onError('Не удалось открыть изображение.'); })
            .finally(() => { if (mounted.current) setOpening(false); });
    };

    const imageUrl = new URL(src, window.location.href);
    if (attempt) imageUrl.searchParams.set('retry', String(attempt));

    return <Card mode="outline" className={`DocumentImage${preview ? ' DocumentImage--preview' : ''}`}
        aria-busy={status === 'loading'}>
        {status === 'loading' && <div className="DocumentImage__loading" role="status">
            <Spinner aria-hidden size="l"/><span>Загружаем изображение…</span>
        </div>}
        {status === 'error' ? <Placeholder title="Изображение недоступно"
            action={<Button size="m" onClick={retry}>Повторить загрузку</Button>}/>
            : <a className="DocumentImage__link" href={src} target="_blank" rel="noopener noreferrer"
                aria-label={`Открыть: ${title}`} onClick={openImage}
                style={{display: status === 'ready' ? 'block' : 'none'}}>
                <img key={attempt} src={imageUrl.href} alt={title}
                    onLoad={() => { if (attempt === currentAttempt.current) setStatus('ready'); }}
                    onError={() => {
                        if (attempt !== currentAttempt.current) return;
                        setStatus('error');
                        onError('Не удалось загрузить изображение.');
                    }}/>
            </a>}
    </Card>;
}
