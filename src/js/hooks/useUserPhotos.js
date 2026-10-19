import {useCallback, useEffect, useState} from 'react';
import {loadUserPhotos, getUserPhotosErrorMessage} from '../services/userPhotos';

export default function useUserPhotos(userIds, active) {
    const [photos, setPhotos] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const retry = useCallback(() => setAttempt(value => value + 1), []);

    useEffect(() => {
        if (!active) {
            setLoading(false);
            setError(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        loadUserPhotos(userIds).then(loaded => {
            if (!cancelled) setPhotos(loaded);
        }).catch(error => {
            if (!cancelled) setError(getUserPhotosErrorMessage(error));
        }).finally(() => {
            if (!cancelled) setLoading(false);
        });
        return () => { cancelled = true; };
    }, [userIds, active, attempt]);

    return {photos, loading, error, retry};
}
