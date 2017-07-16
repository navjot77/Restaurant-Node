import axios from 'axios';
//User dompurify.sanitze to embed alll inner.html results
function getStore(search){

    if(!search){
        return;
    }

    const searchInput=search.querySelector('input[name="search"]');
    const searchResult=search.querySelector('.search__results');


    searchInput.on('input',function () {
        if (!this.value){
            searchResult.style.display='none';

            return;
        }
        searchResult.style.display='block'
        let current=0;
        let next=0;
        axios.get(`/api/search?q=${this.value}`).then((res)=>{

            if(res.data.length){
                let html='';
                for (let store of res.data){
                    html=html+`<div class='search__result'>
                                <a href='/store/${store.slug}'>
                                      ${store.name}
                                </a>
                                </div>`;

                }
                searchResult.innerHTML=html;

                let total=res.data.length;
                searchInput.on('keyup',(e)=>{
                    if (![38,40,13].includes(e.keyCode)){
                        return;
                    }
                    else if(e.keyCode === 38 ){
                        if(current === 0 ){
                            next=total-1;
                        }
                        else{
                            next=current-1;
                        }
                    }else if(e.keyCode === 40){
                        //Down
                        if(current == total-1){
                            next=0;
                        }
                        else{
                            next=current+1
                        }
                    }
                    current=next;
                    const searchItems=search.querySelectorAll('.search__result');
                    for(let i =0;i<searchItems.length;i++)
                    {
                        if (i == current) {
                            searchItems[i].classList.add('search__result--active');
                        }
                        else{
                            searchItems[i].classList.remove('search__result--active');
                        }
                    }
                    if(e.keyCode === 13){
                        const aElement=searchItems[current].querySelector('a')
                        window.location=aElement.href;
                        return
                    }
                })

            }else {
                console.log(this.value);
                searchResult.innerHTML = `No result found for ${this.value}`;
            }
            
        }).catch((err)=>{
            console.log(err);
        });

    })

}

export default getStore;
