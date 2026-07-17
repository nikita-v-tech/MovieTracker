//Обернем все в функцию
function loadeMovie (){
//создаем отправку на сервер
fetch('http://localhost:3000/movies')
    .then(korobka => korobka.json())
    .then(filmy => {
        console.log(filmy);
        const cssClass = document.querySelectorAll('.movielist');
        cssClass.forEach(badge =>{
            badge.innerHTML = '';
        })
        filmy.forEach(film => {
            const div = document.createElement('div');
            div.classList.add('film1');
            div.dataset.id = film.id;
            const img = document.createElement('img');
            img.src = film.image;
            img.alt = film.title;
            div.appendChild(img);
            //находим колонку по статусу 
            const kolonka = document.getElementById(film.status);
            //поиск полки в колонке
            const polkaFilm = kolonka.querySelector('.movielist');
            //закидываем созданный див в эту колонку
            polkaFilm.appendChild(div);
        })
        DragAndDrop();
    })
}
loadeMovie();
//обернем это все в большую функцию
function DragAndDrop (){
//обозначаем начальные данные
let dragElement = null;
let returNfamily = null
//расположение начально 
let consX = 0;
let consY = 0;
//поиск нужного элемента
const films = document.querySelectorAll('.film1');
//с помощью перебора проходим по всем карточкам
films.forEach(function(film) {
    //ставим захват на каждую карточку
    film.addEventListener('mousedown', function(elem){
        //теперь элемент схвачен
        dragElement = film;
        //запоминаем исходного родителя данного элемента
        returNfamily = dragElement.parentNode;
        //записываем координаты пока карточка свободно стоит
        let coordinateLeft = film.getBoundingClientRect().left;
        let coordinateTop = film.getBoundingClientRect().top;
        //теперь делаем ее свободной
        dragElement.style.position = 'absolute';
        //вычислим координаты где схвачен элемент чтобы элемент не прыгал
        dragElement.style.left = coordinateLeft + 'px';
        dragElement.style.top = coordinateTop + 'px';
        //отменяем стандратное поведение браузера для события
        elem.preventDefault();
        //получаем данные где элемент схвачен от ее края
        consX = elem.clientX - coordinateLeft; 
        consY = elem.clientY - coordinateTop;
     })
    })
    //ставим движение элемента на всей странице
    document.addEventListener('mousemove',function(elem){
        //проверяем схвачен ли элемент
        if(dragElement){
            //получаем новое значение расположение элемента
            dragElement.style.left = (elem.clientX - consX) + 'px';
            dragElement.style.top = (elem.clientY - consY) + 'px';
        }
    })
    //ставим отпускание на всей странице
    document.addEventListener('mouseup', function(elem){
        //отменяем стандартное поведение браузера
        elem.preventDefault();
        //запрещаем браузеру менять дальше
        elem.stopPropagation();
        //если элемент схвачен
        if(dragElement){
        //временно прячем элемент на время поиска
        dragElement.style.pointerEvents = 'none';
        console.log('спрятали');
        //узнаем какой элемент под мышкой
        let elementPodd = document.elementFromPoint(elem.clientX, elem.clientY);
        console.log('под мышкой:', elementPodd);
        
        //возвращаем элементу видимость
        dragElement.style.pointerEvents = '';
        //ищем родителя данного элемента(класс)
        let roD = elementPodd.closest('.column');
        console.log('колонка:' , roD);
        
        //если родитель есть
        if(roD){
            //ставим элемент в данный контейнер
            roD.appendChild(dragElement);
            dragElement.style.left = '';
            dragElement.style.top = '';
            dragElement.style.position = '';
            const idFilma = dragElement.dataset.id;
            const neWstatus = roD.id;   
            fetch(`http://localhost:3000/movies/${idFilma}`, {
                method: 'PATCH', // Сказали серверу: "Делаем заплатку"
                headers: {
                    'Content-Type': 'application/json'// Предупредили, что отправляем JSON
                },
                body: JSON.stringify({
                    status: neWstatus // Отправляем конверт с новым статусом
                })
                })
                .then(res =>{
                    console.log('Сервер успешно обновил базу данных!')
                })
        }else{
            returNfamily.appendChild(dragElement);
            dragElement.style.left = '';
            dragElement.style.top = '';
            dragElement.style.position = '';
        }
        //отпускаем элемент
        dragElement = null;
        console.log(elementPodd)
      }
    });
}

//создаем переменные для найденных элементов
const titleForm = document.querySelector('#forms');
const titleFilm = document.querySelector('#nameFilm');
const titleHttps = document.querySelector('#imgFilm');
//вешаем событие
titleForm.addEventListener('submit', function(e){
    //отменяем стандартное поведение браузера
     e.preventDefault();
     //создаем объект
     const newMovie ={
        "title": titleFilm.value,
        "image": titleHttps.value,
        "status": "todo"
     };
     fetch('http://localhost:3000/movies',{
            method: 'POST', //принесли новое на сервер
            headers: { 'Content-Type': 'application/json'},//внутри чистый текст
            body: JSON.stringify(newMovie)
        })
        //распечатали конверт
        .then(ress => ress.json())
        .then(newfilmy => {
            //прорисовка страницы
            loadeMovie()
            //очистка ввода
            titleForm.reset()
        })
})