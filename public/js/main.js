function htmlbodyHeightUpdate() {
  var height3 = $(window).height();
  var height1 = $('.nav').height() + 50;
  height2 = $('.container-main').height();
  if (height2 > height3) {
    $('html').height(Math.max(height1, height3, height2) + 10);
    $('body').height(Math.max(height1, height3, height2) + 10);
  } else {
    $('html').height(Math.max(height1, height3, height2));
    $('body').height(Math.max(height1, height3, height2));
  }

}
$(document).ready(function() {
  htmlbodyHeightUpdate();
  $(window).resize(function() {
    htmlbodyHeightUpdate();
  });
  $(window).scroll(function() {
    height2 = $('.container-main').height();
    htmlbodyHeightUpdate();
  });
});
var map = L.map('mymap').setView([34.1, -117.28], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: "pk.eyJ1Ijoiam9ydGVnYWhvbWVzIiwiYSI6ImNqeWtsbXIwODBmcmczbW9iYTcycmUycXIifQ.YQcwA678CCL-sQwDDMh49g"
}).addTo(map);

var mapLayer;

const fetchButton = document.getElementById("myCheck");
const greenCheckBox = document.getElementById("greenBox");
const yellowCheckBox = document.getElementById('yellowBox');
const orangeCheckBox = document.getElementById('orangeBox');
const redCheckBox = document.getElementById('reBox');
const oneDay = document.getElementById("thirtyDays");
const sevenDays = document.getElementById("ninetyDays");
const thirtyDays = document.getElementById('twelveMonths');
const addHeatLayer = document.getElementById('addHeat');
const removeHeat = document.getElementById('removeHeat');
const affectedArea = document.getElementById('affectedArea');
const removeEffectedArea = document.getElementById('removeEffectedArea');
var greenHeat = [];
var circleMarker;

var yellowMarker = L.icon({
  iconUrl: '/assets/yellow.png',
  iconSize: [12, 12],
  iconAnchor: [0, 0],
  popupAnchor: [6, 0]
});
var redMarker = L.icon({
  iconUrl: '/assets/red.png',
  iconSize: [12, 12],
  iconAnchor: [0, 0],
  popupAnchor: [6, 0]
});
var orangeMarker = L.icon({
  iconUrl: '/assets/orange.png',
  iconSize: [12, 12],
  iconAnchor: [0, 0],
  popupAnchor: [6, 0]
});
var greenMarker = L.icon({
  iconUrl: "/assets/green.png",
  iconSize: [12, 12],
  iconAnchor: [0, 0],
  popupAnchor: [6, 0]
});
var personMarker = L.icon({
  iconUrl: 'https://static.thenounproject.com/png/331569-200.png',
  iconSize: [46, 46],
  iconAnchor: [20,46],
  popupAnchor: [6,0]
})
var search = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-08-13&minlatitude=31&maxlatitude=40&minlongitude=-125&maxlongitude=-110&minmagnitude=4&maxmagnitude=10';

const greenAlert = '&alertlevel=green';
const yellowAlert = '&alertlevel=yellow';
const orangeAlert = 'alertlevel=orange';
const redAlert = 'alertlevel=red';

var mapLayer;
var greenLayer;
var yellowLayer;
var orangeLayer;
var redLayer;
var heatGroup = [];


//  L.marker([34,-117.5], {icon: greenMarker}).addTo(map);
//function fetchGreen() {
//fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&alertlevel=green") //link used to "fetch the data"
//  .then(function(response) { //tcreate a funciton to remove the data,
//  return response.json(); // we tell the computer that this data is called .json
//})

function fetchData() {
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson") //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      for (i = 0; i < data.features.length; i++) {
        //console.log(data.features[i].geometry.coordinates[0])
        greenHeat[i] = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0], data.features[i].properties.mag];
        //greenHeat[i] = L.marker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]);
      }

      function switchIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.marker(latlng, {
              icon: greenMarker
            });
        }
        switch (feature.properties.alert) {
          case 'yellow':
            return L.marker(latlng, {
              icon: yellowMarker
            });
        }
        switch (feature.properties.alert) {
          case 'orange':
            return L.marker(latlng, {
              icon: orangeMarker
            });
        }
        switch (feature.properties.alert) {
          case 'red':
            return L.marker(latlng, {
              icon: redMarker
            });
        }
      } //end of switch bracket
      mapLayer = L.geoJSON(data, {
        pointToLayer: switchIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}


function fetchGreen() {
  fetch(search + greenAlert) //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      // for(i=0;i<data.features.length;i++){
      //   //console.log(data.features[i].geometry.coordinates[0])
      //   greenHeat[i] = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0],data.features[i].properties.mag];
      //   //greenHeat[i] = L.marker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]);
      // }
      function greenIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.marker(latlng, {
              icon: greenMarker
            });
        }
      } //end of switch bracket
      // function greenCircles(feature, latlng) {
      //   switch (feature.properties.alert) {
      //     case 'green':
      //       return L.circle(latlng, {
      //         color: 'red',
      //         fillColor: '#f03',
      //         fillOpacity: 0.5,
      //         radius: 10000
      //       });
      //   }
      // }
      greenLayer = L.geoJSON(data, {
        pointToLayer: greenIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}

function fetchYellow() {
  fetch(search + yellowAlert) //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      function yellowIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'yellow':
            return L.marker(latlng, {
              icon: yellowMarker

            });
        }
      } //end of switch bracket
      yellowLayer = L.geoJSON(data, {
        pointToLayer: yellowIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    })
}


