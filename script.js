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
        //отменяем стандратное поведение браузера для события
        elem.preventDefault();
        //получаем данные где элемент схвачен от ее края
        consX = elem.clientX - film.getBoundingClientRect().left; 
        consY = elem.clientY - film.getBoundingClientRect().top;
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
        //если элемент схвачен
        if(dragElement){
        //временно прячем элемент на время поиска
        dragElement.style.pointerEvents = 'none';
        //узнаем какой элемент под мышкой
        let elementPodd = document.elementFromPoint(elem.clientX, elem.clientY);
        //возвращаем элементу видимость
        dragElement.style.pointerEvents = '';
        //ищем родителя данного элемента(класс)
        let roD = elementPodd.closest('.column');
        //если родитель есть
        if(roD){
            //ставим элемент в данный контейнер
            roD.appendChild(dragElement);
        }else{
            returNfamily.appendChild(dragElement);
        }
        //отпускаем элемент
        dragElement = null;
        console.log(elementPodd)
      }
    });