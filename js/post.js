const styleTables = () => {
    document.querySelectorAll('.post-body table:not(.skip-auto-class)').forEach(t => {
        t.classList.add('table', 'table-sm', 'table-striped', 'table-hover');
    });
}

styleTables();
