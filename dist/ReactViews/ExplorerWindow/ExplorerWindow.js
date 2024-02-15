import { jsx as _jsx } from "react/jsx-runtime";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useViewState } from "../Context";
import ModalPopup from "./ModalPopup";
import Tabs from "./Tabs";
export const ExplorerWindowElementName = "AddData";
export default observer(function ExplorerWindow() {
    const viewState = useViewState();
    const onClose = action(() => {
        viewState.closeCatalog();
        viewState.switchMobileView("nowViewing");
    });
    const onStartAnimatingIn = action(() => {
        viewState.explorerPanelAnimating = true;
    });
    const onDoneAnimatingIn = action(() => {
        viewState.explorerPanelAnimating = false;
    });
    const isVisible = !viewState.useSmallScreenInterface &&
        !viewState.hideMapUi &&
        viewState.explorerPanelIsVisible;
    return (_jsx(ModalPopup, { viewState: viewState, isVisible: isVisible, isTopElement: viewState.topElement === ExplorerWindowElementName, onClose: onClose, onStartAnimatingIn: onStartAnimatingIn, onDoneAnimatingIn: onDoneAnimatingIn, children: _jsx(Tabs, { terria: viewState.terria, viewState: viewState }) }));
});
//# sourceMappingURL=ExplorerWindow.js.map