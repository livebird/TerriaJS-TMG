import classNames from "classnames";
import { TFunction } from "i18next";
import { action, reaction, runInAction } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import DataSource from "terriajs-cesium/Source/DataSources/DataSource";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import flatten from "../../Core/flatten";
import isDefined from "../../Core/isDefined";
import { featureBelongsToCatalogItem } from "../../Map/PickedFeatures/PickedFeatures";
import prettifyCoordinates from "../../Map/Vector/prettifyCoordinates";
import MappableMixin from "../../ModelMixins/MappableMixin";
import TimeFilterMixin from "../../ModelMixins/TimeFilterMixin";
import CompositeCatalogItem from "../../Models/Catalog/CatalogItems/CompositeCatalogItem";
import { BaseModel } from "../../Models/Definition/Model";
import TerriaFeature from "../../Models/Feature/Feature";
import {
  addMarker,
  isMarkerVisible,
  LOCATION_MARKER_DATA_SOURCE_NAME,
  removeMarker
} from "../../Models/LocationMarkerUtils";
import Terria from "../../Models/Terria";
import Workbench from "../../Models/Workbench";
import ViewState from "../../ReactViewModels/ViewState";
import Icon from "../../Styled/Icon";
import Loader from "../Loader";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import Styles from "./feature-info-panel.scss";
import FeatureInfoCatalogItem from "./FeatureInfoCatalogItem";

const DragWrapper = require("../DragWrapper");

interface Props {
  viewState: ViewState;
  printView?: boolean;
  t: TFunction;
}

@observer
class FeatureInfoPanel extends React.Component<Props> {
  fixLongitude(lng: number) {
    while (lng > 180.0) {
      lng -= 360.0;
    }
    while (lng < -180.0) {
      lng += 360.0;
    }
    return lng;
  }
  latLng2Name(lat: number, lng: number, rounding: number) {
    let latitude = Math.floor(Math.abs(lat));
    latitude -= latitude % rounding;
    let longitude = Math.floor(lng);
    longitude -= longitude % rounding;

    longitude = this.fixLongitude(longitude);
    const longitudeCardinal = longitude >= 0 && longitude < 180.0 ? "E" : "W";
    const latitudeCardinal = lat >= 0 ? "N" : "S";
    return (
      Math.abs(longitude) + longitudeCardinal + latitude + latitudeCardinal
    );
  }
  MGRSString(Lat: number, Long: number) {
    if (Lat < -80) return "Too far South";
    if (Lat > 84) return "Too far North";
    var c = 1 + Math.floor((Long + 180) / 6);
    var e = c * 6 - 183;
    var k = (Lat * Math.PI) / 180;
    var l = (Long * Math.PI) / 180;
    var m = (e * Math.PI) / 180;
    var n = Math.cos(k);
    var o = 0.006739496819936062 * Math.pow(n, 2);
    var p = 40680631590769 / (6356752.314 * Math.sqrt(1 + o));
    var q = Math.tan(k);
    var r = q * q;
    var s = r * r * r - Math.pow(q, 6);
    var t = l - m;
    var u = 1.0 - r + o;
    var v = 5.0 - r + 9 * o + 4.0 * (o * o);
    var w = 5.0 - 18.0 * r + r * r + 14.0 * o - 58.0 * r * o;
    var x = 61.0 - 58.0 * r + r * r + 270.0 * o - 330.0 * r * o;
    var y = 61.0 - 479.0 * r + 179.0 * (r * r) - r * r * r;
    var z = 1385.0 - 3111.0 * r + 543.0 * (r * r) - r * r * r;
    var aa =
      p * n * t +
      (p / 6.0) * Math.pow(n, 3) * u * Math.pow(t, 3) +
      (p / 120.0) * Math.pow(n, 5) * w * Math.pow(t, 5) +
      (p / 5040.0) * Math.pow(n, 7) * y * Math.pow(t, 7);
    var ab =
      6367449.14570093 *
        (k -
          0.00251882794504 * Math.sin(2 * k) +
          0.00000264354112 * Math.sin(4 * k) -
          0.00000000345262 * Math.sin(6 * k) +
          0.000000000004892 * Math.sin(8 * k)) +
      (q / 2.0) * p * Math.pow(n, 2) * Math.pow(t, 2) +
      (q / 24.0) * p * Math.pow(n, 4) * v * Math.pow(t, 4) +
      (q / 720.0) * p * Math.pow(n, 6) * x * Math.pow(t, 6) +
      (q / 40320.0) * p * Math.pow(n, 8) * z * Math.pow(t, 8);
    aa = aa * 0.9996 + 500000.0;
    ab = ab * 0.9996;
    if (ab < 0.0) ab += 10000000.0;
    var ad = "CDEFGHJKLMNPQRSTUVWXX".charAt(Math.floor(Lat / 8 + 10));
    var ae = Math.floor(aa / 100000);
    var af = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"][(c - 1) % 3].charAt(ae - 1);
    var ag = Math.floor(ab / 100000) % 20;
    var ah = ["ABCDEFGHJKLMNPQRSTUV", "FGHJKLMNPQRSTUVABCDE"][
      (c - 1) % 2
    ].charAt(ag);
    function pad(val: number) {
      var newVal: String = "";
      if (val < 10) {
        newVal = "0000" + val;
      } else if (val < 100) {
        newVal = "000" + val;
      } else if (val < 1000) {
        newVal = "00" + val;
      } else if (val < 10000) {
        newVal = "0" + val;
      }
      return newVal;
    }
    aa = Math.floor(aa % 100000);
    var aa1 = pad(aa);
    ab = Math.floor(ab % 100000);
    var ab1 = pad(ab);
    return c + ad + "" + af + ah + "" + aa1 + "" + ab1;
  }
  latLng2GARS(lat: number, lng: number) {
    const letter_array = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];
    const five_minute_array = [
      ["7", "4", "1"],
      ["8", "5", "2"],
      ["9", "6", "3"]
    ];

