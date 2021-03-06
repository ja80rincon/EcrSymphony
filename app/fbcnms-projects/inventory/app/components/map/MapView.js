/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  CircleLayerSpecification,
  HeatmapLayerSpecification,
  SymbolLayerSpecification,
} from 'mapbox-gl/src/style-spec/types';
import type {ContextRouter} from 'react-router-dom';
import type {GeoJSONGeometry} from '@mapbox/geojson-types/index';
import type {LngLatLike} from 'mapbox-gl/src/geo/lng_lat';
import type {MapType} from '@fbcnms/ui/insights/map/styles';
import type {Theme} from '@material-ui/core';
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import IconButton from '@symphony/design-system/components/IconButton';
import MapButtonGroup from '@fbcnms/ui/components/map/MapButtonGroup';
import MapGeocoder from './geocoder/MapGeocoder';
import PlaceIcon from '@material-ui/icons/Place';
import ReactDOM from 'react-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import classNames from 'classnames';
import defaultTheme from '@fbcnms/ui/theme/default';
import mapboxgl from 'mapbox-gl';
import nullthrows from '@fbcnms/util/nullthrows';
import symphony from '@symphony/design-system/theme/symphony';
import {CloseIcon} from '@symphony/design-system/icons';
import {Router, withRouter} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {getMapStyleForType as _} from '@fbcnms/ui/insights/map/styles';
import {getMapStyleForType} from './MapUtil';
import {isEqual} from 'lodash';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  icon: {
    color: theme.palette.redwood,
    fontSize: 28,
  },
  buttonGroupContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  popup: {
    '& .mapboxgl-popup-content': {
      boxShadow: symphony.shadows.DP2,
      borderRadius: '4px',
      padding: '24px',
    },
  },
  hoverPopup: {
    '& .mapboxgl-popup-content': {
      padding: '12px',
    },
  },
  popupCloseIcon: {
    position: 'absolute',
    right: '24px',
    top: '24px',
  },
});

const CIRCLE_LAYER_STYLE = 'circle';
const HEATMAP_LAYER_STYLE = 'heatmap';
const FILL_LAYER_STYLE = 'fill';
const ICON_LAYER_STYLE = 'icon';

type State = {
  map: ?mapboxgl.Map,
  style: ?'satellite' | 'streets',
  popup: ?mapboxgl.Popup,
  popupType: ?'hover' | 'click',
  container: ?HTMLDivElement,
};

export type CustomGeoJSONFeature<T> = {
  type: 'Feature',
  geometry: ?GeoJSONGeometry,
  properties: ?T,
  id?: number | string,
};

export type GeoJSONSource<T> = {
  key: string,
  data: CustomGeoJSONFeatureCollection<T>,
};

export type CustomGeoJSONFeatureCollection<T> = {
  type: 'FeatureCollection',
  features: Array<CustomGeoJSONFeature<T>>,
};

type Props<T> = WithStyles<typeof styles> & {|
  mode: MapType,
  zoomLevel?: number | string,
  layers: Array<MapLayer<T>>,
  center?: LngLatLike,
  markers?: ?CustomGeoJSONFeatureCollection<T>,
  getFeaturePopoutContent?: (feature: CustomGeoJSONFeature<T>) => React.Node,
  getFeatureHoverPopoutContent?: (
    feature: CustomGeoJSONFeature<T>,
  ) => React.Node,
  showGeocoder?: boolean,
  showMapSatelliteToggle?: boolean,
  mapButton?: React.Node,
  workOrdersView?: boolean,
  classes?: {...},
  ...ContextRouter,
|};

export type MapLayer<T> = {
  source: GeoJSONSource<T>,
  styles?: ?MapLayerStyles,
};

/* When adding a new layer style please do the following:
 * 1. Define a new constant for the name of the style
      (look at CIRCLE_LAYER_STYLE, HEATMAP_LAYER_STYLE, ...).
 * 2. Add the new style to type MapLayerStyles.
 * 3. Update _getLayerStyles function.
 * 4. Update _addLayer function. */
export type MapLayerStyles = {
  circle?: CircleParams,
  heatmap?: HeatmapParams,
  fill?: FillParams,
  icon?: IconParams,
};

