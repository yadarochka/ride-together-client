import "mapbox-gl/dist/mapbox-gl.css";

type RideMapProps = {
  pointA: number[];
  pointB: number[];
};

import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const accessToken =
  "pk.eyJ1IjoieWFkYXJvNGthIiwiYSI6ImNsZjdjZXdscTFkaTMzdG9jbnNhNTBiZ3cifQ.gbKXjjN-ea347B-MUmTuFA";

function RideMap(props: RideMapProps) {
  const { pointA, pointB } = props;

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) {
      var newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [pointA[0], pointA[1]],
        zoom: 9,
        accessToken,
      });

      setMap(newMap);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      var originMarker = new mapboxgl.Marker({ color: "green" })
        .setLngLat(pointA)
        .addTo(map);

      var destinationMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(pointB)
        .addTo(map);

      map.on("load", function () {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 8,
          },
        });
        if (originMarker && destinationMarker) {
          var url =
            "https://api.mapbox.com/directions/v5/mapbox/driving/" +
            originMarker.getLngLat().lng +
            "," +
            originMarker.getLngLat().lat +
            ";" +
            destinationMarker.getLngLat().lng +
            "," +
            destinationMarker.getLngLat().lat +
            "?steps=true&geometries=geojson&access_token=" +
            accessToken;

          fetch(url)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              var route = data.routes[0].geometry.coordinates;
              map.getSource("route").setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              });
            });
        }
      });
    }
  }, [map]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "70vh" }}
    />
  );
}

export default RideMap;
