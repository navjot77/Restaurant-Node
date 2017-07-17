import axios from 'axios';

import { $ } from './bling'
const options={

    center:{lat:43.2,lng:-79.8},
    zoom:2
};

function loadMap(map,lat=43.2,lng=-79.8){


    axios.get(`/api/search/near?long=${lng}&lat=${lat}`).then(function (res) {

        const infoWindow=new google.maps.InfoWindow();
        const bounds=new google.maps.LatLngBounds();

        //console.log(res.data);
        if(!res.data.length) {

            bounds.extend({lng,lat});
            map.setCenter(bounds.getCenter());
            map.setZoom(6);
            alert('Nothing found, Widen Your Search....');
            return;
        }


        const markers=res.data.map((item)=> {
            const values= item.position.coordinates;
            const position={
                lng:values[0],
                lat:values[1]
            };
            bounds.extend(position);
            const marker = new google.maps.Marker({map, position});
            marker.place=item;


            return marker;
        });

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);


        markers.forEach(marker=>{
           marker.addListener('click', function () {
               infoWindow.setContent(marker.place.name);
               infoWindow.open(map,this);

           });


        });

    })



}

function makeMap(mapDiv){
    if(!mapDiv)
        return
    const map = new google.maps.Map(mapDiv, options);

    loadMap(map);

    const input= $('[name="geolocate"]');
    const autoComplete= new google.maps.places.Autocomplete(input);
    autoComplete.addListener('place_changed',()=>{
        const place=autoComplete.getPlace();
        loadMap(map,place.geometry.location.lat(),place.geometry.location.lng());

    })





}


export default makeMap;