function fetchOrange() {
  fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2013-01-01&alertlevel=orange') //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      function orangeIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'orange':
            return L.marker(latlng, {
              icon: orangeMarker
            });
        }
      } //end of switch bracket
      orangeLayer = L.geoJSON(data, {
        pointToLayer: orangeIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}

function fetchRed() {
  fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2013-01-01&alertlevel=red') //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      function redIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'red':
            return L.marker(latlng, {
              icon: redMarker
            });
        }
      } //end of switch bracket
      redLayer = L.geoJSON(data, {
        pointToLayer: redIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}

function fetchOne() {
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson") //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) {

      function switchIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.marker(latlng, {
              icon: greenMarker
            });
        }
        switch (feature.properties.alert) {
          case 'yellow':
            return L.marker(latlng, {
              icon: yellowMarker
            });
        }
        switch (feature.properties.alert) {
          case 'orange':
            return L.marker(latlng, {
              icon: orangeMarker
            });
        }
        switch (feature.properties.alert) {
          case 'red':
            return L.marker(latlng, {
              icon: redMarker
            });
        }
      } //end of switch bracket
      oneLayer = L.geoJSON(data, {
        pointToLayer: switchIcons,
        onEachFeature: function(features, oneLayer) {
          oneLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}


function fetchSeven() {
  fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-11-01&minmagnitude=4.5&limit=1000") //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) {
      function switchIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.marker(latlng, {
              icon: greenMarker
            });
        }
        switch (feature.properties.alert) {
          case 'yellow':
            return L.marker(latlng, {
              icon: yellowMarker
            });
        }
        switch (feature.properties.alert) {
          case 'orange':
            return L.marker(latlng, {
              icon: orangeMarker
            });
        }
        switch (feature.properties.alert) {
          case 'red':
            return L.marker(latlng, {
              icon: redMarker
            });
        }
      } //end of switch bracket
      sevenLayer = L.geoJSON(data, {
        pointToLayer: switchIcons,
        onEachFeature: function(features, sevenLayer) {
          sevenLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}


function fetchThirty() {
  fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-02-01&minmagnitude=4.5&limit=1500") //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) {
      function switchIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.marker(latlng, {
              icon: greenMarker
            });
        }
        switch (feature.properties.alert) {
          case 'yellow':
            return L.marker(latlng, {
              icon: yellowMarker
            });
        }
        switch (feature.properties.alert) {
          case 'orange':
            return L.marker(latlng, {
              icon: orangeMarker
            });
        }
        switch (feature.properties.alert) {
          case 'red':
            return L.marker(latlng, {
              icon: redMarker
            });
        }
      } //end of switch bracket
      thirtyLayer = L.geoJSON(data, {
        pointToLayer: switchIcons,
        onEachFeature: function(features, thirtyLayer) {
          thirtyLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}


function addHeat() {
  fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&minmagnitude=5') //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      for (i = 0; i < data.features.length; i++) {
        //console.log(data.features[i].geometry.coordinates[0])
        heatGroup[i] = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0], data.features[i].properties.mag];
        //greenHeat[i] = L.marker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]);
      }
    });
}

function fetchCircle() {
  fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&minmagnitude=5') //link used to "fetch the data"
    .then(function(response) { //tcreate a funciton to remove the data,
      return response.json(); // we tell the computer that this data is called .json
    })
    .then(function(data) { //creates new funciton to console log the data
      function redIcons(feature, latlng) {
        switch (feature.properties.alert) {
          case 'green':
            return L.circleMarker(latlng, {
              radius: feature.properties.mag,
              color: 'green'
            });
          case 'yellow':
            return L.circleMarker(latlng, {
              radius: feature.properties.mag,
              color: 'yellow'
            });
          case 'orange':
            return L.circleMarker(latlng, {
              radius: feature.properties.mag * 3,
              color: 'orange'

            });
          case 'red':
            return L.circleMarker(latlng, {
              radius: feature.properties.mag * 3,
              color: 'red'
            });
        }
      } //end of switch bracket
      circleLayer = L.geoJSON(data, {
        pointToLayer: redIcons,
        onEachFeature: function(features, mapLayer) {
          mapLayer.bindPopup('<p><b>Magnitude: </b>' + features.properties.mag + '<br><b>Location: </b>' + features.properties.place + '<br><b> Alert: </b>' + features.properties.alert + '<br></p>');
        }
      });
    });
}
fetchCircle();
fetchData();
fetchGreen();
fetchYellow();
fetchOrange();
fetchRed();
addHeat();
fetchThirty();
fetchSeven();
fetchOne();


