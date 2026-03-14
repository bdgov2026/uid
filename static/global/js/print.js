function handlePrint(button) {
    const areaToPrint = button.getAttribute('print');
    const isolate = button.hasAttribute('isolate');
    const rawHTML = button.hasAttribute('rawHTML');
    const contentToPrint = document.querySelector(`[print-area="${areaToPrint}"]`);

    if (!contentToPrint) {
        console.error(`No area found with print-area="${areaToPrint}"`);
        return;
    }

    if (isolate) {
        // Create a new window
        const newWindow = window.open('', '_blank');
        const bodyContent = contentToPrint.outerHTML;

        if (rawHTML) {
            // Raw HTML (exclude head)
            newWindow.document.open();
            newWindow.document.write(bodyContent);
            newWindow.document.write(`
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        `);
        } else {
            // Include head
            const headContent = document.head.innerHTML;
            newWindow.document.open();
            newWindow.document.write(`
          <html>
            <head>${headContent}</head>
            <body>
              ${bodyContent}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        }

        newWindow.document.close();
    } else {
        // Inline print (replace the body content temporarily)
        const printContents = contentToPrint.outerHTML; // Get the content to print

        // Open a new window for printing
        const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(`
        <html>
          <head>${document.head.innerHTML}</head>
          <body>
            ${printContents}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
        newWindow.document.close();
    }
}

// Attach event listeners to buttons
document.querySelectorAll('button[print]').forEach((button) => {
    button.addEventListener('click', () => handlePrint(button));
});