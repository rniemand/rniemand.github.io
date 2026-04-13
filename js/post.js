const styleTables = () => {
    document.querySelectorAll('.post-body table:not(.skip-auto-class)').forEach(t => {
        t.classList.add('table', 'table-sm', 'table-striped', 'table-hover');
    });
}

const wrapTables = () => {
    document.querySelectorAll('.post-body table:not(.skip-auto-class)').forEach(t => {
        if (t.parentElement.classList.contains('table-wrap')) return;
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        t.parentNode.insertBefore(wrap, t);
        wrap.appendChild(t);
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

const LANG_NAMES = {
    'js': 'JavaScript', 'javascript': 'JavaScript',
    'ts': 'TypeScript', 'typescript': 'TypeScript',
    'css': 'CSS', 'html': 'HTML', 'xml': 'XML', 'svg': 'SVG',
    'bash': 'Bash', 'sh': 'Shell', 'shell': 'Shell', 'zsh': 'Zsh', 'fish': 'Fish',
    'python': 'Python', 'py': 'Python',
    'json': 'JSON', 'json5': 'JSON5', 'yaml': 'YAML', 'yml': 'YAML', 'toml': 'TOML', 'ini': 'INI',
    'csharp': 'C#', 'cs': 'C#', 'cpp': 'C++', 'c': 'C',
    'java': 'Java', 'go': 'Go', 'rust': 'Rust', 'kotlin': 'Kotlin', 'scala': 'Scala',
    'sql': 'SQL', 'markdown': 'Markdown', 'md': 'Markdown',
    'nginx': 'Nginx', 'dockerfile': 'Dockerfile', 'docker': 'Dockerfile',
    'powershell': 'PowerShell', 'ps1': 'PowerShell',
    'ruby': 'Ruby', 'rb': 'Ruby', 'php': 'PHP',
    'scss': 'SCSS', 'sass': 'Sass', 'less': 'Less',
    'graphql': 'GraphQL', 'svelte': 'Svelte', 'vue': 'Vue',
    'jsx': 'JSX', 'tsx': 'TSX',
};

const setupCodeBlocks = () => {
    document.querySelectorAll('.post-body pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const codeEl = pre.querySelector('code') || pre;

        // Detect language from class on <pre> or <code>
        const langMatch = (pre.className + ' ' + codeEl.className).match(/language-([^\s]+)/);
        const langKey = langMatch ? langMatch[1].replace(/^diff-/, '').toLowerCase() : '';
        const langDisplay = LANG_NAMES[langKey] || (langKey ? langKey.toUpperCase() : '');

        // Header bar: language label left, copy button right
        const header = document.createElement('div');
        header.className = 'code-block-header';

        const langLabel = document.createElement('span');
        langLabel.className = 'code-lang-label';
        langLabel.textContent = langDisplay;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.setAttribute('title', 'Copy code');
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';

        header.appendChild(langLabel);
        header.appendChild(copyBtn);
        wrapper.insertBefore(header, pre);

        copyBtn.addEventListener('click', () => {
            const text = codeEl.innerText.replace(/\n$/, '');
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i>';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        // Line numbers — inject empty spans, CSS counters do the numbering
        const rawText = codeEl.innerText.replace(/\n$/, '');
        const lineCount = rawText.split('\n').length;

        const lnRows = document.createElement('span');
        lnRows.className = 'code-line-numbers-rows';
        lnRows.setAttribute('aria-hidden', 'true');
        lnRows.innerHTML = Array.from({length: lineCount}, () => '<span></span>').join('');
        codeEl.appendChild(lnRows);
        pre.classList.add('has-line-numbers');

        // Collapse logic — show only 10 lines by default if code is longer
        if (lineCount <= 10) return;

        const hiddenCount = lineCount - 10;

        const cs = window.getComputedStyle(codeEl);
        let lh = parseFloat(cs.lineHeight);
        if (isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.5;
        const preCs = window.getComputedStyle(pre);
        const collapsedHeight = Math.ceil(lh * 10 + parseFloat(preCs.paddingTop) + parseFloat(preCs.paddingBottom));

        pre.classList.add('code-pre-collapsible', 'code-pre-collapsed');
        pre.style.maxHeight = collapsedHeight + 'px';
        wrapper.classList.add('code-block-collapsed');

        const expander = document.createElement('div');
        expander.className = 'code-expander';
        expander.innerHTML = `<button class="code-expand-btn" aria-expanded="false">
            <i class="bi bi-chevron-down"></i>
            <span>${hiddenCount} more line${hiddenCount !== 1 ? 's' : ''} — click to expand</span>
        </button>`;
        wrapper.appendChild(expander);

        const expandBtn = expander.querySelector('.code-expand-btn');
        let expanded = false;

        expandBtn.addEventListener('click', () => {
            expanded = !expanded;
            if (expanded) {
                pre.classList.remove('code-pre-collapsed');
                pre.style.maxHeight = pre.scrollHeight + 'px';
                wrapper.classList.remove('code-block-collapsed');
                expandBtn.setAttribute('aria-expanded', 'true');
                expandBtn.innerHTML = `<i class="bi bi-chevron-up"></i><span>Show less</span>`;
            } else {
                pre.classList.add('code-pre-collapsed');
                pre.style.maxHeight = collapsedHeight + 'px';
                wrapper.classList.add('code-block-collapsed');
                expandBtn.setAttribute('aria-expanded', 'false');
                expandBtn.innerHTML = `<i class="bi bi-chevron-down"></i><span>${hiddenCount} more line${hiddenCount !== 1 ? 's' : ''} — click to expand</span>`;
            }
        });
    });
}

styleTables();
wrapTables();
setupTocSpy();
setupCodeBlocks();
