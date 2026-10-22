import {sendBridgeRequest} from './bridge';

const COMMUNITY_ID = 204275493;
const COMMUNITY_SCREEN_NAME = 'teamskt';

const communityError = (code) => Object.assign(new Error('Не удалось подтвердить подписку на сообщество.'), {code});

const getCommunity = async () => {
    const group = await sendBridgeRequest('VKWebAppGetGroupInfo', {group_id: COMMUNITY_ID});
    if (!group || group.id !== COMMUNITY_ID || typeof group.screen_name !== 'string' ||
        group.screen_name.toLowerCase() !== COMMUNITY_SCREEN_NAME) {
        throw communityError('COMMUNITY_MISMATCH');
    }
    if (group.is_member !== 0 && group.is_member !== 1) throw communityError('INVALID_GROUP_RESPONSE');
    return group;
};

export const subscribeToCommunity = async () => {
    const group = await getCommunity();
    if (group.is_member === 1) return 'already_subscribed';

    const result = await sendBridgeRequest('VKWebAppJoinGroup', {group_id: group.id}, 60000);
    if (!result || result.result !== true) throw communityError('JOIN_NOT_CONFIRMED');
    const updated = await getCommunity();
    return updated.is_member === 1 ? 'subscribed' : 'pending';
};

export const getCommunityErrorMessage = (error) => {
    if (error && error.code === 'UNSUPPORTED_ENVIRONMENT') return 'Откройте приложение внутри ВКонтакте.';
    if (error && error.code === 'UNSUPPORTED_METHOD') return 'Действие недоступно в этом клиенте.';
    if (error && error.code === 'BRIDGE_TIMEOUT') return 'Сервер не ответил вовремя.';
    if (error && error.code === 'COMMUNITY_MISMATCH') return 'Не удалось получить данные сообщества.';
    return 'Не удалось подтвердить подписку.';
};
