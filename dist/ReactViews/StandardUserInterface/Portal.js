import { observer } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
const Portal = observer(({ viewState, id, children }) => {
    const container = viewState.portals.get(id);
    return container ? ReactDOM.createPortal(React.createElement(React.Fragment, null, children), container) : null;
});
export default Portal;
//# sourceMappingURL=Portal.js.map