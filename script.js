// Configure Marked.js to add IDs to headings
marked.setOptions({
    headerIds: true,
    headerPrefix: ''
});

// Fetch and render CCNR.md
fetch('CCNR.md')
    .then(response => response.text())
    .then(markdown => {
        const html = marked.parse(markdown);
        document.getElementById('content').innerHTML = html;
        generateTOC();
        handleDeepLink();
    })
    .catch(error => {
        console.error('Error loading CCNR.md:', error);
        document.getElementById('content').innerHTML = '<p>Error loading content.</p>';
    });

// Generate Table of Contents
function generateTOC() {
    const toc = document.getElementById('toc');
    const headings = document.querySelectorAll('#content h1, #content h2, #content h3, #content h4, #content h5, #content h6');
    headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.style.display = 'block';
        link.style.marginLeft = (parseInt(heading.tagName[1]) - 1) * 20 + 'px';
        link.style.padding = '5px 0';
        link.style.textDecoration = 'none';
        link.style.color = '#007bff';
        toc.appendChild(link);
    });
}

// Handle deep linking
function handleDeepLink() {
    const hash = window.location.hash;
    if (hash) {
        const parts = hash.substring(1).split(':');
        const sectionId = parts[0];
        const textToHighlight = parts[1];

        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (textToHighlight) {
                // Use Mark.js to highlight text
                const markInstance = new Mark(document.querySelector('main'));
                markInstance.mark(textToHighlight, {
                    className: 'highlight',
                    accuracy: 'exactly'
                });
            }
        }
    }
}

// Handle hash changes (for dynamic navigation)
window.addEventListener('hashchange', handleDeepLink);

// Handle text selection to create deep links
document.addEventListener('selectionchange', function() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer;

            // Find the closest heading
            let element = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer;
            let heading = element.closest('h1, h2, h3, h4, h5, h6');

            if (heading && heading.id) {
                const sectionId = heading.id;
                const encodedText = encodeURIComponent(selectedText);
                const newHash = sectionId + ':' + encodedText;
                if (location.hash !== '#' + newHash) {
                    history.replaceState(null, null, '#' + newHash);
                }
            }
        }
    }
});