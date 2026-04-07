const styleTables = () => {
    document.querySelectorAll('.post-body table:not(.skip-auto-class)').forEach(t => {
        t.classList.add('table', 'table-sm', 'table-striped', 'table-hover');
    });
}

const setupTocSpy = () => {
    const toc = document.querySelector('.post-toc-sidebar');
    if (!toc) return;
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    if (!links.length) return;
    const headings = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const setActive = id => links.forEach(a =>
        a.classList.toggle('toc-active', a.getAttribute('href') === '#' + id)
    );
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-8% 0px -82% 0px' });
    headings.forEach(h => observer.observe(h));
}

styleTables();
setupTocSpy();
