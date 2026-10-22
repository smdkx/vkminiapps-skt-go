import React from 'react';
import {Icon28CheckShieldDeviceOutline} from '@vkontakte/icons';
import DirectoryPage, {DirectorySection, DirectoryFacts, DirectoryLinks} from '../../components/DirectoryPage';
import {securityLinks} from '../../components/data/directory.data';

export default function Security({id}) {
    return <DirectoryPage id={id} title="Безопасность" introTitle="Безопасность в интернете"
        description="Памятки и материалы для студентов и родителей." Icon={Icon28CheckShieldDeviceOutline}>
        <DirectorySection title="Полезно помнить"><DirectoryFacts items={[
            {label: 'Пароли и коды', value: 'Не передавайте пароли и коды подтверждения другим людям.'},
            {label: 'Ссылки', value: 'Проверяйте адрес сайта перед входом в аккаунт.'},
            {label: 'Личные данные', value: 'Не публикуйте документы и другие личные сведения в открытом доступе.'},
        ]}/></DirectorySection>
        <DirectorySection title="Материалы колледжа"><DirectoryLinks items={securityLinks}/></DirectorySection>
    </DirectoryPage>;
}
