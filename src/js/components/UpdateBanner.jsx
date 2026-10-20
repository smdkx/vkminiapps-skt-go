import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Banner, Box, Button} from '@vkontakte/vkui';
import {isPremium, shouldShowBanners} from '../store/premium';
import {openModal} from '../store/router/actions';

export default function UpdateBanner() {
    const dispatch = useDispatch();
    const [dismissed, setDismissed] = useState(false);
    const premium = useSelector(isPremium);
    const showBanners = useSelector(shouldShowBanners);
    if (!showBanners || (premium && dismissed)) return null;

    return <Box padding="system" className="StandaloneBanner">
        <Banner mode="image" imageTheme="dark" size="m"
            title="Мы обновились!"
            subtitle="Узнай что нового было добавлено в свежую версию приложения"
            background={<div style={{backgroundColor: '#215db0', backgroundImage: 'linear-gradient(120deg, #215db0, #244c83)'}}/>}
            after={premium ? 'dismiss' : undefined}
            dismissLabel="Скрыть баннер об обновлениях"
            onDismiss={() => { if (premium) setDismissed(true); }}
            actions={<Button mode="primary" appearance="overlay" size="m"
                onClick={() => dispatch(openModal('MODAL_PAGE_UPDATE_INFO'))}>Подробнее</Button>}
        />
    </Box>;
}
