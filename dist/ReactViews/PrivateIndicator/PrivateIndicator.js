import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Icon from "../../Styled/Icon";
import IconWrapper from "../../Styled/IconWrapper";
PrivateIndicator.propTypes = {
    inWorkbench: PropTypes.bool
};
export default function PrivateIndicator(props) {
    const { t } = useTranslation();
    return (_jsx(IconWrapper, { marginRight: !props.inWorkbench, title: t("catalogItem.privateIndicatorTitle"), inWorkbench: props.inWorkbench, css: `
        margin-top: -1px;
        svg {
          width: 15px;
          height: 15px;
          fill: ${(p) => p.inWorkbench ? p.theme.textLight : p.theme.charcoalGrey};
        }
      `, children: _jsx(Icon, { glyph: Icon.GLYPHS.lock }) }));
}
//# sourceMappingURL=PrivateIndicator.js.map