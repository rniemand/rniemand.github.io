const styleTables = () => {
    let tables = document.querySelectorAll('div.main-content table');
    tables.forEach(t => {
        t.classList.add('table');
        t.classList.add('table-sm');
        t.classList.add('table-striped');
        t.classList.add('table-hover');
    });
}

styleTables();