    let latitude = lat;

    let longitude = this.fixLongitude(lng);
    /* North pole is an exception, read over and down */
    if (latitude === 90.0) {
      latitude = 89.99999999999;
    }
    // Check for valid lat/lon range
    if (latitude < -90 || latitude > 90) {
      return "0";
    }
    if (longitude < -180 || longitude > 180) {
      return "0";
    }
    // Get the longitude band ==============================================
    let longBand = longitude + 180;
    // Normalize to 0.0 <= longBand < 360
    while (longBand < 0) {
      longBand = longBand + 360;
    }
    while (longBand > 360) {
      longBand = longBand - 360;
    }
    longBand = Math.floor(longBand * 2.0);
    let intLongBand = longBand + 1; // Start at 001, not 000
    let strLongBand = intLongBand.toString();
    // Left pad the string with 0's so X becomes 00X
    while (strLongBand.length < 3) {
      strLongBand = "0" + strLongBand;
    }

    // Get the latitude band ===============================================
    let offset = latitude + 90;
    // Normalize offset to 0 < offset <90
    while (offset < 0) {
      offset = offset + 180;
    }
    while (offset > 180) {
      offset = offset - 180;
    }
    offset = Math.floor(offset * 2.0);
    const firstOffest = Math.floor(offset / letter_array.length);
    const secondOffest = Math.floor(offset % letter_array.length);
    let strLatBand = letter_array[firstOffest] + letter_array[secondOffest];

    // Get the quadrant ====================================================
    let latBand = Math.floor((latitude + 90.0) * 4.0) % 2.0;
    longBand = Math.floor((longitude + 180.0) * 4.0) % 2.0;
    let quadrant = "0";
    // return "0" if error occurs
    if (latBand < 0 || latBand > 1) {
      return "0";
    }
    if (longBand < 0 || longBand > 1) {
      return "0";
    }
    // Otherwise get the quadrant
    if (latBand === 0.0 && longBand === 0.0) {
      quadrant = "3";
    } else if (latBand === 1.0 && longBand === 0.0) {
      quadrant = "1";
    } else if (latBand === 1.0 && longBand === 1.0) {
      quadrant = "2";
    } else if (latBand === 0.0 && longBand === 1.0) {
      quadrant = "4";
    }

    const keypad =
      five_minute_array[
        Math.floor(((((longitude + 180) * 60.0) % 30) % 15) / 5.0)
      ][Math.floor(((((latitude + 90) * 60.0) % 30) % 15) / 5.0)];

