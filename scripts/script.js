const API_URL = `https://s3.amazonaws.com/api-fun/books.json`
let apiData;
async function fetchPosts() {
    const response = await fetch(`${API_URL}`);
    apiData = await response.json();

    // console.log(data)

    if (response) {
        hideloader();
    }

    show(apiData.data)

}

function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

function show(data) {
    const row = document.getElementById('posts');
    const list = document.createDocumentFragment();
    row.innerHTML = '';
    data.books.map((post, index) => {
        row.appendChild(listColumn(post, data, index));
    });
    showAuthorInfor(data);
}

function showAuthorInfor(data) {
    const authorInfo = document.getElementById('authorInfo');
    const authorHeader = document.createElement('h3');
    authorHeader.innerText = `${data.author}`;
    const authorPlace = document.createElement('h5');
    authorPlace.innerText = `${data.birthPlace}, ${data.birthday}`;
    authorInfo.appendChild(authorHeader);
    authorInfo.appendChild(authorPlace);
}

function sortList(type) {
    const row = document.getElementById('posts');
    let sortBy, books;
    if (type === 'title') {
        sortBy = document.getElementById('sortByTitle').value;
        if (sortBy === 'asc') {
            books = apiData.data.books.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
        }
        else {
            books = apiData.data.books.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0));
        }
    }
    else {
        sortBy = document.getElementById('sortByDate').value;
        if (sortBy === 'asc') {
            books = apiData.data.books.sort((a, b) => { return a.PublishDate - b.PublishDate });
        }
        else {
            books = apiData.data.books.sort((a, b) => { return b.PublishDate - a.PublishDate });
        }
    }

    row.innerHTML = '';
    books.map((post, index) => {
        row.appendChild(listColumn(post, apiData.data, index));
    });
}

function listColumn(books, data, index) {
    let fragment = document.createDocumentFragment();
    const col = document.createElement('div');
    col.className = 'col-md-6';

    const card = document.createElement('div')
    card.className = 'card mb-6';
    card.setAttribute('id', index);
    const row = document.createElement('div');
    row.className = 'row';

    const dividImg = document.createElement('div');
    dividImg.className = 'col-md-6 dividImg';
    const dividContent = document.createElement('div');
    dividContent.className = 'col-md-6';

    const img = document.createElement('img');
    img.setAttribute('src', books.imageUrl);
    img.setAttribute('alt', books.title);
    dividImg.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const contents = document.createElement('div')
    contents.className = 'align-items-center contentBody';

    const anchorDiv = document.createElement('div');
    anchorDiv.className = 'anchorClass';
    anchorDiv.setAttribute('id', `editableTitle${index}`);
    //Anchor tag
    const anchor = document.createElement('a');
    anchor.setAttribute('href', books.purchaseLink);
    anchor.className = 'card-text';
    anchor.innerText = `${books.title}`;
    anchorDiv.appendChild(anchor);

    const paperBack = document.createElement('span');
    paperBack.className = 'titleHint';
    paperBack.innerText = 'Paperback – Illustrated';

    const author = document.createElement('div');
    author.className = 'author';
    author.innerHTML = `By <span>${data.author}</span>, <span>${data.birthPlace}</span>, ${data.birthday}`;

    const publishedDate = document.createElement('small');
    publishedDate.className = 'text-muted';
    publishedDate.innerText = `PUBLISHED On ${books.PublishDate}`;

    // Button Group
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'btn-group btn-group-sm';
    buttonDiv.setAttribute('role', 'group');
    buttonDiv.setAttribute('aria-label', 'Basic example');
    const editBtn = document.createElement('button');
    //Edit Button
    editBtn.className = 'btn btn-primary';
    editBtn.setAttribute('type', 'button');
    editBtn.setAttribute('index', index);
    editBtn.setAttribute('onclick', `editBookTitle(${index})`);
    editBtn.innerText = 'Edit';
    buttonDiv.appendChild(editBtn);
    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-primary';
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('index', index);
    deleteBtn.setAttribute('onclick', `deleteInut(${index})`);
    deleteBtn.innerText = 'Delete';
    buttonDiv.appendChild(deleteBtn);

    //Appending All Elements 
    row.appendChild(dividImg);
    contents.appendChild(anchorDiv);
    contents.appendChild(paperBack);
    contents.appendChild(author);
    contents.appendChild(publishedDate);
    contents.appendChild(buttonDiv);
    dividContent.appendChild(cardBody).appendChild(contents);
    row.appendChild(dividContent);
    card.appendChild(row);
    col.appendChild(card);
    fragment.appendChild(col);
    return fragment;
}

function editBookTitle(index) {
    const card = document.getElementById('editableTitle' + index);
    const save = document.createElement('button');
    save.className = 'btn btn-secondary btn-sm save';
    save.setAttribute('onclick', `saveInput(${index})`);
    save.innerText = 'save';

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', apiData.data.books[index].title);
    input.setAttribute('id', `editedValue${index}`);

    card.innerHTML = '';
    card.appendChild(save);
    card.appendChild(input);
}

function saveInput(rowindex) {
    apiData.data.books[rowindex].title = document.getElementById('editedValue' + rowindex).value;
    const row = document.getElementById('posts');
    row.innerHTML = '';
    apiData.data.books.map((post, index) => {
        row.appendChild(listColumn(post, apiData.data, index));
    });
}

function deleteInut(index) {
    const books = apiData.data.books.filter(row => row !== apiData.data.books[index]);
    apiData.data.books = books;
    const row = document.getElementById('posts');
    row.innerHTML = '';
    apiData.data.books.map((post, index) => {
        row.appendChild(listColumn(post, apiData.data, index));
    });
}
fetchPosts();