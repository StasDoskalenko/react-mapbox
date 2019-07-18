import React from 'react'
import mapboxgl from 'mapbox-gl'
import zonesData from './zones.json'
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: 40.57,
      lat: 46.73,
      zoom: 14
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    let selectedZoneId =  null;

    map.on('load', function() {
      map.addSource('zonesSource', { type: 'geojson', data: zonesData});
      map.addLayer({
        id: 'zonesLayer',
        type: 'fill',
        source: 'zonesSource',
        layout: {},
        paint: {
          'fill-color': {
            property: 'ZoneID',
            stops: [
              [1, '#FF00FF'],
              [2, '#FF0000'],
              [3, '#910000'],
              [4, '#FFFF00'],
              [5, '#808000'],
              [6, '#00FF40'],
              [7, '#005315'],
              [8, '#80FFFF'],
              [9, '#0070FF'],
              [10, '#000000']
            ]
          },
          "fill-opacity": ["case",
            ["boolean", ["feature-state", "isSelected"], false],
            0.8,
            0.2
          ]
        }
      });

      map.addLayer({
        "id": "zoneBorders",
        "type": "line",
        "source": "zonesSource",
        "layout": {},
        "paint": {
          "line-color": "#627BC1",
          "line-width": 2,
          "line-opacity": ["case",
            ["boolean", ["feature-state", "isSelected"], false],
            1,
            0.5
          ]
        }
      });


    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on("click", "zonesLayer", function(e) {
      if (e.features.length > 0) {
        if (selectedZoneId) {
          map.setFeatureState({source: 'zonesSource', id: selectedZoneId}, { isSelected: false});
        }
        selectedZoneId = e.features[0].id;
        map.setFeatureState({source: 'zonesSource', id: selectedZoneId}, { isSelected: true});
      }
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div ref={el => this.mapContainer = el} style={{position: 'absolute', width: '100%', height: '100%'}} />
        <div style={{position: 'absolute', right: 10, bottom: 30}} >{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
      </div>
    );
  }
}