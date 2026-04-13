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

const setupCopyButtons = () => {
    document.querySelectorAll('.post-body pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.setAttribute('aria-label', 'Copy code');
        btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy';
        wrapper.appendChild(btn);

        btn.addEventListener('click', () => {
            const code = pre.querySelector('code') || pre;
            navigator.clipboard.writeText(code.innerText).then(() => {
                btn.innerHTML = '<i class="bi bi-clipboard-check me-1"></i>Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });
}

styleTables();
setupTocSpy();
setupCopyButtons();
