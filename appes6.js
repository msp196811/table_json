const bookList = document.querySelector('#book-list');
const books = [];
const pagi = document.querySelector('.pagi');
const booksJson =  fetch(`./page/page-1.json`).then((resp) => resp.json()).catch(function(err) {  
    console.log('Error :-S', err);  
  }); 
console.log(booksJson);
async function CRUD() {
    await booksJson.then(data => data.map(item => books.push(item))); //загружаем в массив
    console.log(books);
    function showBooks(start, end, arr) {
        bookList.innerHTML = '';
        for(let i = start; i < end && i < arr.length; i++) {
            const tr = document.createElement('tr');
            tr.classList.add('book-item');
            tr.innerHTML = `<tr><th class="id" style="width:2%; visibility: hidden;">${i}</th><th>${arr[i].title}</th><th>${arr[i].book}</th><th>${arr[i].name}</th><th>${arr[i].theme}</th><th>${arr[i].price}</th><th class="upd" style="width:2%">&#9997</th><th class="delete" style="width:2%">&#128465</th></tr>`;
            bookList.appendChild(tr);
        
     }    
    };
    
    showBooks(0, 10, books);
    

    function addPagination(arr) {
    const pageCount = Math.ceil(arr.length / 10);
     for(let i = 0; i < pageCount; i++) {
        const li = document.createElement('li');
        li.innerHTML = i+1;
        li.setAttribute('data-page', i+1);
        li.setAttribute('id','pagination');
        if(i == 0) {li.classList.add('active')}
        pagi.appendChild(li);
     }    
    }
    addPagination(books);
    function removeElementsByClass(){
     console.log("Pagination");
     $('#pagina li').remove();
}
//обработка пагинации 
document.querySelector('.pagi').addEventListener('click', function(e){
 const page = e.target.getAttribute('data-page');
    document.querySelector('.pagi li.active').classList.remove('active');
    e.target.classList.add('active');         
    let start = (page - 1) * 10,
        end =  page*10;
    showBooks(start, end, books);
     
});
    
    //ОБРАБОТКА МОДАЛЬНОГО
    document.querySelector('.jsOpenModal').addEventListener('click', function(){
        document.querySelector('.modal').classList.add('active'); 
    });
    //ОБРАБОТКА МОДАЛЬНОГО
    const closesBtn = document.querySelectorAll('.close');
    closesBtn.forEach(function(item){
        item.addEventListener('click', function(){
        this.parentElement.classList.remove('active'); 
    });    
    });
    
    
    bookList.addEventListener('click', function(e){
        const target = e.target;
        const id = (target.classList.contains('delete') || target.classList.contains('upd')) &&  target.parentElement.firstElementChild.textContent;
        target.classList.contains('delete') && confirm("Точно удалить?") && books.splice(id, 1);
        if(target.classList.contains('upd')) {
          document.querySelector('.jsUpdateModal').classList.add('active');
          const title = document.querySelector('#up-title').value = books[id].title,
                book = document.querySelector('#up-book').value = books[id].book,
                hiddenId = document.querySelector('#id-hidden').value = id,
                name = document.querySelector('#up-name').value = books[id].name;
                theme = document.querySelector('#up-theme').value = books[id].theme;
                price = document.querySelector('#up-price').value = books[id].price;
        } 
        //delete books[id]; 
        removeElementsByClass();
        showBooks(0, 10, books);
        addPagination(books);
    });
    document.querySelector('#book-form').addEventListener('submit', function(e){
        e.preventDefault();
        let title = document.querySelector('#title').value, 
            book = document.querySelector('#book').value, 
            name = document.querySelector('#name').value;
            theme = document.querySelector('#theme').value;
            price = document.querySelector('#price').value;
        const obj = {'title': title, 'book': book,  'name': name, 'theme': theme, 'price': price};
        books.unshift(obj);
        showBooks(0, 10, books);
        this.reset();

        document.querySelector('.success').classList.remove('hide');
        setTimeout(function() {
            document.querySelector('.success').classList.add('hide')}
                   , 2200);
        
    });

     document.querySelector('#search').addEventListener('keyup', function(){
      const arr =  books.filter(item => { return (item.title.toLowerCase().indexOf(this.value.toLowerCase()) > -1) || (item.book.toLowerCase().indexOf(this.value.toLowerCase()) > -1) || (item.name.toLowerCase().indexOf(this.value.toLowerCase()) > -1) || (item.theme.toLowerCase().indexOf(this.value.toLowerCase()) > -1) || (item.price.toLowerCase().indexOf(this.value.toLowerCase()) > -1)}); 
    if(arr.length > 0) {
    
      showBooks(0, 10, arr);
      removeElementsByClass();
      addPagination(arr);
                } else {
          document.querySelector("#book-list").innerHTML = "Ничего не найдено";
          removeElementsByClass();
        }
    });


    var grid = document.getElementById('table');
    grid.onclick = function(e) {
      if (e.target.tagName != 'TH') return;

      sortGrid(e.target.cellIndex, e.target.getAttribute('data-type'));
    };
  function sortGrid(colNum, type) {
      var tbody = grid.getElementsByTagName('tbody')[0];
      var rowsArray = [].slice.call(tbody.rows);
      var compare;
      switch (type) {
        case 'number':
          compare = function(rowA, rowB) {
            return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
          };
          break;
        case 'string':
          compare = function(rowA, rowB) {
            return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
          };
          break;
      }

      rowsArray.sort(compare);
      grid.removeChild(tbody);
      for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
      }

      grid.appendChild(tbody);

    }
    document.querySelector('#update-form').addEventListener('submit', function(e){
        e.preventDefault();
        if(confirm('Обновить?')) {
        const title = document.querySelector('#up-title').value,
                book = document.querySelector('#up-book').value,
                hiddenId = document.querySelector('#id-hidden').value,
                name = document.querySelector('#up-name').value;
                theme = document.querySelector('#up-theme').value;
                price = document.querySelector('#up-price').value;
        books[hiddenId] = {'title': title, 'book': book, 'name': name, 'theme': theme, 'price': price};
        showBooks(0, 10, books);
        document.querySelector('.jsUpdateModal').classList.remove('active');
        }
        return false;
    })
    
    }
    
CRUD();
