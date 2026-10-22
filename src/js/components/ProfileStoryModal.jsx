import React, {useEffect, useState, useRef} from 'react';
import {AppRootPortal, ModalPage, PanelHeaderButton, Box, Button, Text, Spinner, Placeholder} from '@vkontakte/vkui';
import {Icon24Dismiss, Icon28StoryOutline} from '@vkontakte/icons';
import ModalPageHeader from './AppModalPageHeader';
import Snackbar from './AppSnackbar';
import {createProfileStory, shareProfileStory} from '../services/profileStory';

export default function ProfileStoryModal({open, onClose, user, group, earned, activePremium}) {
    const [preview, setPreview] = useState(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [sharing, setSharing] = useState(false);
    const [message, setMessage] = useState(null);
    const pending = useRef(false);
    const mounted = useRef(false);
    const generation = useRef(0);
    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        generation.current += 1;
        if (!open || !user) return;
        let cancelled = false;
        setPreview(null);
        setFailed(false);
        setMessage(null);
        createProfileStory({user, group, earned, activePremium}).then(image => {
            if (!cancelled) setPreview(image);
        }).catch(() => {
            if (!cancelled) {
                setFailed(true);
                setMessage('Не удалось создать карточку.');
            }
        });
        return () => { cancelled = true; };
    }, [open, user, group, earned, activePremium, attempt]);

    const share = async () => {
        if (!preview || pending.current) return;
        pending.current = true;
        const currentGeneration = generation.current;
        setSharing(true);
        setMessage(null);
        try {
            await shareProfileStory(preview);
        } catch (error) {
            if (!mounted.current || generation.current !== currentGeneration) return;
            // User denied/cancelled is a normal exit from the native editor.
            if (error?.error_data?.error_code === 4) return;
            setMessage(error?.code === 'UNSUPPORTED_ENVIRONMENT' ? 'Откройте приложение внутри ВКонтакте.'
                : error?.code === 'UNSUPPORTED_METHOD' ? 'Истории недоступны в этом клиенте.'
                : error?.code === 'BRIDGE_TIMEOUT' ? 'Нет ответа от редактора VK.' : 'Не удалось открыть редактор истории.');
        } finally {
            pending.current = false;
            if (mounted.current) setSharing(false);
        }
    };

    return <AppRootPortal usePortal><ModalPage id="MODAL_PAGE_PROFILE_STORY" open={open} onClose={onClose} dynamicContentHeight
        footer={<Box padding="system"><Button size="l" stretched before={<Icon28StoryOutline/>} loading={sharing}
            disabled={!preview || sharing} onClick={share}>В историю</Button></Box>}
        header={<ModalPageHeader after={<PanelHeaderButton aria-label="Закрыть окно" onClick={onClose}>
            <Icon24Dismiss/>
        </PanelHeaderButton>}>Поделиться профилем</ModalPageHeader>}>
        <Box padding="system" className="ProfileStory">
            {failed ? <Placeholder title="Карточка профиля"
                action={<Button onClick={() => setAttempt(value => value + 1)}>Повторить</Button>}/>
                : preview ? <img className="ProfileStory__image" src={preview} alt="Карточка профиля для истории: имя, группа и достижения"/>
                : <div className="ProfileStory__loading"><Spinner size="l" aria-label="Создаём карточку профиля"/></div>}
            <Text className="ProfileStory__hint">Карточку можно опубликовать истории ВКонтакте.</Text>
        </Box>
        {message && <Snackbar onClosed={() => setMessage(null)}>{message}</Snackbar>}
    </ModalPage></AppRootPortal>;
}
