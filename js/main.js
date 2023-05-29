

// btn

document.querySelector('.burger').addEventListener('click',function() {
    this.classList.toggle('active');
    document.querySelector('.nav-ul-media').classList.toggle('open');
})

//arrow "scroll_top"

let arrowTop = document.querySelector('.scroll_top');
if(arrowTop){
    arrowTop.onclick = () => window.scrollTo({top:0,left:0,behavior:"smooth"});
}

// slider
const slides = document.querySelectorAll('.slide');
const navs = document.querySelectorAll('.slidenav');
let currentSlide = 0;
let interval;

if(slides.length > 0){
    for(let nav of navs){
        nav.onclick = () => {
            currentSlide = +nav.dataset.slide;
            changeSlide(currentSlide);
        }
    }   
    init();
}

function init(){
    interval = setInterval(()=>{
        currentSlide = currentSlide < slides.length - 1 ? ++currentSlide : 0;
        changeSlide(currentSlide);
    }, 3000);
}

function changeSlide(n){
    for(let i = 0; i < slides.length; i++){
        slides[i].classList.remove('active');
        navs[i].classList.remove('active');
    }
    slides[n].classList.add('active');
    navs[n].classList.add('active');
    clearInterval(interval);
    init();
}

// Catalog 

// Load items
const url = 'js/catalog.json';
let items;
let itemsOnPage = [];
const catalog = document.querySelector('.cat-list');

if(catalog){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4){
            items = JSON.parse(xhr.responseText);
            items.forEach(item=>createItem(item));
        }
    }
    
    
    function createItem(data){
        let item = document.createElement('div');
        item.classList.add('cat-item');
        item.dataset.type = data['product_type'].toLowerCase();
    
        const heart = new Image();
        heart.src = 'images/icon-heart.png';
        heart.alt = 'To wishlist';
        heart.classList.add('cat-heart');
        
        const preview = new Image();
        preview.src = data.img;
        preview.alt = data.name;
        preview.classList.add('cat-img');
    
        const name = document.createElement('p');
        name.innerText = data.name;
        name.classList.add('cat-text');
    
        const price = document.createElement('p');
        price.classList.add('cat-price');
        price.innerText = `${data.price} грн`;
    
    
        const actions = document.createElement('div');
        actions.classList.add('cat-icons');
        actions.innerHTML = `<a href="product_${data.id}" class="cat-detailes">Детальніше</a>
        <button data-item="${data.id}" class="buy">В кошик</button>`;
    
        item.append(heart, preview, name, price, actions);
    
        catalog.append(item);
        itemsOnPage.push(item);
    }
    
    
    // Filters aside
    
    const filterGroups = document.querySelectorAll('.filter_title');
    for(let f of filterGroups){
        f.onclick = () => {
            f.classList.toggle('active');
        }
    }
    
    const filters = document.querySelectorAll('.aside-container input[type=checkbox]');
    
    let filteredItems = [];
    const activeFilterGroups = [];
    
    for (let f of filters){
        f.onchange = (e) => {
            if(f.checked){
                activeFilterGroups.push(f.value);
            }
            else{
                activeFilterGroups.splice(activeFilterGroups.indexOf(f.value), 1);
            }
            filterCheckedTypes();
        }
    }
    
    function filterCheckedTypes(){
        filteredItems = itemsOnPage.slice();
        if(activeFilterGroups.length > 0){
            filteredItems = filteredItems.filter((item) => activeFilterGroups.includes(item.dataset.type));
        }
    
        itemsOnPage.forEach(item => {
            if(!filteredItems.includes(item)){
                item.style.display = 'none';
            }
            else{
                item.style.display = 'block';
            }
        }); 
    }
        
    
    // Sort
    
    const sorter = document.querySelector('.sort');
    const activeSort = document.querySelector('.value.selected');
    const options = document.querySelectorAll('.opt');
    
    activeSort.onclick = () => sorter.classList.toggle('opened');
    for (let opt of options){
        opt.onclick = () => {
            activeSort.textContent = opt.textContent;
            sorter.classList.remove('opened');
            switch(opt.dataset.sort){
                case 'name': sortByName();
                            break;
                case 'price_high': sortByPriceHigh();
                            break;
                case 'price_low': sortByPriceLow();
                            break;
                case 'rating': sortDefault();
                            break;
            }
        }
    
    }
    
    // toDO sort catalog
    
    function sortByPriceLow(){
        let itemsCopy = document.querySelectorAll('.cat-price');
        itemsCopy = [].slice.call(itemsCopy);
        itemsCopy.sort((a,b)=>{
            if(+a.innerText.substr(0, a.innerText.length - 4) > +b.innerText.substr(0, b.innerText.length - 4)){
                return 1;
            }
            else if(+a.innerText.substr(0, a.innerText.length - 4) < +b.innerText.substr(0, b.innerText.length - 4)){
                return -1;
            }
            else{
                return 0;
            }
        });
    
        for(let i = 0; i < itemsCopy.length; i++){
            itemsCopy[i].parentNode.style.order = i;
        }
    }
    
    function sortByPriceHigh(){
        let itemsCopy = document.querySelectorAll('.cat-price');
        itemsCopy = [].slice.call(itemsCopy);
        itemsCopy.sort((b,a)=>{
            if(+a.innerText.substr(0, a.innerText.length - 4) > +b.innerText.substr(0, b.innerText.length - 4)){
                return 1;
            }
            else if(+a.innerText.substr(0, a.innerText.length - 4) < +b.innerText.substr(0, b.innerText.length - 4)){
                return -1;
            }
            else{
                return 0;
            }
        });
    
        for(let i = 0; i < itemsCopy.length; i++){
            itemsCopy[i].parentNode.style.order = i;
        }
    }
    
    function sortByName(){
        let itemsCopy = document.querySelectorAll('.cat-text');
        itemsCopy = [].slice.call(itemsCopy);
        itemsCopy.sort((a,b)=>{
            if(a.innerText > b.innerText){
                return 1;
            }
            else if(a.innerText < b.innerText){
                return -1;
            }
            else{
                return 0;
            }
        });
    
        for(let i = 0; i < itemsCopy.length; i++){
            itemsCopy[i].parentNode.style.order = i;
        }
    }
    
    function sortDefault(){
        let items = document.querySelectorAll('.cat-item');
        items = [].slice.call(items);
        items.forEach(item => item.style.order = 0);    
    }
}


