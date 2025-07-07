const styleTables = () => {
    let tables = document.querySelectorAll('div.main-content table');
    tables.forEach(t => {
        t.classList.add('table');
        t.classList.add('table-sm');
        t.classList.add('table-striped');
        t.classList.add('table-hover');
    });
}

const styleBlockquotes = () => {
    let tables = document.querySelectorAll('div.main-content blockquote');
    tables.forEach(t => {
        t.classList.add('blockquote');
        t.classList.add('alert');
        t.classList.add('alert-secondary');
    });
}

styleTables();
styleBlockquotes();