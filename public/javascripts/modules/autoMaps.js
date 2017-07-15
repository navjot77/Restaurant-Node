function autocomplete(inputA, long, lat){
    if (!inputA){
        return;
    }
    const drop = new google.maps.places.Autocomplete(inputA);
    drop.addListener('place_changed',()=>{
        const place=drop.getPlace();
        long.value= place.geometry.location.lng();

        lat.value= place.geometry.location.lat();
    });

    inputA.on('keydown',(e)=>{

        if(e.keyCode === 13){
            console.log("1")
            e.preventDefault();
        }
    })


}

export default autocomplete;