// Add to card

const storage = window.localStorage;
const key = 'Aesthetics_shop';
let cart = [];
const cartPopup = document.querySelector('.cart_popup'); 
const cartCount = document.querySelector('.cart_count'); 
let cartTotal = 0; 
let itemsInCart = 0;


if(storage.getItem(key) != null){
   cart = JSON.parse(storage.getItem(key));
   cart.forEach(c => { 
       cartTotal += c.price * c.count;
       itemsInCart += c.count;
   })
}

if(cartCount){
    updateCartCount();
}
 

function saveToLS(){
    storage.setItem(key, JSON.stringify(cart));
}

document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('buy')) {
        addToCard(+e.target.dataset.item);
    }
});

function addToCard(id){
    let wasInCart = false;  
    let added;
    items.forEach(item => {
        if(item.id === id){
            added = item;
        }
    });  
    cart.forEach(item =>{
        if(item.id === id){
            wasInCart = true;
            item.count += 1;
        }
    });
    if(!wasInCart){
        const addedItem = {
            ...added,
            count: 1
        }
        cart.push(addedItem);
    }
    cartTotal += added.price;
    itemsInCart += 1;
    updateCartCount();

    cartPopup.innerText = `Товар "${added.name}" був доданий у корзину`;
    cartPopup.style.display = 'block';
    setTimeout(() =>{
        cartPopup.style.display = 'none';
    }, 1500);
    
    saveToLS(); 
}

function updateCartCount(){
    cartCount.innerText = itemsInCart;
}


// order page
const showInCart = document.querySelector('.ordering-row'); 
const orderTotal = document.querySelector('.order_total');
if(orderTotal !=null){
    orderTotal.innerText = cartTotal;
    showItemsInCart();
} 

function showItemsInCart(){
    if(cart.length === 0){
        showInCart.innerText = 'у корзині немає товарів'; 
    }
    else{
        cart.forEach(c=>{
            let wrap = document.createElement('div');
            wrap.classList.add('row');

            let preview = new Image();
            preview.src = c.img; 
            preview.alt = c.name;

            let title = document.createElement('p'); 
            title.classList.add('row-text');
            title.innerText = c.name;

            let counter = document.createElement('input');
            counter.type = 'number';
            counter.classList.add('input-row');
            counter.value = c.count;
            counter.onchange = ()=> changeCount(c.id, +counter.value, wrap);

            let price = document.createElement('p');
            price.classList.add('row-price');
            price.innerText = `${c.price} грн`;

            let delIcon = new Image();
            delIcon.classList.add('row-icon-delete');
            delIcon.src= 'images/icon-delete.png';
            delIcon.alt="delete from cart"; 
            delIcon.dataset.id = c.id;
            delIcon.onclick = () => changeCount(c.id, 0, wrap);

            wrap.append(preview, title, counter, price, delIcon);
            showInCart.append();
        });
    }

}


function changeCount(id, newvalue, el){

    let cartItem;
    let deltaCount = 0; 
    cart.forEach((item, index) =>{
        if(item.id === id){
            cartItem = item;
            deltaCount = newvalue - item.count;
            if(newvalue === 0){
                cart.splice(index, 1);
                el.remove();
            }
            else{
                item.count = newvalue;
            }
           
            cartTotal += deltaCount * cartItem.price;
            itemsInCart += deltaCount;
        }   
    });

    updateCartCount();
    orderTotal.innerText = cartTotal;
    saveToLS();

}

// card produсt reviews - button more

window.onload = function () {
    var review=document.getElementsByClassName('review');
    var btn=document.getElementById('show-more');
    for (let i=2; i<review.length; i++) {
        review[i].style.display = "none";
    }

    var countD = 2;
    btn.addEventListener("click", function() {
        var review=document.getElementsByClassName('review');
        countD += 2;
        if (countD <= review.length){
            for(let i=0; i<countD; i++){
                review[i].style.display = "flex";
            }
        }
    })
}


// window.onload = function () {
//     var row=document.getElementsByClassName('row');
//     var btn=document.getElementById('show-more');
//     for (let i=2; i<row.length; i++) {
//         row[i].style.display = "none";
//     }

//     var countD = 2;
//     btn.addEventListener("click", function() {
//         var row=document.getElementsByClassName('row');
//         countD += 2;
//         if (countD <= row.length){
//             for(let i=0; i<countD; i++){
//                 row[i].style.display = "flex";
//             }
//         }
//     })
// }