type CircleParams = {
  colorInterpolation: ?CircleColorInterpolation,
  fadeInZoomLevel?: number,
};

type HeatmapParams = {
  weight: HeatmapWeight,
  colorStops: ?Array<ColorStop>,
  fadeOutZoomLevel?: number,
};

type FillParams = {
  color: string,
  opacity: number,
};

type LayoutTypes = $ElementType<SymbolLayerSpecification, 'layout'>;
type IconParams = {
  iconImage: $ElementType<$NonMaybeType<LayoutTypes>, 'icon-image'>,
  textField: $ElementType<$NonMaybeType<LayoutTypes>, 'text-field'>,
  iconIgnorePlacement: $ElementType<
    $NonMaybeType<LayoutTypes>,
    'icon-ignore-placement',
  >,
  textTransform: $ElementType<$NonMaybeType<LayoutTypes>, 'text-transform'>,
  textColor: $ElementType<
    $NonMaybeType<$ElementType<SymbolLayerSpecification, 'paint'>>,
    'text-color',
  >,
  textFont: $ElementType<$NonMaybeType<LayoutTypes>, 'text-font'>,
};

// https://docs.mapbox.com/mapbox-gl-js/style-spec/#function-type
type PaintType = 'identity' | 'exponential' | 'interval' | 'categorical';

type CirclePaint = $PropertyType<CircleLayerSpecification, 'paint'>;

export type ColorStop = {
  threshold: number,
  color: string,
};

export type CircleColorInterpolation = {
  property: string,
  type: PaintType,
  stops: Array<ColorStop>,
};

type HeatmapWeight = {
  property: string,
  type: PaintType,
  stops: Array<{threshold: number, weight: number}>,
};

type HeatmapPaint = $ElementType<HeatmapLayerSpecification, 'paint'>;

class MapView<T> extends React.Component<Props<T>, State> {
  static defaultProps = {
    markers: null,
    layers: [],
    center: [0, 0],
    zoomLevel: '2',
  };

  state = {
    map: null,
    style: this.props.mode,
    popup: null,
    popupType: null,
    container: null,
  };

  mapContainer = null;

  componentDidMount() {
    this.initMap();
  }

  componentWillUnmount() {
    this.state.container &&
      ReactDOM.unmountComponentAtNode(this.state.container);
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (!isEqual(prevProps.layers, this.props.layers)) {
      this._fitBounds();

      /* Assume that same layer source key means same underlying data.
       * Please use a different source key if underlying data needs update. */
      const map = nullthrows(this.state.map);
      if (map.loaded && map.isStyleLoaded()) {
        prevProps.layers.forEach(prevLayer => {
          this._removeLayer(
            prevLayer,
            this.props.layers.find(
              layer => layer.source.key === prevLayer.source.key,
            ),
          );
        });
        this.props.layers.forEach(layer => {
          this._addLayer(
            layer,
            prevProps.layers.find(
              prevLayer => prevLayer.source.key === layer.source.key,
            ),
          );
        });
      }
    }
  }

