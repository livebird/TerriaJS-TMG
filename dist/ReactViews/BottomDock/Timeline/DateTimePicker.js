var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action, observable, reaction, runInAction, makeObservable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import isDefined from "../../../Core/isDefined";
import Button, { RawButton } from "../../../Styled/Button";
import { scrollBars } from "../../../Styled/mixins";
import Spacing from "../../../Styled/Spacing";
import Icon from "../../../Styled/Icon";
import { formatDateTime } from "./DateFormats";
const dateFormat = require("dateformat");
const DatePicker = require("react-datepicker").default;
function daysInMonth(month, year) {
    const n = new Date(year, month, 0).getDate();
    return Array.apply(null, { length: n }).map(Number.call, Number);
}
const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const GridItem = styled.span `
  background: ${(p) => p.theme.overlay};
  ${(p) => p.active &&
    `
    & {
      background: ${p.theme.colorPrimary};
    }
    opacity: 0.9;
   `}
`;
const GridRowInner = styled.span `
  display: table-row;
  padding: 3px;
  border-radius: 3px;

  span {
    display: inline-block;
    height: 10px;
    width: 2px;
    margin-top: 1px;
    margin-right: ${(p) => p.marginRight}px;
  }
`;
const Grid = styled.div `
  display: block;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  color: ${(p) => p.theme.textLight};
  padding: 0px 5px;
  border-radius: 3px;
  margin-top: -20px;
`;
const GridHeading = styled.div `
  text-align: center;
  color: ${(p) => p.theme.textLight};
  font-size: 12px;
  margin-bottom: 10px;
`;
export const GridRow = styled.div `
  :hover {
    background: ${(p) => p.theme.overlay};
    cursor: pointer;
  }
`;
const GridLabel = styled.span `
  float: left;
  display: inline-block;
  width: 35px;
  font-size: 10px;
  padding-left: 3px;
`;
const GridBody = styled.div `
  height: calc(100% - 30px);
  overflow: auto;
  ${scrollBars()}
`;
const BackButton = styled(RawButton) `
  display: inline-block;
  z-index: 99;
  position: relative;

  svg {
    height: 15px;
    width: 20px;
    fill: ${(p) => p.theme.textLight};
    display: inline-block;
    vertical-align: bottom;
  }

  &[disabled],
  &:disabled {
    opacity: 0.1;
  }
`;
export const DateButton = styled(Button).attrs({
    primary: true,
    textProps: { medium: true }
}) `
  width: calc(100% - 20px);
  margin: 3px 5px;
  border-radius: 4px;
`;
let DateTimePicker = class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "currentDateIndice", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { granularity: "century" }
        });
        Object.defineProperty(this, "currentDateAutorunDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
    }
    UNSAFE_componentWillMount() {
        const datesObject = this.props.dates;
        let defaultCentury;
        let defaultYear;
        let defaultMonth;
        let defaultDay;
        let defaultGranularity = "century";
        if (datesObject.index.length === 1) {
            // only one century
            const soleCentury = datesObject.index[0];
            const dataFromThisCentury = datesObject[soleCentury];
            defaultCentury = soleCentury;
            if (dataFromThisCentury.index.length === 1) {
                // only one year, check if this year has only one month
                const soleYear = dataFromThisCentury.index[0];
                const dataFromThisYear = dataFromThisCentury[soleYear];
                defaultYear = soleYear;
                defaultGranularity = "year";
                if (dataFromThisYear.index.length === 1) {
                    // only one month data from this one year, need to check day then
                    const soleMonth = dataFromThisYear.index[0];
                    const dataFromThisMonth = dataFromThisYear[soleMonth];
                    defaultMonth = soleMonth;
                    defaultGranularity = "month";
                    if (dataFromThisMonth.index.length === 1) {
                        // only one day has data
                        defaultDay = dataFromThisMonth.index[0];
                    }
                }
            }
        }
        this.currentDateIndice = {
            century: defaultCentury,
            year: defaultYear,
            month: defaultMonth,
            day: defaultDay,
            granularity: defaultGranularity
        };
        window.addEventListener("click", this.closePickerEventHandler);
        // Update currentDateIndice when currentDate changes
        this.currentDateAutorunDisposer = reaction(() => this.props.currentDate, () => {
            // The current date must be one of the available item.dates, or null/undefined.
            const currentDate = this.props.currentDate;
            if (isDefined(currentDate)) {
                Object.assign(this.currentDateIndice, {
                    day: isDefined(this.currentDateIndice.day)
                        ? currentDate.getDate()
                        : undefined,
                    month: isDefined(this.currentDateIndice.month)
                        ? currentDate.getMonth()
                        : undefined,
                    year: isDefined(this.currentDateIndice.year)
                        ? currentDate.getFullYear()
                        : undefined,
                    century: isDefined(this.currentDateIndice.century)
                        ? Math.floor(currentDate.getFullYear() / 100)
                        : undefined,
                    time: currentDate
                });
            }
        }, { fireImmediately: true });
    }
    componentWillUnmount() {
        this.currentDateAutorunDisposer && this.currentDateAutorunDisposer();
        window.removeEventListener("click", this.closePickerEventHandler);
    }
    closePickerEventHandler() {
        this.closePicker();
    }
    closePicker(newTime) {
        if (newTime !== undefined) {
            runInAction(() => (this.currentDateIndice.time = newTime));
        }
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderCenturyGrid(datesObject) {
        const centuries = datesObject.index;
        if (datesObject.dates && datesObject.dates.length >= 12) {
            return (_jsxs(Grid, { children: [_jsx(GridHeading, { children: "Select a century" }), centuries.map((c) => (_jsxs(DateButton, { css: `
                display: inline-block;
                width: 40%;
              `, onClick: () => runInAction(() => (this.currentDateIndice.century = c)), children: [c, "00"] }, c)))] }));
        }
        else {
            return this.renderList(datesObject.dates);
        }
    }
    renderYearGrid(datesObject) {
        if (datesObject.dates && datesObject.dates.length > 12) {
            const years = datesObject.index;
            const monthOfYear = Array.apply(null, { length: 12 }).map(Number.call, Number);
            return (_jsxs(Grid, { children: [_jsx(GridHeading, { children: "Select a year" }), _jsx(GridBody, { children: years.map((y) => (_jsxs(GridRow, { onClick: () => runInAction(() => {
                                this.currentDateIndice.year = y;
                                this.currentDateIndice.month = undefined;
                                this.currentDateIndice.day = undefined;
                                this.currentDateIndice.time = undefined;
                            }), children: [_jsx(GridLabel, { children: y }), _jsx(GridRowInner, { marginRight: "11", children: monthOfYear.map((m) => (_jsx(GridItem
                                    // className={datesObject[y][m] ? Styles.activeGrid : ""}
                                    , { 
                                        // className={datesObject[y][m] ? Styles.activeGrid : ""}
                                        active: isDefined(datesObject[y][m]) }, m))) })] }, y))) })] }));
        }
        else {
            return this.renderList(datesObject.dates);
        }
    }
    renderMonthGrid(datesObject) {
        const year = this.currentDateIndice.year;
        if (!isDefined(year)) {
            return null;
        }
        if (datesObject[year].dates && datesObject[year].dates.length > 12) {
            return (_jsxs(Grid, { children: [_jsx(GridHeading, { children: _jsx(BackButton, { title: this.props.t("dateTime.back"), onClick: () => {
                                runInAction(() => {
                                    this.currentDateIndice.year = undefined;
                                    this.currentDateIndice.month = undefined;
                                    this.currentDateIndice.day = undefined;
                                    this.currentDateIndice.time = undefined;
                                });
                            }, children: year }) }), _jsx(GridBody, { children: monthNames.map((m, i) => (_jsxs(GridRow, { css: `
                  ${!isDefined(datesObject[year][i])
                                ? `:hover {
                  background: transparent;
                  cursor: default;
                }`
                                : ""}
                `, onClick: () => isDefined(datesObject[year][i]) &&
                                runInAction(() => {
                                    this.currentDateIndice.month = i;
                                    this.currentDateIndice.day = undefined;
                                    this.currentDateIndice.time = undefined;
                                }), children: [_jsx(GridLabel, { children: m }), _jsx(GridRowInner, { marginRight: "3", children: daysInMonth(i + 1, year).map((d) => (_jsx(GridItem, { active: isDefined(datesObject[year][i]) &&
                                            isDefined(datesObject[year][i][d + 1]) }, d))) })] }, m))) })] }));
        }
        else {
            return this.renderList(datesObject[year].dates);
        }
    }
    renderDayView(datesObject) {
        if (!isDefined(this.currentDateIndice.year) ||
            !isDefined(this.currentDateIndice.month)) {
            return null;
        }
        const dayObject = datesObject[this.currentDateIndice.year][this.currentDateIndice.month];
        if (dayObject.dates.length > 31) {
            // Create one date object per day, using an arbitrary time. This does it via Object.keys and moment().
            const days = datesObject[this.currentDateIndice.year][this.currentDateIndice.month]
                .index;
            const daysToDisplay = days.map((d) => moment()
                .date(d)
                .month(this.currentDateIndice.month)
                .year(this.currentDateIndice.year));
            const selected = isDefined(this.currentDateIndice.day)
                ? moment()
                    .date(this.currentDateIndice.day)
                    .month(this.currentDateIndice.month)
                    .year(this.currentDateIndice.year)
                : null;
            // Aside: You might think this implementation is clearer - use the first date available on each day.
            // However it fails because react-datepicker actually requires a moment() object for selected, not a Date object.
            // const monthObject = this.props.datesObject[this.currentDateIndice.year][this.currentDateIndice.month];
            // const daysToDisplay = Object.keys(monthObject).map(dayNumber => monthObject[dayNumber][0]);
            // const selected = isDefined(this.currentDateIndice.day) ? this.props.datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day][0] : null;
            return (_jsxs("div", { css: `
            text-align: center;
            margin-top: -10px;
          `, children: [_jsxs("div", { children: [_jsx(BackButton, { title: this.props.t("dateTime.back"), onClick: () => runInAction(() => {
                                    this.currentDateIndice.year = undefined;
                                    this.currentDateIndice.month = undefined;
                                    this.currentDateIndice.day = undefined;
                                    this.currentDateIndice.time = undefined;
                                }), children: this.currentDateIndice.year }), "\u00A0", _jsx(BackButton, { title: this.props.t("dateTime.back"), onClick: () => runInAction(() => {
                                    this.currentDateIndice.month = undefined;
                                    this.currentDateIndice.day = undefined;
                                    this.currentDateIndice.time = undefined;
                                }), children: monthNames[this.currentDateIndice.month] }), _jsx(Spacing, { bottom: 1 })] }), _jsx(DatePicker, { inline: true, onChange: (momentDateObj) => runInAction(() => {
                            this.currentDateIndice.day = momentDateObj.date();
                        }), includeDates: daysToDisplay, selected: selected })] }));
        }
        else {
            return this.renderList(datesObject[this.currentDateIndice.year][this.currentDateIndice.month]
                .dates);
        }
    }
    renderList(items) {
        if (isDefined(items)) {
            return (_jsxs(Grid, { children: [_jsx(GridHeading, { children: "Select a time" }), _jsx(GridBody, { children: items.map((item) => (_jsx(DateButton, { onClick: () => {
                                this.closePicker(item);
                                this.props.onChange(item);
                            }, children: isDefined(this.props.dateFormat)
                                ? dateFormat(item, this.props.dateFormat)
                                : formatDateTime(item) }, formatDateTime(item)))) })] }));
        }
    }
    renderHourView(datesObject) {
        if (!isDefined(this.currentDateIndice.year) ||
            !isDefined(this.currentDateIndice.month) ||
            !isDefined(this.currentDateIndice.day)) {
            return null;
        }
        const timeOptions = datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day].dates.map((m) => ({
            value: m,
            label: formatDateTime(m)
        }));
        if (timeOptions.length > 24) {
            return (_jsxs(Grid, { children: [_jsxs(GridHeading, { children: [`Select an hour on ${this.currentDateIndice.day} ${monthNames[this.currentDateIndice.month + 1]} ${this.currentDateIndice.year}`, " "] }), _jsx(GridBody, { children: datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day].index.map((item) => (_jsxs(DateButton, { onClick: () => runInAction(() => {
                                this.currentDateIndice.hour = item;
                            }), children: [_jsxs("span", { children: [item, " : 00 - ", item + 1, " : 00"] }), " ", _jsxs("span", { children: ["(", datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day][item].length, " ", "options)"] })] }, item))) })] }));
        }
        else {
            return this.renderList(datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day].dates);
        }
    }
    renderMinutesView(datesObject) {
        if (!isDefined(this.currentDateIndice.year) ||
            !isDefined(this.currentDateIndice.month) ||
            !isDefined(this.currentDateIndice.day) ||
            !isDefined(this.currentDateIndice.hour)) {
            return null;
        }
        const options = datesObject[this.currentDateIndice.year][this.currentDateIndice.month][this.currentDateIndice.day][this.currentDateIndice.hour];
        return this.renderList(options);
    }
    goBack() {
        if (isDefined(this.currentDateIndice.time)) {
            if (!isDefined(this.currentDateIndice.month)) {
                this.currentDateIndice.year = undefined;
                this.currentDateIndice.day = undefined;
            }
            if (!isDefined(this.currentDateIndice.hour)) {
                this.currentDateIndice.day = undefined;
            }
            if (!isDefined(this.currentDateIndice.day)) {
                this.currentDateIndice.month = undefined;
            }
            this.currentDateIndice.hour = undefined;
            this.currentDateIndice.time = undefined;
        }
        else if (isDefined(this.currentDateIndice.hour)) {
            this.currentDateIndice.hour = undefined;
        }
        else if (isDefined(this.currentDateIndice.day)) {
            this.currentDateIndice.day = undefined;
        }
        else if (isDefined(this.currentDateIndice.month)) {
            this.currentDateIndice.month = undefined;
        }
        else if (isDefined(this.currentDateIndice.year)) {
            this.currentDateIndice.year = undefined;
        }
        else if (isDefined(this.currentDateIndice.century)) {
            this.currentDateIndice.century = undefined;
        }
    }
    toggleDatePicker() {
        if (!this.props.isOpen) {
            this.props.onOpen();
        }
        else {
            this.props.onClose();
        }
    }
    render() {
        if (this.props.dates) {
            const datesObject = this.props.dates;
            return (_jsx("div", { css: `
            color: ${(p) => p.theme.textLight};
            display: table-cell;
            width: 30px;
            height: 30px;
          `, onClick: (event) => {
                    event.stopPropagation();
                }, children: this.props.isOpen && (_jsxs("div", { css: `
                background: ${(p) => p.theme.dark};
                width: 260px;
                height: 300px;
                border: 1px solid ${(p) => p.theme.grey};
                border-radius: 5px;
                padding: 5px;
                position: relative;
                top: -170px;
                left: 0;
                z-index: 100;

                ${this.props.openDirection === "down"
                        ? `
                  top: 40px;
                  left: -190px;
                `
                        : ""}
              `, className: "scrollbars", children: [_jsx(BackButton, { title: this.props.t("dateTime.back"), css: `
                  padding-bottom: 5px;
                  padding-right: 5px;
                `, disabled: !isDefined(this.currentDateIndice[this.currentDateIndice.granularity]), type: "button", onClick: () => this.goBack(), children: _jsx(Icon, { glyph: Icon.GLYPHS.left }) }), !isDefined(this.currentDateIndice.century) &&
                            this.renderCenturyGrid(datesObject), isDefined(this.currentDateIndice.century) &&
                            !isDefined(this.currentDateIndice.year) &&
                            this.renderYearGrid(datesObject[this.currentDateIndice.century]), isDefined(this.currentDateIndice.year) &&
                            !isDefined(this.currentDateIndice.month) &&
                            this.renderMonthGrid(datesObject[this.currentDateIndice.century]), isDefined(this.currentDateIndice.year) &&
                            isDefined(this.currentDateIndice.month) &&
                            !isDefined(this.currentDateIndice.day) &&
                            this.renderDayView(datesObject[this.currentDateIndice.century]), isDefined(this.currentDateIndice.year) &&
                            isDefined(this.currentDateIndice.month) &&
                            isDefined(this.currentDateIndice.day) &&
                            !isDefined(this.currentDateIndice.hour) &&
                            this.renderHourView(datesObject[this.currentDateIndice.century]), isDefined(this.currentDateIndice.year) &&
                            isDefined(this.currentDateIndice.month) &&
                            isDefined(this.currentDateIndice.day) &&
                            isDefined(this.currentDateIndice.hour) &&
                            this.renderMinutesView(datesObject[this.currentDateIndice.century])] })) }));
        }
        else {
            return null;
        }
    }
};
Object.defineProperty(DateTimePicker, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        openDirection: "down"
    }
});
__decorate([
    observable
], DateTimePicker.prototype, "currentDateIndice", void 0);
__decorate([
    action.bound
], DateTimePicker.prototype, "closePickerEventHandler", null);
__decorate([
    action
], DateTimePicker.prototype, "goBack", null);
DateTimePicker = __decorate([
    observer
], DateTimePicker);
export default withTranslation()(DateTimePicker);
//# sourceMappingURL=DateTimePicker.js.map