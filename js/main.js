let map;
const map_image_pth = "assets/map_images/"
const desc_image_pth = "assets/desc_images/"

let markerArr = []
// let lastIcon;


const icons = {
  "Bunker": {
    img:"bunker_icon.png",
    sType:"Bunker, Partisan Bunker"
  },
  "Masovy hrob": {
    img:"hroby_icon.png",
    sType:"Masový hrob, Mass Graves"
  },
  "Vypalene obce": {
    img:"vypalene_icon.png",
    sType:"Vypálené obce, Burned-Down Villages"
  },
  "Pamatnik": {
    img:"pamatnik_icon.png",
    sType:"Pamätník, Memorial"
  }
};



//TODO : make this better and nice.. not so messy
function makePopUp(info) {
  let image = info.img.length > 1 ? info.img : "NONE"
  let popup = '<div id="infoBox" >' +
    '<div class="boxContent">' +
    '<div class="header">' +
    '<div class="header50">' + '<p class="popupText heading">' + info.type + '</p></div>' +
    // '<div class="header50">'+'<p class="popupText heading">'+ image+'</p></div>'+
    '</div>' +
    '<figure>' +
    '<img src=' + desc_image_pth + image + ' />' +
    '<figcaption class="popupText">' + info.desc.toString() + '</figcaption>' +
    '</figure>' +
    '</div>'
  return popup
}

function toggleMarker(mark_type) {
  // console.log(mark_type, markerArr)
  let name = mark_type.replace("_toggle", "")
  let show = document.getElementById(mark_type).checked ? map : null;

  for (let i = 0; i < markerArr[name].length; i++) {
    let marker = markerArr[name][i];
    marker.setMap(show)

  }

}


function createTypeToggles() {
  types = Object.keys(icons)
  let toggleDiv = document.getElementById("legend");
  let table = document.createElement('div')
  table.setAttribute('class','container-fluid')
  table.setAttribute('id','legend_table')
  
  let toggleDivUL = document.createElement("div");
  toggleDivUL.setAttribute('class','row')
  for (let i = 0; i < types.length; i++) {
    let col_leg = document.createElement("div");
    col_leg.setAttribute('class','col')

    let li = document.createElement('li');
    li.className = 'markerSelect';

    let typeSelector = document.createElement('input');
    typeSelector.type = 'checkbox';
    typeSelector.setAttribute('id', types[i] + "_toggle");
    typeSelector.setAttribute('checked', true);
    typeSelector.setAttribute('class', types[i]);
    typeSelector.setAttribute('onclick', 'toggleMarker("' + types[i] + '_toggle")');



    // Create the label and the associated name
    let label = document.createElement('label');
    label.setAttribute('for', typeSelector.getAttribute('id'))
    let t = document.createTextNode(icons[types[i]].sType);
    label.appendChild(t)

    li.appendChild(label);
    li.appendChild(typeSelector);

    //TODO: figure out how to get the li close to text responsively.
    li.setAttribute('style', 'background:url("' + map_image_pth + icons[types[i]].img + '") no-repeat 7px 50% transparent;')

    col_leg.appendChild(li)
    toggleDivUL.appendChild(col_leg);

  }
  table.appendChild(toggleDivUL)

  let submitLegend = document.createElement("input");
  submitLegend.setAttribute('id','submitLegend')
  submitLegend.setAttribute('type','button')
  submitLegend.setAttribute('class','w3-button w3-red')
  submitLegend.setAttribute('value','Submit')
  submitLegend.setAttribute('onclick','openLegend()')

  table.appendChild(submitLegend)
  

  toggleDiv.appendChild(table)


  // let styleControl = document.getElementById('legend');
  // map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(styleControl);



}

function openLegend(){
  let legend = document.getElementById('legend')
  let map_div = document.getElementById('map')
  if (map_div.className==='invisible'){
    legend.setAttribute("style","width:null;display:null;visibility:null;")
    map_div.setAttribute('class','map_container')
    

  }
  else{
    legend.setAttribute('style','width:100%;display:flex;visibility:visible;')
    map_div.setAttribute('class','invisible')
  }



}


function setMarker(map, feature,infowindow) {
  let latLng = feature.getGeometry().get();

  let marker = new google.maps.Marker({
    position: latLng,
    icon: map_image_pth + icons[feature.getProperty("type")].img,
    map: map,
    draggable: false
  });

  if (!markerArr[feature.getProperty("type")]) markerArr[feature.getProperty("type")] = [];
  markerArr[feature.getProperty("type")].push(marker);

  bounds.extend(latLng)

  google.maps.event.addListener(marker,"click",() =>{
    let info = {
      desc: feature.getProperty("description"),
      name: feature.getProperty("name"),
      img: feature.getProperty("imgPath"),
      type: icons[feature.getProperty("type")].sType
    }

    infowindow.setContent(makePopUp(info));
    // position the infowindow on the marker
    infowindow.setPosition(latLng);
    // anchor the infowindow on the marker
    infowindow.setOptions({
      pixelOffset: new google.maps.Size(0, -30)
    });

    google.maps.event.addListener(infowindow,"closeclick",() =>{
      lastIcon = latLng
      map.panTo(latLng)
      });
    infowindow.open(map);


  });
  return latLng


}

let bounds;
function initMap() {

    map= new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 48.748128,
      lng: 18.429380
    },
    zoom: 10.5,
    disableDefaultUI: true

  });
  bounds = new google.maps.LatLngBounds();

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('legend_button'));

  let infowindow = new google.maps.InfoWindow();
  map.data.addListener('addfeature', function (o) {
    setMarker(map, o.feature,infowindow);
});


  map.data.loadGeoJson('assets/records.geojson');

  createTypeToggles()

  //TODO : figure out wierd bounding issue in the middle of the ocean.
  //        possible jquery async?

  // google.maps.event.addListenerOnce(map, 'idle', function(){
  //  map.fitBounds(bounds)
  // });
  // lastIcon = map.getCenter();

//   google.maps.event.addListener(map, 'bounds_changed', function() {
//     console.log("change")
//     map.panTo(lastIcon)
// });

  map.data.setStyle({visible: false});





}