  initMap() {
    const map = new mapboxgl.Map({
      attributionControl: false,
      container: this.mapContainer,
      hash: false,
      style: getMapStyleForType(this.props.mode),
      zoom:
        this.props.zoomLevel === undefined
          ? undefined
          : Number(this.props.zoomLevel),
      center: this.props.center,
    });

    map.on('style.load', () => {
      this._addMarkers();
      this._addLayers();
    });

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: mapboxgl.accessToken
          ? '' // Included by mapbox
          : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }),
    );
    map.addControl(new mapboxgl.NavigationControl({}));
    const {getFeaturePopoutContent, getFeatureHoverPopoutContent} = this.props;
    if (getFeaturePopoutContent || getFeatureHoverPopoutContent) {
      this.props.layers.forEach(layer => {
        if (this._getLayerStyles(layer)[CIRCLE_LAYER_STYLE]) {
          const layerId = `${layer.source.key}_${CIRCLE_LAYER_STYLE}`;
          this._registerClick(map, layerId);
        }
        if (this._getLayerStyles(layer)[ICON_LAYER_STYLE]) {
          const layerId = `${layer.source.key}_${ICON_LAYER_STYLE}`;
          this._registerClick(map, layerId);
        }
      });
    }
    this.setState({map}, this._fitBounds);
  }

  render() {
    const {classes, mapButton, workOrdersView} = this.props;
    const {map} = this.state;

    return (
      <div
        ref={e => {
          this.mapContainer = e;
          map && map.resize();
        }}
        className={classes.mapContainer}>
        {map && mapboxgl.accessToken ? (
          <>
            {this.props.showGeocoder && (
              <MapGeocoder
                accessToken={mapboxgl.accessToken}
                mapRef={map}
                onSelectFeature={this._onGeocoderEvent}
                markers={
                  workOrdersView ? this.props.layers[0].source.data : null
                }
                featuresType={workOrdersView ? 'Work Order' : ''}
                headLine={workOrdersView ? 'Work Orders' : ''}
              />
            )}
            <>
              {this.props.showMapSatelliteToggle && (
                <div className={classes.buttonGroupContainer}>
                  <MapButtonGroup
                    initiallySelectedButton={0}
                    onIconClicked={id => {
                      (id === 'streets' || id === 'satellite') &&
                        this._onIconButtonEvent(id);
                    }}
                    buttons={[
                      {item: 'Map', id: 'streets'},
                      {item: 'Satellite', id: 'satellite'},
                    ]}
                  />
                  {mapButton}
                </div>
              )}
            </>
          </>
        ) : (
          <div />
        )}
      </div>
    );
  }

  _registerClick = (map: mapboxgl.Map, layerId) => {
    map.on('click', layerId, this._handleClick);
    map.on('mouseenter', layerId, this._handleMouseEnter);
    map.on('mouseleave', layerId, this._handleMouseLeave);
  };

  _unregisterClick = (map: mapboxgl.Map, layerId) => {
    map.off('click', layerId, this._handleClick);
    map.off('mouseenter', layerId, this._handleMouseEnter);
    map.off('mouseleave', layerId, this._handleMouseLeave);
  };

  _onGeocoderEvent = feature => {
    // Move to a location returned by the geocoder
    const {map} = this.state;
    if (map) {
      const {bbox, center} = feature;
      if (bbox) {
        map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ]);
      } else {
        map.flyTo({center, zoom: 19});
      }
    }
  };

  _onIconButtonEvent = (id: 'streets' | 'satellite') => {
    const {map} = this.state;
    if (map && this.state.style != id) {
      map.setStyle(getMapStyleForType(id));
      this.setState({style: id === 'streets' ? 'streets' : 'satellite'});
    }
  };

  _addMarkers = () => {
    const {classes, markers} = this.props;
    if (!markers) {
      return;
    }
    const map = nullthrows(this.state.map);
    markers.features.forEach(feature => {
      const geometry = nullthrows(feature.geometry);
      if (geometry.type === 'Point') {
        const el = document.createElement('div');
        const marker = new mapboxgl.Marker({element: el})
          .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
          .addTo(map);
        ReactDOM.render(
          <PlaceIcon className={classes.icon} />,
          marker.getElement(),
        );
      }
    });
  };

  _addLayers = () => {
    this.props.layers.forEach(layer => this._addLayer(layer, null));
  };

  _removeLayer = <T>(prevLayer: MapLayer<T>, currentLayer?: ?MapLayer<T>) => {
    const map = nullthrows(this.state.map);

    const prevLayerStyles =
      prevLayer == null ? {} : this._getLayerStyles(prevLayer);
    const currentLayerStyles =
      currentLayer == null ? {} : this._getLayerStyles(currentLayer);

    Object.keys(prevLayerStyles)
      .filter(
        style =>
          prevLayerStyles[style] &&
          (currentLayerStyles == null || !currentLayerStyles[style]),
      )
      .forEach(style => {
        const layerId = `${prevLayer.source.key}_${style}`;
        if (style === CIRCLE_LAYER_STYLE) {
          this._unregisterClick(map, layerId);
        }
        map.removeLayer(layerId);
      });

    if (currentLayer == null) {
      map.removeSource(prevLayer.source.key);
    }
  };

  _addLayer = <T>(currentLayer: MapLayer<T>, prevLayer?: ?MapLayer<T>) => {
    const map = nullthrows(this.state.map);
    if (prevLayer == null) {
      map.addSource(currentLayer.source.key, {
        type: 'geojson',
        data: currentLayer.source.data,
      });
    }
    const prevLayerStyles =
      prevLayer == null ? {} : this._getLayerStyles(prevLayer);
    const sourceKey = currentLayer.source.key;
    if (
      (currentLayer.styles == null || currentLayer.styles.circle != null) &&
      !prevLayerStyles[CIRCLE_LAYER_STYLE]
    ) {
      this._addCircleLayer(sourceKey, currentLayer.styles?.circle);
    }
    if (currentLayer.styles != null && currentLayer.styles.icon != null) {
      if (!prevLayerStyles[ICON_LAYER_STYLE]) {
        this._addIconLayer(sourceKey, currentLayer.styles.icon);
      } else {
        this._editIconLayer(sourceKey, currentLayer, currentLayer.styles.icon);
      }
    }
    if (
      currentLayer.styles != null &&
      currentLayer.styles.heatmap != null &&
      !prevLayerStyles[HEATMAP_LAYER_STYLE]
    ) {
      this._addHeatmapLayer(sourceKey, currentLayer.styles.heatmap);
    }
    if (
      currentLayer.styles != null &&
      currentLayer.styles.fill != null &&
      !prevLayerStyles[FILL_LAYER_STYLE]
    ) {
      this._addFillLayer(sourceKey, currentLayer.styles.fill);
    }
  };

  _getLayerStyles = <T>(layer: MapLayer<T>): {[string]: boolean} => {
    return {
      [CIRCLE_LAYER_STYLE]: layer.styles == null || layer.styles.circle != null,
      [HEATMAP_LAYER_STYLE]: layer.styles?.heatmap != null,
      [FILL_LAYER_STYLE]: layer.styles?.fill != null,
      [ICON_LAYER_STYLE]: layer.styles?.icon != null,
    };
  };

  _addDefaultLayer = (sourceKey: string) => {
    this._addCircleLayer(sourceKey, null);
  };

  _addCircleLayer = (sourceKey: string, params: ?CircleParams) => {
    const map = nullthrows(this.state.map);
    const layerId = `${sourceKey}_${CIRCLE_LAYER_STYLE}`;
    map.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceKey,
      paint: this._getCirclePaint(params),
    });
    this._registerClick(map, layerId);
  };

  _addIconLayer = (sourceKey: string, params: IconParams) => {
    const map = nullthrows(this.state.map);
    const layerId = `${sourceKey}_${ICON_LAYER_STYLE}`;
    const layer: SymbolLayerSpecification = {
      id: layerId,
      type: 'symbol',
      source: sourceKey,
      layout: {
        'icon-image': params.iconImage,
        'text-field': params.textField,
        'icon-ignore-placement': params.iconIgnorePlacement,
        'text-transform': params.textTransform,
        'text-font': params.textFont,
      },
      paint: {
        'text-color': params.textColor,
      },
    };
    map.addLayer(layer);
    this._registerClick(map, layerId);
  };

  _editIconLayer = <T>(
    sourceKey: string,
    currentLayer: MapLayer<T>,
    params: IconParams,
  ) => {
    const map = nullthrows(this.state.map);
    const layerId = `${sourceKey}_${ICON_LAYER_STYLE}`;
    map.setLayoutProperty(layerId, 'icon-image', params.iconImage);
    map.setLayoutProperty(layerId, 'text-field', params.textField);
    map.getSource(sourceKey).setData(currentLayer.source.data);
  };

  _addHeatmapLayer = (sourceKey: string, params: HeatmapParams) => {
    const map = nullthrows(this.state.map);
    map.addLayer(
      {
        id: `${sourceKey}_${HEATMAP_LAYER_STYLE}`,
        type: 'heatmap',
        source: sourceKey,
        paint: this._getHeatmapPaint(params),
      },
      'waterway-label',
    );
  };

  _addFillLayer = (sourceKey: string, params: FillParams) => {
    const map = nullthrows(this.state.map);
    map.addLayer({
      id: `${sourceKey}_${FILL_LAYER_STYLE}`,
      type: 'fill',
      source: sourceKey,
      layout: {},
      paint: {
        'fill-color': params.color,
        'fill-opacity': params.opacity,
      },
    });
  };

  _getCirclePaint = (params: ?CircleParams): CirclePaint => {
    const colorInterpolation = params?.colorInterpolation;
    let circleColor: $PropertyType<$NonMaybeType<CirclePaint>, 'circle-color'>;
    if (colorInterpolation == null) {
      circleColor = ['get', 'color'];
    } else if (colorInterpolation.type === 'exponential') {
      circleColor = {
        property: colorInterpolation.property,
        type: 'exponential',
        stops: (colorInterpolation.stops.map(stop => [
          stop.threshold,
          stop.color,
        ]): Array<[number, string]>),
      };
    } else if (colorInterpolation.type === 'interval') {
      circleColor = {
        property: colorInterpolation.property,
        type: 'interval',
        stops: (colorInterpolation.stops.map(stop => [
          stop.threshold,
          stop.color,
        ]): Array<[number, string]>),
      };
    } else if (colorInterpolation.type === 'categorical') {
      circleColor = {
        property: colorInterpolation.property,
        type: 'categorical',
        stops: (colorInterpolation.stops.map(stop => [
          stop.threshold,
          stop.color,
        ]): Array<[string | number | boolean, string]>),
      };
    } else if (colorInterpolation.type === 'identity') {
      circleColor = {
        property: colorInterpolation.property,
        type: 'identity',
      };
    }
    const paint = {
      'circle-color': circleColor,
      'circle-radius': {
        type: 'interval',
        /* When zoom is <= 8 radius is 6px
         * When zoom is 18 radius is 12px */
        stops: [
          [8, 6],
          [18, 12],
        ],
      },
      'circle-stroke-width': 1,
      'circle-opacity': undefined,
      'circle-stroke-color': undefined,
      'circle-stroke-color': undefined,
    };
    const fadeInZoomLevel = params?.fadeInZoomLevel;
    if (fadeInZoomLevel != null) {
      paint['circle-opacity'] = {
        type: 'interval',
        stops: [
          [fadeInZoomLevel - 1, 0],
          [fadeInZoomLevel, 1],
        ],
      };
      paint['circle-stroke-color'] = {
        type: 'interval',
        stops: [
          [fadeInZoomLevel - 1, 'transparent'],
          [fadeInZoomLevel, 'white'],
        ],
      };
    } else {
      paint['circle-stroke-color'] = 'white';
      paint['circle-opacity'] = {
        type: 'interval',
        stops: [[1, 1]],
      };
    }
    return paint;
  };

  _getHeatmapPaint = (params: HeatmapParams): HeatmapPaint => {
    let heatmapWeight: $PropertyType<
      $NonMaybeType<HeatmapPaint>,
      'heatmap-weight',
    >;
    if (params.weight.type === 'exponential') {
      heatmapWeight = {
        property: params.weight.property,
        type: 'exponential',
        stops: (params.weight.stops.map(stop => [
          stop.threshold,
          stop.weight,
        ]): Array<[number, number]>),
      };
    } else if (params.weight.type === 'interval') {
      heatmapWeight = {
        property: params.weight.property,
        type: 'interval',
        stops: (params.weight.stops.map(stop => [
          stop.threshold,
          stop.weight,
        ]): Array<[number, number]>),
      };
    } else if (params.weight.type === 'categorical') {
      heatmapWeight = {
        property: params.weight.property,
        type: 'categorical',
        stops: (params.weight.stops.map(stop => [
          stop.threshold,
          stop.weight,
        ]): Array<[string | number | boolean, number]>),
      };
    } else if (params.weight.type === 'identity') {
      heatmapWeight = {
        property: params.weight.property,
        type: 'identity',
      };
    }

    const paint = {
      'heatmap-weight': heatmapWeight,
      'heatmap-radius': {
        /* When zoom is <= 6 radius is 7px
         * When zoom is <= 9 radius is 16px
         * When zoom is 10 radius is 30px
         * When zoom is 12 radius is 40px */
        type: 'interval',
        stops: [
          [6, 7],
          [9, 16],
          [10, 30],
          [12, 40],
        ],
      },
      'heatmap-color': undefined,
      'heatmap-opacity': undefined,
    };
    if (params.colorStops != null) {
      const heatmapColor = [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
      ].concat(
        params.colorStops
          .map(stop => [stop.threshold, stop.color])
          .reduce((stops, currentStop) => stops.concat(currentStop), []),
      );
      paint['heatmap-color'] = heatmapColor;
    }
    if (params.fadeOutZoomLevel != null) {
      paint['heatmap-opacity'] = {
        type: 'interval',
        stops: [
          [params.fadeOutZoomLevel - 1, 1],
          [params.fadeOutZoomLevel, 0],
        ],
      };
    }
    return paint;
  };

  _fixCoordinates(coordinates) {
    const lng =
      Math.abs(coordinates[0]) > 180 ? coordinates[0] % 180 : coordinates[0];
    const lat =
      Math.abs(coordinates[1]) > 90 ? coordinates[1] % 90 : coordinates[1];
    return [lng, lat];
  }

  _fitBounds = () => {
    const {layers} = this.props;
    const {map} = this.state;

    if (!map || layers.length == 0) {
      return;
    }
    const bounds = new mapboxgl.LngLatBounds();

    layers
      .map(layer => layer.source.data.features)
      .flat()
      .map((feature: any) => {
        const geometry = nullthrows(feature.geometry);
        if (geometry.type !== 'Point') {
          return;
        }
        const coords = mapboxgl.LngLat.convert(
          this._fixCoordinates(geometry.coordinates),
        );
        bounds.extend(coords);
      });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: {top: 50, bottom: 50, left: 50, right: 50},
        easing: t => t * (2 - t),
        duration: 0,
        maxZoom: 19, // 19 = ~city block
      });
    }
  };

  _buildPopup = (event, getPopupContent, popOnHover) => {
    if (
      this.state.popup &&
      // $FlowFixMe flow doesn't recognize an existing function
      this.state.popup.isOpen()
    ) {
      return;
    }
    const map = nullthrows(this.state.map);
    const coordinates = event.features[0].geometry.coordinates.slice();

    /* Ensure that if the map is zoomed out such that multiple
     * copies of the feature are visible, the popup appears
     * over the copy being pointed to.
     */
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const container = document.createElement('div');

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -22],
      className: classNames(this.props.classes.popup, {
        [this.props.classes.hoverPopup]: popOnHover,
      }),
    }).setLngLat(coordinates);
    ReactDOM.render(
      <ThemeProvider theme={defaultTheme}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={7000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}>
          <Router history={this.props.history}>
            {!popOnHover ? (
              <IconButton
                icon={CloseIcon}
                skin="secondaryGray"
                className={this.props.classes.popupCloseIcon}
                onClick={() => {
                  this.state.popup?.remove();
                }}
              />
            ) : null}
            {getPopupContent(event.features[0])}
          </Router>
        </SnackbarProvider>
      </ThemeProvider>,
      container,
      () => {
        this.setState({popup, container});
        popup.setDOMContent(container).addTo(map);
      },
    );
  };

  _handleClick = event => {
    const {getFeaturePopoutContent} = this.props;
    if (getFeaturePopoutContent == null) {
      return;
    }
    this.state.popup && this.state.popup.remove();
    this.setState({popupType: 'click'});
    this._buildPopup(event, getFeaturePopoutContent, false);
  };

  _handleMouseEnter = event => {
    const {getFeaturePopoutContent, getFeatureHoverPopoutContent} = this.props;
    const map = nullthrows(this.state.map);
    if (
      getFeaturePopoutContent == null &&
      getFeatureHoverPopoutContent == null
    ) {
      return;
    }
    map.getCanvas().style.cursor = 'pointer';
    if (getFeatureHoverPopoutContent) {
      this.setState({popupType: 'hover'});
      this._buildPopup(event, getFeatureHoverPopoutContent, true);
    }
  };

  _handleMouseLeave = () => {
    const map = nullthrows(this.state.map);
    map.getCanvas().style.cursor = '';
    if (this.state.popupType == 'hover')
      this.state.popup && this.state.popup.remove();
  };
}

export default withRouter(withStyles(styles)(MapView));
