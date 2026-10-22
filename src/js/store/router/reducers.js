import {
    SET_PAGE, SET_STORY, GO_BACK, OPEN_POPOUT, CLOSE_POPOUT,
    OPEN_MODAL, CLOSE_MODAL, RESTORE_ROUTER
} from './actionTypes';

const initialState = {
    activeStory: null,
    activeView: null,
    activePanel: null,
    storiesHistory: [],
    viewsHistory: {},
    panelsHistory: {},
    swipeBackHistory: [],
    activeModals: {},
    modalHistory: {},
    popouts: {}
};

export const routerReducer = (state = initialState, action) => {
    const payload = action.payload || {};
    const view = state.activeView;

    switch (action.type) {
        case RESTORE_ROUTER:
            return payload.router;

        case SET_PAGE: {
            if (view === payload.view && state.activePanel === payload.panel) return state;
            const panels = state.panelsHistory[payload.view] || [];
            const panelIndex = panels.indexOf(payload.panel);
            const nextPanels = panelIndex === -1 ? [...panels, payload.panel] : panels.slice(0, panelIndex + 1);
            const views = state.viewsHistory[state.activeStory] || [];

            return {
                ...state,
                activeView: payload.view,
                activePanel: payload.panel,
                swipeBackHistory: nextPanels.slice(-2),
                panelsHistory: {
                    ...state.panelsHistory,
                    [payload.view]: nextPanels
                },
                viewsHistory: {
                    ...state.viewsHistory,
                    [state.activeStory]: [...views.filter(item => item !== payload.view), payload.view]
                }
            };
        }

        case SET_STORY: {
            const reset = payload.story === state.activeStory;
            const views = reset ? [payload.story] : state.viewsHistory[payload.story] || [payload.story];
            const activeView = views[views.length - 1];
            const panels = reset ? [payload.initial_panel] : state.panelsHistory[activeView] || [payload.initial_panel];
            const activePanel = panels[panels.length - 1];
            if (reset && view === activeView && state.activePanel === activePanel) return state;

            return {
                ...state,
                activeStory: payload.story,
                activeView,
                activePanel,
                swipeBackHistory: panels.slice(-2),
                storiesHistory: reset ? state.storiesHistory : [...state.storiesHistory, payload.story],
                viewsHistory: {...state.viewsHistory, [payload.story]: views},
                panelsHistory: {...state.panelsHistory, [activeView]: panels}
            };
        }

        case OPEN_POPOUT:
        case CLOSE_POPOUT:
            return {
                ...state,
                popouts: {...state.popouts, [view]: action.type === OPEN_POPOUT ? payload.popout : null}
            };

        case OPEN_MODAL: {
            const modals = state.modalHistory[view] || [];
            const modalIndex = modals.indexOf(payload.id);
            return {
                ...state,
                activeModals: {...state.activeModals, [view]: payload.id || null},
                modalHistory: {
                    ...state.modalHistory,
                    [view]: !payload.id ? [] : modalIndex === -1 ? [...modals, payload.id] : modals.slice(0, modalIndex + 1)
                }
            };
        }

        case CLOSE_MODAL: {
            const modals = (state.modalHistory[view] || []).slice(0, -1);
            return {
                ...state,
                activeModals: {...state.activeModals, [view]: modals[modals.length - 1] || null},
                modalHistory: {...state.modalHistory, [view]: modals}
            };
        }

        // Logical Back follows overlays and the tab's hierarchy. The action
        // reconciles this target with the browser history separately.
        case GO_BACK: {
            if (state.popouts[view]) return routerReducer(state, {type: CLOSE_POPOUT});
            if (state.activeModals[view]) return routerReducer(state, {type: CLOSE_MODAL});
            const panels = state.panelsHistory[view] || [];
            const views = state.viewsHistory[state.activeStory] || [];
            const stories = state.storiesHistory;
            if (panels.length > 1) {
                const previousPanels = panels.slice(0, -1);
                return {...state, activePanel: previousPanels[previousPanels.length - 1], swipeBackHistory: previousPanels.slice(-2), panelsHistory: {...state.panelsHistory, [view]: previousPanels}};
            }
            if (views.length > 1) {
                const previousViews = views.slice(0, -1);
                const previousView = previousViews[previousViews.length - 1];
                const previousPanels = state.panelsHistory[previousView];
                return {...state, activeView: previousView, activePanel: previousPanels[previousPanels.length - 1], swipeBackHistory: previousPanels.slice(-2), viewsHistory: {...state.viewsHistory, [state.activeStory]: previousViews}};
            }
            if (stories.length > 1) {
                const previousStories = stories.slice(0, -1);
                const story = previousStories[previousStories.length - 1];
                const previousViews = state.viewsHistory[story];
                const previousView = previousViews[previousViews.length - 1];
                const previousPanels = state.panelsHistory[previousView];
                return {...state, activeStory: story, activeView: previousView, activePanel: previousPanels[previousPanels.length - 1], swipeBackHistory: previousPanels.slice(-2), storiesHistory: previousStories};
            }
            return state;
        }

        default:
            return state;
    }
};
