var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
  Initially this was written to support various location search providers in master,
  however we only have a single location provider at the moment, and how we merge
  them in the new design is yet to be resolved, see:
  https://github.com/TerriaJS/nsw-digital-twin/issues/248#issuecomment-599919318
 */
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import styled from "styled-components";
import isDefined from "../../Core/isDefined";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import Box, { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Ul from "../../Styled/List";
import Text, { TextSpan } from "../../Styled/Text";
import Loader from "../Loader";
import SearchHeader from "./SearchHeader";
import SearchResult from "./SearchResult";
const RawButtonAndHighlight = styled(RawButton) `
  ${(p) => `
  &:hover, &:focus {
    background-color: ${p.theme.greyLighter};
    ${StyledIcon} {
      fill-opacity: 1;
    }
  }`}
`;
let LocationSearchResults = class LocationSearchResults extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "isExpanded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        makeObservable(this);
    }
    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }
    get validResults() {
        const { search, terria } = this.props;
        const locationSearchBoundingBox = terria.searchBarModel.boundingBoxLimit;
        let filterResults = false;
        let west, east, south, north;
        if (locationSearchBoundingBox) {
            ({ west, east, south, north } = locationSearchBoundingBox);
            filterResults =
                isDefined(west) &&
                    isDefined(east) &&
                    isDefined(south) &&
                    isDefined(north);
        }
        const validResults = filterResults
            ? search.results.filter(function (r) {
                return (r.location.longitude > west &&
                    r.location.longitude < east &&
                    r.location.latitude > south &&
                    r.location.latitude < north);
            })
            : search.results;
        return validResults;
    }
    render() {
        var _a;
        const { search } = this.props;
        const searchProvider = search.searchProvider;
        const maxResults = searchProvider.recommendedListLength || 5;
        const validResults = this.validResults;
        const results = validResults.length > maxResults
            ? this.isExpanded
                ? validResults
                : validResults.slice(0, maxResults)
            : validResults;
        const isOpen = searchProvider.isOpen;
        return (_jsxs(Box, { column: true, children: [_jsx(RawButtonAndHighlight, { type: "button", fullWidth: true, onClick: () => searchProvider.toggleOpen(), children: _jsxs(BoxSpan, { paddedRatio: 2, paddedVertically: 3, centered: true, justifySpaceBetween: true, children: [_jsx(NameWithLoader, { name: search.searchProvider.name, length: (_a = this.validResults) === null || _a === void 0 ? void 0 : _a.length, isOpen: isOpen, search: search, isWaitingForSearchToStart: this.props.isWaitingForSearchToStart }), _jsx(StyledIcon, { styledWidth: "9px", glyph: isOpen ? Icon.GLYPHS.opened : Icon.GLYPHS.closed })] }) }), _jsx(Text, { textDarker: true, children: isOpen && (_jsxs(_Fragment, { children: [_jsx(SearchHeader, { searchResults: search, isWaitingForSearchToStart: this.props.isWaitingForSearchToStart }), _jsx(Ul, { column: true, fullWidth: true, children: results.map((result, i) => (_jsx(SearchResult, { clickAction: this.props.onLocationClick.bind(null, result), name: result.name, icon: "location2", locationSearchText: this.props.locationSearchText, isLastResult: results.length === i + 1 }, i))) }), validResults.length > maxResults && (_jsx(BoxSpan, { paddedRatio: 2, paddedVertically: 3, left: true, justifySpaceBetween: true, children: _jsx(RawButton, { onClick: () => this.toggleExpand(), children: _jsx(TextSpan, { small: true, isLink: true, children: _jsx(SearchResultsFooter, { isExpanded: this.isExpanded, name: searchProvider.name }) }) }) }))] })) })] }));
    }
};
__decorate([
    observable
], LocationSearchResults.prototype, "isExpanded", void 0);
__decorate([
    action.bound
], LocationSearchResults.prototype, "toggleExpand", null);
__decorate([
    computed
], LocationSearchResults.prototype, "validResults", null);
LocationSearchResults = __decorate([
    observer
], LocationSearchResults);
const SearchResultsFooter = (props) => {
    const { t, i18n } = useTranslation();
    if (props.isExpanded) {
        return t("search.viewLess", {
            name: applyTranslationIfExists(props.name, i18n)
        });
    }
    return t("search.viewMore", {
        name: applyTranslationIfExists(props.name, i18n)
    });
};
const NameWithLoader = observer((props) => {
    const { i18n } = useTranslation();
    return (_jsxs(BoxSpan, { styledHeight: "25px", children: [_jsx(BoxSpan, { verticalCenter: true, children: _jsx(TextSpan, { textDarker: true, uppercase: true, children: `${applyTranslationIfExists(props.name, i18n)} (${props.length || 0})` }) }), !props.isOpen &&
                (props.search.isSearching || props.isWaitingForSearchToStart) && (_jsx(Loader, { hideMessage: true, boxProps: { fullWidth: false } }))] }));
});
export default withTranslation()(LocationSearchResults);
//# sourceMappingURL=LocationSearchResults.js.map