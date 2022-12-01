import { runInAction } from "mobx";
import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { RawButton } from "../../Styled/Button";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
export const SelectableDimensionButton = ({ id, dim }) => {
    var _a;
    return (React.createElement(RawButton, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, true)), activeStyles: true },
        React.createElement(Text, { textLight: true }, parseCustomMarkdownToReactWithOptions((_a = dim.value) !== null && _a !== void 0 ? _a : "", {
            inline: true
        }))));
};
//# sourceMappingURL=Button.js.map