fetchButton.addEventListener('click', function() {
  if (fetchButton.checked === true) {
    mapLayer.addTo(map);
    greenLayer.addTo(map);
    yellowLayer.addTo(map);
    orangeLayer.addTo(map);
    redLayer.addTo(map);
  } else {
    map.removeLayer(mapLayer);
    map.removeLayer(greenLayer);
    map.removeLayer(yellowLayer);
    map.removeLayer(orangeLayer);
    map.removeLayer(redLayer);
  }
});

greenBox.addEventListener('click', function() {
  if (greenBox.checked === true) {
    greenLayer.addTo(map);
    map.flyTo([34.1, -117.28], 7);
  } else {
    map.removeLayer(greenLayer);
  }
});
yellowBox.addEventListener('click', function() {
  if (yellowCheckBox.checked === true) {
    yellowLayer.addTo(map);
    map.flyTo([34.1, -117.28], 7);
  } else {
    map.removeLayer(yellowLayer);
  }
});
orangeBox.addEventListener('click', function() {
  if (orangeBox.checked === true) {
    map.flyTo([21.61657, -15.46874], 2);
    orangeLayer.addTo(map);

  } else {
    map.removeLayer(orangeLayer);
  }
});
redBox.addEventListener('click', function() {
  if (redBox.checked === true) {
    map.flyTo([21.61657, -15.46874], 2);
    redLayer.addTo(map);
  } else {
    map.removeLayer(redLayer);
  }
});
oneDay.addEventListener('click', function() {
  if (oneDay.checked === true) {
    oneLayer.addTo(map);
    map.removeLayer(sevenLayer);
    map.removeLayer(thirtyLayer);
  } else if (thirtyDays.checked === true || sevenDays.checked === true) {
    map.removeLayer(oneLayer);
  }

});
sevenDays.addEventListener('click', function() {
  if (sevenDays.checked === true) {
    sevenLayer.addTo(map);
    map.removeLayer(thirtyLayer);
    map.removeLayer(oneLayer);
    console.log(sevenLayer);
  } else if (thirtyDays.checked === true || oneDays.checked === true) {
    map.removeLayer(sevenLayer);
  }

});
thirtyDays.addEventListener('click', function() {
  if (thirtyDays.checked === true) {
    thirtyLayer.addTo(map);
    map.removeLayer(sevenLayer);
    map.removeLayer(oneLayer);
    console.log(sevenLayer);

  } else if (oneDay.checked === true || sevenDays.checked === true) {

    map.removeLayer(thirtyLayer);
  }

});
var heatLayer;
addHeatLayer.addEventListener('click', function() {
  heatLayer = L.heatLayer(heatGroup, {
    //radius : 25, // default value
    //blur : 15, // default value
    //intensity: 12
    minOpacity: .34,
    //gradient : {1: 'red'} // Values can be set for a scale of 0-1
  }).addTo(map);
  console.log(heatGroup);
});
removeHeat.addEventListener('click', function() {
  map.removeLayer(heatLayer);
});
affectedArea.addEventListener('click', function(){
  circleLayer.addTo(map);
});
removeEffectedArea.addEventListener('click', function(){
  map.removeLayer(circleLayer);
})

// function locateUser() {
//   map.locate({
//     setView: false,
//     icon: greenMarker,
//
//   });
// }
// locateUser();
var usermarker;
map.locate({
  setView: true,
  maxZoom: 120,
  watch: false,
  enableHighAccuracy: true
}).on("locationfound", e => {
  console.log('Location found: ' + e.latlng)
  if (!usermarker) {
    usermarker = L.marker(e.latlng,{icon: personMarker}).addTo(this.map);
  } else {
    usermarker.setLatLng(e.latlng);
  }
}).on("locationerror", error => {
  console.log('Location error:');
  console.log(error);
  if (usermarker) {
    map.removeLayer(usermarker);
    usermarker = null;
  }
});
//addHeat();

// var heat = L.heatLayer(heatGroup, {
//     //radius : 25, // default value
//     //blur : 15, // default value
//     //intensity: 12
//     minOpacity: .5,
//     //gradient : {1: 'red'} // Values can be set for a scale of 0-1
// }).addTo(map);

//var heat = L.heatLayer(greenHeat).addTo(map);
L.control.mousePosition().addTo(map);
