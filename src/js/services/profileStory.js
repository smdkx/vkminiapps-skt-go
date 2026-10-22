import {achievementCatalog, CREATOR_ID} from '../components/data/achievements.data';
import {getCurrentAppId, sendBridgeRequest} from './bridge';

const loadImage = src => new Promise(resolve => {
    if (!src) return resolve(null);
    const image = new Image();
    const finish = result => {
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        resolve(result);
    };
    const timer = setTimeout(() => finish(null), 5000);
    image.crossOrigin = 'anonymous';
    image.onload = () => finish(image);
    image.onerror = () => finish(null);
    image.src = src;
});

// A local canvas avoids uploading the user's profile to a separate image service.
export const createProfileStory = async ({user, group, earned, activePremium}) => {
    const received = achievementCatalog.filter(item => earned[item.id]);
    const [avatar, ...icons] = await Promise.all([
        loadImage(user.photo_200),
        ...received.slice(0, 4).map(item => loadImage(item.image)),
    ]);
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Не удалось создать карточку.');

    const roundRect = (x, y, width, height, radius, color) => {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + width, y, x + width, y + height, radius);
        context.arcTo(x + width, y + height, x, y + height, radius);
        context.arcTo(x, y + height, x, y, radius);
        context.arcTo(x, y, x + width, y, radius);
        context.fill();
    };
    const text = (value, y, size, color = '#172b4d', weight = 500, maxWidth = 560) => {
        context.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        // Fit long names without horizontally stretching the letters.
        while (size > 18 && context.measureText(value).width > maxWidth) {
            size -= 1;
            context.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        }
        context.fillStyle = color;
        context.textAlign = 'center';
        context.fillText(value, 360, y, maxWidth);
    };

    const background = context.createLinearGradient(0, 0, 720, 1280);
    background.addColorStop(0, '#e5efff');
    background.addColorStop(1, '#cddfff');
    context.fillStyle = background;
    context.fillRect(0, 0, 720, 1280);
    text('SKT Go', 152, 42, '#2979d6', 700);
    text('МОЙ ПРОФИЛЬ', 203, 18, '#536c90', 600);
    roundRect(48, 255, 624, 780, 40, '#ffffff');

    context.save();
    context.beginPath();
    context.arc(360, 408, 82, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = '#e7f0ff';
    context.fillRect(278, 326, 164, 164);
    if (avatar) {
        const side = Math.min(avatar.naturalWidth, avatar.naturalHeight);
        context.drawImage(avatar, (avatar.naturalWidth - side) / 2, (avatar.naturalHeight - side) / 2,
            side, side, 278, 326, 164, 164);
    } else {
        text(`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`, 425, 48, '#2979d6', 600);
    }
    context.restore();
    text(`${user.first_name} ${user.last_name || ''}`.trim(), 556, 38, '#172b4d', 700);
    if (group) text(`Группа ${group}`, 600, 24, '#627590');

    const badges = [user.id === CREATOR_ID && 'Создатель', activePremium && 'VK Donut'].filter(Boolean);
    if (badges.length) {
        const width = 172;
        const start = (720 - (badges.length * width + (badges.length - 1) * 12)) / 2;
        badges.forEach((badge, index) => {
            const x = start + index * (width + 12);
            roundRect(x, 626, width, 40, 20, badge === 'VK Donut' ? '#fff1c9' : '#ffebe5');
            context.fillStyle = badge === 'VK Donut' ? '#805700' : '#a43c24';
            context.font = '600 19px Arial, sans-serif';
            context.textAlign = 'center';
            context.fillText(badge, x + width / 2, 652);
        });
    }

    text(`${received.length} из ${achievementCatalog.length}`, 762, 64, '#2979d6', 700);
    text('достижений получено', 804, 25, '#627590');
    roundRect(160, 834, 400, 10, 5, '#edf2f8');
    if (received.length) roundRect(160, 834, 400 * received.length / achievementCatalog.length, 10, 5, '#4387ed');
    icons.forEach((icon, index) => {
        if (!icon) return;
        const x = (720 - icons.length * 88) / 2 + index * 88 + 8;
        context.save();
        roundRect(x, 884, 72, 72, 15, '#2787f5');
        context.clip();
        context.drawImage(icon, x, 884, 72, 72);
        context.restore();
    });
    if (!received.length) text('Все еще впереди!', 930, 25, '#627590');
    text('Расписание · Достижения · Мемы', 1104, 24, '#3e5f8c');
    text('Увидимся в SKT Go', 1150, 28, '#2979d6', 600);
    return canvas.toDataURL('image/png');
};

export const shareProfileStory = async image => {
    const appId = await getCurrentAppId();
    // The user confirms publication in VK's editor. Resolving this request alone
    // is not evidence that the story was published, so no achievement is awarded.
    return sendBridgeRequest('VKWebAppShowStoryBox', {
        background_type: 'image',
        blob: image,
        attachment: {type: 'url', text: 'open', url: `https://vk.com/app${appId}`},
    }, 120000);
};
