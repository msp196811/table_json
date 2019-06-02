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
    
    """Этот нужно сделать"""
    document.querySelector('#search').addEventListener('keyup', function(){
      const arr =  books.filter(item => { return item.title.indexOf(this.value) > 0}) > 0 ? books.filter(item => { return item.title.indexOf(this.value)>0}) : books;
      console.log(arr);
      removeElementsByClass();
      showBooks(0, 10, arr);
      addPagination(arr);
    });
/*
    document.querySelector('#search').addEventListener('keyup', function(){
      var fileList = books.filter(function(event) {
          return event.indexOf(this.value) > -1
        })
      console.log(fileList);
      //removeElementsByClass();
      //showBooks(0, 10, arr);
      //addPagination(arr);
    });
                                этот рабочий, но массив не возвращает 
(function(){
    'use strict';
  var $ = jQuery;
  $.fn.extend({
    filterTable: function(){
      return this.each(function(){
        $(this).on('keyup', function(e){
          $('.filterTable_no_results').remove();
          var $this = $(this), 
                        search = $this.val().toLowerCase(), 
                        target = $this.attr('data-filters'), 
                        $target = $(target), 
                        $rows = $target.find('tbody tr');
                        
          if(search == '') {
            $rows.show(); 
          } else {
            $rows.each(function(){
              var $this = $(this);
              $this.text().toLowerCase().indexOf(search) === -1 ? $this.hide() : $this.show();
            })
            if($target.find('tbody tr:visible').length === 0) {
              var col_count = $target.find('tr').first().find('td').size();
              var no_results = $('<tr class="filterTable_no_results"><td colspan="'+col_count+'">Не найдено результатов</td></tr>')
              $target.find('tbody').append(no_results);
            }
          }
        });
      });
    }
  });
  $('[data-action="filter"]').filterTable();
})(jQuery);
*/


/*    var grid = document.getElementById('table');
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

    }*/
    function sortTable(f,n){
    var rows = $('#table tbody tr').get();
    console.log(rows);
    rows.sort(function(a, b) {
        var A = getVal(a);
        var B = getVal(b);
        if(A < B) {
            return -1*f;
        }
        if(A > B) {
            return 1*f;
        }
        return 0;
    });

    function getVal(elm){
        var v = $(elm).children('td').eq(n).text().toUpperCase();
        if($.isNumeric(v)){
            v = parseInt(v,10);
        }
        return v;
    }
    $.each(rows, function(index, row) {
        $('#table').children('tbody').append(row);
    });
}
var f_sl = 1; 
var f_nm = 1; 
$("#title").click(function(){
    f_sl *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_sl,n);
});
$("#book").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#name").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#theme").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#price").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
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
