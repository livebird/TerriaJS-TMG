import { action } from "mobx";
import React, { useEffect } from "react";
const PortalContainer = ({ viewState, id }) => {
    useEffect(action(() => {
        viewState.portals.set(id, document.getElementById(id));
    }));
    return React.createElement("div", { id: id });
};
export default PortalContainer;
//# sourceMappingURL=PortalContainer.js.map