    return strLongBand + strLatBand + quadrant + keypad;
  }
  componentDidMount() {
    const { t } = this.props;
    const terria = this.props.viewState.terria;
    disposeOnUnmount(
      this,
      reaction(
        () => terria.pickedFeatures,
        (pickedFeatures) => {
          if (!isDefined(pickedFeatures)) {
            terria.selectedFeature = undefined;
          } else {
            terria.selectedFeature = TerriaFeature.fromEntity(
              new Entity({
                id: t("featureInfo.pickLocation"),
                position: pickedFeatures.pickPosition
              })
            );
            if (isDefined(pickedFeatures.allFeaturesAvailablePromise)) {
              pickedFeatures.allFeaturesAvailablePromise.then(() => {
                if (this.props.viewState.featureInfoPanelIsVisible === false) {
                  // Panel is closed, refrain from setting selectedFeature
                  return;
                }

                // We only show features that are associated with a catalog item, so make sure the one we select to be
                // open initially is one we're actually going to show.
                const featuresShownAtAll = pickedFeatures.features.filter((x) =>
                  isDefined(determineCatalogItem(terria.workbench, x))
                );

                // Return if `terria.selectedFeatures` already showing a valid feature?
                if (
                  featuresShownAtAll.some(
                    (feature) => feature === terria.selectedFeature
                  )
                )
                  return;

                // Otherwise find first feature with data to show
                let selectedFeature = featuresShownAtAll.filter(
                  (feature) =>
                    isDefined(feature.properties) ||
                    isDefined(feature.description)
                )[0];
                if (
                  !isDefined(selectedFeature) &&
                  featuresShownAtAll.length > 0
                ) {
                  // Handles the case when no features have info - still want something to be open.
                  selectedFeature = featuresShownAtAll[0];
                }
                runInAction(() => {
                  terria.selectedFeature = selectedFeature;
                });
              });
            }
          }
        }
      )
    );
  }

  renderFeatureInfoCatalogItems(
    catalogItems: MappableMixin.Instance[],
    featureMap: Map<string, TerriaFeature[]>
  ) {
    return catalogItems.map((catalogItem, i) => {
      // From the pairs, select only those with this catalog item, and pull the features out of the pair objects.
      const features =
        (catalogItem.uniqueId
          ? featureMap.get(catalogItem.uniqueId)
          : undefined) ?? [];
      return (
        <FeatureInfoCatalogItem
          key={catalogItem.uniqueId}
          viewState={this.props.viewState}
          catalogItem={catalogItem}
          features={features}
          onToggleOpen={this.toggleOpenFeature}
          printView={this.props.printView}
        />
      );
    });
  }

  @action.bound
  close() {
    this.props.viewState.featureInfoPanelIsVisible = false;

    // give the close animation time to finish before unselecting, to avoid jumpiness
    setTimeout(
      action(() => {
        this.props.viewState.terria.pickedFeatures = undefined;
        this.props.viewState.terria.selectedFeature = undefined;
      }),
      200
    );
  }

  @action.bound
  toggleCollapsed() {
    this.props.viewState.featureInfoPanelIsCollapsed =
      !this.props.viewState.featureInfoPanelIsCollapsed;
  }

  @action.bound
  toggleOpenFeature(feature: TerriaFeature) {
    const terria = this.props.viewState.terria;
    if (feature === terria.selectedFeature) {
      terria.selectedFeature = undefined;
    } else {
      terria.selectedFeature = feature;
    }
  }

  getMessageForNoResults() {
    const { t } = this.props;
    if (this.props.viewState.terria.workbench.items.length > 0) {
      // feature info shows up becuase data has been added for the first time
      if (this.props.viewState.firstTimeAddingData) {
        runInAction(() => {
          this.props.viewState.firstTimeAddingData = false;
        });
        return t("featureInfo.clickMap");
      }
      // if clicking on somewhere that has no data
      return t("featureInfo.noDataAvailable");
    } else {
      return t("featureInfo.clickToAddData");
    }
  }

  addManualMarker(longitude: number, latitude: number) {
    const { t } = this.props;
    addMarker(this.props.viewState.terria, {
      name: t("featureInfo.userSelection"),
      location: {
        latitude: latitude,
        longitude: longitude
      }
    });
  }

  pinClicked(longitude: number, latitude: number) {
    if (!isMarkerVisible(this.props.viewState.terria)) {
      this.addManualMarker(longitude, latitude);
    } else {
      removeMarker(this.props.viewState.terria);
    }
  }

  // locationUpdated(longitude, latitude) {
  //   if (
  //     isDefined(latitude) &&
  //     isDefined(longitude) &&
  //     isMarkerVisible(this.props.viewState.terria)
  //   ) {
  //     removeMarker(this.props.viewState.terria);
  //     this.addManualMarker(longitude, latitude);
  //   }
  // }

  filterIntervalsByFeature(
    catalogItem: TimeFilterMixin.Instance,
    feature: TerriaFeature
  ) {
    try {
      catalogItem.setTimeFilterFeature(
        feature,
        this.props.viewState.terria.pickedFeatures?.providerCoords
      );
    } catch (e) {
      this.props.viewState.terria.raiseErrorToUser(e);
    }
  }

  renderLocationItem(cartesianPosition: Cartesian3) {
    const cartographic =
      Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);
    if (cartographic === undefined) {
      return <></>;
    }
    const latitude = CesiumMath.toDegrees(cartographic.latitude);
    const longitude = CesiumMath.toDegrees(cartographic.longitude);
    const pretty = prettifyCoordinates(longitude, latitude);
    // this.locationUpdated(longitude, latitude);
    const mgrs = this.MGRSString(latitude, longitude);
    const gard = this.latLng2GARS(latitude, longitude);
    const that = this;
    const pinClicked = function () {
      that.pinClicked(longitude, latitude);
    };

    const locationButtonStyle = isMarkerVisible(this.props.viewState.terria)
      ? Styles.btnLocationSelected
      : Styles.btnLocation;

    return (
      <div className={Styles.location}>
        <span>Lat / Lon&nbsp;</span>
        <span>
          {pretty.latitude + ", " + pretty.longitude}
          {!this.props.printView && (
            <button
              type="button"
              onClick={pinClicked}
              className={locationButtonStyle}
            >
              <Icon glyph={Icon.GLYPHS.location} />
            </button>
          )}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <span>Lat / Lon&nbsp;</span>
            <span>
              {pretty.latitude + ", " + pretty.longitude}
              {!this.props.printView && (
                <button
                  type="button"
                  onClick={pinClicked}
                  className={locationButtonStyle}
                >
                  <Icon glyph={Icon.GLYPHS.location} />
                </button>
              )}
            </span>
          </div>
          <div>
            <span>MGRS&nbsp;</span>
            <span>{mgrs}</span>
          </div>
          <div>
            <span>GARS&nbsp;</span>
            <span>{gard}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const terria = this.props.viewState.terria;
    const viewState = this.props.viewState;

    const { catalogItems, featureMap } = getFeatureMapByCatalogItems(
      this.props.viewState.terria
    );

    const featureInfoCatalogItems = this.renderFeatureInfoCatalogItems(
      catalogItems,
      featureMap
    );
    const panelClassName = classNames(Styles.panel, {
      [Styles.isCollapsed]: viewState.featureInfoPanelIsCollapsed,
      [Styles.isVisible]: viewState.featureInfoPanelIsVisible,
      [Styles.isTranslucent]: viewState.explorerPanelIsVisible
    });

    const filterableCatalogItems = catalogItems
      .filter(
        (catalogItem) =>
          TimeFilterMixin.isMixedInto(catalogItem) &&
          catalogItem.canFilterTimeByFeature
      )
      .map((catalogItem) => {
        const features =
          (catalogItem.uniqueId
            ? featureMap.get(catalogItem.uniqueId)
            : undefined) ?? [];
        return {
          catalogItem: catalogItem as TimeFilterMixin.Instance,
          feature: isDefined(features[0]) ? features[0] : undefined
        };
      })
      .filter((pair) => isDefined(pair.feature));

    // If the clock is available then use it, otherwise don't.
    const clock = terria.timelineClock?.currentTime;

    // If there is a selected feature then use the feature location.
    let position = terria.selectedFeature?.position?.getValue(clock);

    // If position is invalid then don't use it.
    // This seems to be fixing the symptom rather then the cause, but don't know what is the true cause this ATM.
    if (
      position === undefined ||
      isNaN(position.x) ||
      isNaN(position.y) ||
      isNaN(position.z)
    ) {
      position = undefined;
    }

    if (!isDefined(position)) {
      // Otherwise use the location picked.
      position = terria.pickedFeatures?.pickPosition;
    }

    const locationElements = position ? (
      <li>{this.renderLocationItem(position)}</li>
    ) : null;

    return (
      <DragWrapper>
        <div
          className={panelClassName}
          aria-hidden={!viewState.featureInfoPanelIsVisible}
        >
          {!this.props.printView && (
            <div className={Styles.header}>
              <div
                className={classNames("drag-handle", Styles.btnPanelHeading)}
              >
                <span>{t("featureInfo.panelHeading")}</span>
                <button
                  type="button"
                  onClick={this.toggleCollapsed}
                  className={Styles.btnToggleFeature}
                >
                  {this.props.viewState.featureInfoPanelIsCollapsed ? (
                    <Icon glyph={Icon.GLYPHS.closed} />
                  ) : (
                    <Icon glyph={Icon.GLYPHS.opened} />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={this.close}
                className={Styles.btnCloseFeature}
                title={t("featureInfo.btnCloseFeature")}
              >
                <Icon glyph={Icon.GLYPHS.close} />
              </button>
            </div>
          )}
          <ul className={Styles.body}>
            {this.props.printView && locationElements}

            {
              // Is feature info visible
              !viewState.featureInfoPanelIsCollapsed &&
              viewState.featureInfoPanelIsVisible ? (
                // Are picked features loading -> show Loader
                isDefined(terria.pickedFeatures) &&
                terria.pickedFeatures.isLoading ? (
                  <li>
                    <Loader light />
                  </li>
                ) : // Do we have no features/catalog items to show?

                featureInfoCatalogItems.length === 0 ? (
                  <li className={Styles.noResults}>
                    {this.getMessageForNoResults()}
                  </li>
                ) : (
                  // Finally show feature info
                  featureInfoCatalogItems
                )
              ) : null
            }

            {!this.props.printView && locationElements}
            {
              // Add "filter by location" buttons if supported
              filterableCatalogItems.map((pair) =>
                TimeFilterMixin.isMixedInto(pair.catalogItem) &&
                pair.feature ? (
                  <button
                    key={pair.catalogItem.uniqueId}
                    type="button"
                    onClick={this.filterIntervalsByFeature.bind(
                      this,
                      pair.catalogItem,
                      pair.feature
                    )}
                    className={Styles.satelliteSuggestionBtn}
                  >
                    {t("featureInfo.satelliteSuggestionBtn", {
                      catalogItemName: pair.catalogItem.name
                    })}
                  </button>
                ) : null
              )
            }
          </ul>
        </div>
      </DragWrapper>
    );
  }
}

function getFeatureMapByCatalogItems(terria: Terria) {
  const featureMap = new Map<string, TerriaFeature[]>();
  const catalogItems = new Set<MappableMixin.Instance>(); // Will contain a list of all unique catalog items.

  if (!isDefined(terria.pickedFeatures)) {
    return { featureMap, catalogItems: Array.from(catalogItems) };
  }

  terria.pickedFeatures.features.forEach((feature) => {
    const catalogItem = determineCatalogItem(terria.workbench, feature);
    if (catalogItem?.uniqueId) {
      catalogItems.add(catalogItem);
      if (featureMap.has(catalogItem.uniqueId))
        featureMap.get(catalogItem.uniqueId)?.push(feature);
      else featureMap.set(catalogItem.uniqueId, [feature]);
    }
  });

  return { featureMap, catalogItems: Array.from(catalogItems) };
}

export function determineCatalogItem(
  workbench: Workbench,
  feature: TerriaFeature
) {
  if (
    MappableMixin.isMixedInto(feature._catalogItem) &&
    workbench.items.includes(feature._catalogItem)
  ) {
    return feature._catalogItem;
  }

  // Expand child members of composite catalog items.
  // This ensures features from each child model are treated as belonging to
  // that child model, not the parent composite model.
  const items = flatten(workbench.items.map(recurseIntoMembers)).filter(
    MappableMixin.isMixedInto
  );
  return items.find((item) => featureBelongsToCatalogItem(feature, item));
}

function recurseIntoMembers(catalogItem: BaseModel): BaseModel[] {
  if (catalogItem instanceof CompositeCatalogItem) {
    return flatten(catalogItem.memberModels.map(recurseIntoMembers));
  }
  return [catalogItem];
}

export { FeatureInfoPanel };
export default withTranslation()(withViewState(FeatureInfoPanel));
