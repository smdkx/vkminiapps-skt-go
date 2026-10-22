import {
    SET_PAGE, SET_STORY, GO_BACK, OPEN_POPOUT, CLOSE_POPOUT, OPEN_MODAL, RESTORE_ROUTER
} from './actionTypes';
import * as VK from '../../services/VK';
import {routerReducer} from './reducers';

// JSX popouts stay in memory; history.state contains only a session and an index.
const historyKey = 'sktGoRouter';
const session = Date.now().toString(36) + Math.random().toString(36).slice(2);
let snapshots = [];
let historyIndex = -1;
let waitingForHistory = false;
let queuedActions = [];
let pendingBack = null;

const browserHistory = () => typeof window !== 'undefined' && window.history;
const sameLocation = (left, right) => left && right &&
    left.activeStory === right.activeStory && left.activeView === right.activeView &&
    left.activePanel === right.activePanel &&
    (left.activeModals[left.activeView] || null) === (right.activeModals[right.activeView] || null) &&
    (left.popouts[left.activeView] || null) === (right.popouts[right.activeView] || null);
const syncSwipeBack = state => {
    const panels = state.swipeBackHistory || [];
    if (panels.length > 1) VK.swipeBackOn();
    else VK.swipeBackOff();
};

const remember = state => {
    const history = browserHistory();
    if (!history) return;
    const first = historyIndex === -1;
    if (first) {
        historyIndex = 0;
        history.scrollRestoration = 'manual';
    } else historyIndex += 1;
    snapshots = snapshots.slice(0, historyIndex + 1);
    snapshots[historyIndex] = state;
    const previousState = history.state && typeof history.state === 'object' ? history.state : {};
    const marker = {...previousState, [historyKey]: {session, index: historyIndex}};
    history[first ? 'replaceState' : 'pushState'](marker, '');
};

const navigate = action => (dispatch, getState) => {
    if (waitingForHistory) {
        queuedActions.push(navigate(action));
        return;
    }
    const before = getState().router;
    // An Alert may invoke its action before or after onClose. Dismiss its entry
    // before navigating, so Back cannot reopen an already accepted Alert.
    if ((action.type === SET_PAGE || action.type === SET_STORY) && before.popouts[before.activeView]) {
        if (browserHistory() && historyIndex > 0) {
            queuedActions.push(navigate(action));
            dispatch(goBack());
        } else {
            dispatch({type: CLOSE_POPOUT});
            dispatch(navigate(action));
        }
        return;
    }
    if (historyIndex >= 0) snapshots[historyIndex] = before;
    dispatch(action);
    const after = getState().router;
    if (before !== after) {
        remember(after);
        if (before.activeStory !== null) syncSwipeBack(after);
    }
    // Only scroll an unchanged tab here. During a panel transition VKUI owns
    // scroll compensation and restoration, including returning to the tab root.
    if (action.type === SET_STORY && before === after && before.activeStory === action.payload.story && typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
};

export const setStory = (story, initial_panel) => navigate({type: SET_STORY, payload: {story, initial_panel}});
export const setPage = (view, panel) => navigate({type: SET_PAGE, payload: {view, panel}});

export const goBack = () => (dispatch, getState) => {
    if (waitingForHistory) return;
    const state = getState().router;
    const parent = routerReducer(state, {type: GO_BACK});
    const history = browserHistory();

    // Panel arrows and swipe-back follow the active tab's stack. Tab switches
    // in browser history must not become the parent of a nested panel.
    let targetIndex = -1;
    if (parent !== state) {
        for (let index = historyIndex - 1; index >= 0; index -= 1) {
            if (sameLocation(snapshots[index], parent)) {
                targetIndex = index;
                break;
            }
        }
    } else if (historyIndex > 0) {
        targetIndex = historyIndex - 1;
    }

    if (history && targetIndex >= 0) {
        snapshots[historyIndex] = state;
        pendingBack = parent !== state ? {index: targetIndex, router: parent} : null;
        waitingForHistory = true;
        history.go(targetIndex - historyIndex);
        return;
    }

    if (parent !== state) {
        dispatch({type: RESTORE_ROUTER, payload: {router: parent}});
        if (history && historyIndex >= 0) {
            snapshots[historyIndex] = parent;
            history.replaceState({...history.state, [historyKey]: {session, index: historyIndex}}, '');
        }
        syncSwipeBack(parent);
        return;
    }
    VK.closeApp();
};

export const handleHistoryChange = event => (dispatch, getState) => {
    const marker = event.state && event.state[historyKey];
    if (!marker || marker.session !== session || !snapshots[marker.index]) {
        waitingForHistory = false;
        queuedActions = [];
        pendingBack = null;
        VK.closeApp();
        return;
    }
    const current = getState().router;
    if (historyIndex >= 0) snapshots[historyIndex] = current;
    historyIndex = marker.index;
    const target = pendingBack && pendingBack.index === historyIndex ? pendingBack.router : snapshots[historyIndex];
    const restored = target;
    pendingBack = null;
    snapshots[historyIndex] = restored;
    dispatch({type: RESTORE_ROUTER, payload: {router: restored}});
    syncSwipeBack(restored);
    waitingForHistory = false;
    const pending = queuedActions;
    queuedActions = [];
    pending.forEach(action => dispatch(action));
};

export const openPopout = popout => navigate({type: OPEN_POPOUT, payload: {popout}});
export const closePopout = () => (dispatch, getState) => {
    const state = getState().router;
    if (state.popouts[state.activeView]) dispatch(goBack());
};
export const openModal = id => (dispatch, getState) => {
    const state = getState().router;
    if (!id) dispatch(closeModal());
    else if (state.activeModals[state.activeView] !== id) dispatch(navigate({type: OPEN_MODAL, payload: {id}}));
};

export const closeModal = () => (dispatch, getState) => {
    const state = getState().router;
    if (state.activeModals[state.activeView]) dispatch(goBack());
};
