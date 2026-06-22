//обозначаем что элемент не схвачен
let dragElement = null;
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
        //получаем данные где элемент схвачен от ее края
        consX = elem.clientX - film.getBoundingClientRect().left; 
        consY = elem.clientY - film.getBoundingClientRect().top;
    })
})
//перебор элемента
films.forEach(function(filM){
    //ставим движение элемента
    filM.addEventListener('mousemove',function(elem){
        //проверяем схвачен ли элемент
        if(dragElement){
            //получаем новое значение расположение элемента
            dragElement.style.left = (elem.clientX - consX) + 'px';
            dragElement.style.top = (elem.clientY - consY) + 'px';
        }
    })
})