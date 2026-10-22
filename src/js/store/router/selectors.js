export const getActivePanel = (router, view) => {
    const panels = router.panelsHistory[view];
    return panels === undefined ? router.activePanel : panels[panels.length - 1];
};
