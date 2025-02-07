function waitForArticles(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function check() {
      let articles = document.querySelectorAll("article");
      if (articles.length > 0) {
        resolve(articles);
      } else if (Date.now() - startTime > timeout) {
        reject("No GPT responses found.");
      } else {
        setTimeout(check, 500);
      }
    }
    check();
  });
}
function insertCheckboxes() {
  waitForArticles()
    .then((articles) => {
      articles.forEach((article, index) => {
        if ((index + 1) % 2 === 0) {
          // Even-numbered responses only

          // Find button with aria-label="Read aloud"
          let readAloudButton = article.querySelector(
            'button[aria-label="Read aloud"]'
          );

          if (readAloudButton) {
            // Get the second parent of the button
            let targetElement = readAloudButton.parentElement?.parentElement;

            if (targetElement) {
              // Check if the target element contains the checkbox already
              let existingCheckbox = targetElement.querySelector(
                "input[type='checkbox']"
              );

              if (!existingCheckbox) {
                // Create the span and checkbox
                let checkboxWrapper = document.createElement("span");
                checkboxWrapper.setAttribute("data-state", "closed");

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.style.marginBottom = "5px"; // Add spacing

                // Append checkbox to the span
                checkboxWrapper.appendChild(checkbox);

                // Prepend the checkbox to the target element
                targetElement.prepend(checkboxWrapper);
              }
            }
          }
        }
      });
    })
    .catch(console.log);
}

function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function insertButton() {
  let targetElement = getElementByXPath(
    "//*[@id='composer-background']/div[2]/div[1]/div[1]"
  );

  if (targetElement) {
    let existingButton =
      targetElement.parentElement.querySelector("#pdf-button");

    if (!existingButton) {
      let button = document.createElement("button");
      button.id = "pdf-button";
      button.className =
        "flex h-9 min-w-8 items-center justify-center rounded-full border border-token-border-light p-2 text-[13px] font-semibold radix-state-open:bg-black/10 can-hover:hover:bg-token-main-surface-secondary dark:can-hover:hover:bg-gray-700 text-token-text-secondary focus-visible:outline-black can-hover:hover:bg-black/10 dark:focus-visible:outline-white";
      button.setAttribute("aria-label", "Download");

      // Create the SVG
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "feather feather-download");
      svg.setAttribute("fill", "none");
      svg.setAttribute("height", "24");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "24");

      // Create path for SVG
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
      svg.appendChild(path);

      // Create polyline for SVG
      let polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );
      polyline.setAttribute("points", "7 10 12 15 17 10");
      svg.appendChild(polyline);

      // Create line for SVG
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "12");
      line.setAttribute("x2", "12");
      line.setAttribute("y1", "15");
      line.setAttribute("y2", "3");
      svg.appendChild(line);

      // Create the "PDF" text span
      let text = document.createElement("span");
      text.textContent = "PDF";
      text.style.marginLeft = "8px"; // Spacing between SVG and text

      // Add SVG and text to the button
      button.appendChild(svg);
      button.appendChild(text);

      targetElement.parentElement.appendChild(button); // Add button as sibling

      document.body.addEventListener("click", (event) => {
        if (event.target.matches("input[type='checkbox']")) {
          let checkbox = event.target;
          let parent = checkbox;

          for (let i = 0; i < 5; i++) {
            if (parent) {
              parent = parent.parentElement;
            }
          }

          if (parent) {
            let targetChild = parent.querySelector(
              ".flex.max-w-full.flex-col.flex-grow"
            );
            if (targetChild) {
              targetChild.style.border = checkbox.checked
                ? "1px solid darkgreen"
                : "";
            }

            let notes = parent.querySelectorAll(
              ".flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9.bg-token-sidebar-surface-primary.dark\\:bg-token-main-surface-secondary.select-none"
            );
            notes.forEach((note) => {
              note.style.display = checkbox.checked ? "none" : "block";
            });

            let notes2 = parent.querySelectorAll(
              ".absolute.bottom-0.right-2.flex.h-9.items-center"
            );
            notes2.forEach((note2) => {
              note2.style.display = checkbox.checked ? "none" : "block";
            });

            let elementsToChange = parent.querySelectorAll(
              ".overflow-y-auto.p-4"
            );
            elementsToChange.forEach((element) => {
              element.style.fontStyle = checkbox.checked ? "italic" : "";
            });
          }
        }
      });

      button.addEventListener("click", () => {
        // Initialize an array to store the content to append to the new tab
        let contentToAppend = "";

        // Loop through all checkboxes on the page
        let checkboxes = document.querySelectorAll("input[type='checkbox']");

        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            // Traverse up the DOM to find the 5th parent
            let parent = checkbox;
            for (let i = 0; i < 5; i++) {
              if (parent) {
                parent = parent.parentElement;
              }
            }

            if (parent) {
              // Search for the child with the class 'flex max-w-full flex-col flex-grow'
              let targetChild = parent.querySelector(
                ".flex.max-w-full.flex-col.flex-grow"
              );

              if (targetChild) {
                // Remove all <hr> tags from the content
                targetChild.querySelectorAll("hr").forEach((hr) => hr.remove());
                // Get the first child itself as the content
                contentToAppend += targetChild.innerHTML + "<hr>"; // Preserve the HTML structure
              }
            }
          }
        });

        // Check if no content was appended (no checkbox selected)
        if (!contentToAppend) {
          alert("Please select at least one checkbox!");
          return; // Exit the function to prevent opening a new tab
        }
        // Function to recursively reduce the font size by 10% for each element
        function reduceFontSize(element) {
          if (
            element.nodeType === 1 &&
            !element.hasAttribute("data-font-resized")
          ) {
            // Check if the node is an element node and hasn't been resized already
            let currentFontSize = window.getComputedStyle(element).fontSize;
            let fontSizeValue = parseFloat(currentFontSize); // Get numeric value of font size
            let reducedFontSize = fontSizeValue * 0.97; // Reduce font size by 10%

            // Set the new font size
            element.style.fontSize = reducedFontSize + "px";

            // Mark this element as resized to prevent further reductions
            element.setAttribute("data-font-resized", "true");

            // Recursively reduce font size for child elements
            for (let child of element.children) {
              reduceFontSize(child);
            }
          }

          // Traverse other types of nodes (e.g., text nodes, comments, etc.)
          for (let child of element.childNodes) {
            if (child.nodeType !== 1) {
              // Avoid reprocessing element nodes (already handled)
              reduceFontSize(child);
            }
          }
        }

        // Open a single new tab and append all the content
        if (contentToAppend) {
          let newTab = window.open("", "_blank");
          newTab.document.write(
            '<html class="light" style="color-scheme: light;"><head><title>Content</title>'
          );
          // Create a content wrapper to contain the content inside the viewport
          newTab.document.write('<div class="content-wrapper">');
          newTab.document.write(contentToAppend); // Append all the content
          newTab.document.write("</div>");
          newTab.document.write("</body></html>");
          newTab.document.close(); // Close the document after writing
          // Wait until the content is fully loaded before reducing font sizes
          reduceFontSize(newTab.document.body); // Reduce font size of all elements
          newTab.print(); // Print the content
        }
      }); // Closing the event listener function here
    } // Close if (exitingButton)
  } else {
    console.log("Target element not found.");
  }
}

// Run every 2 seconds for checkboxes
setInterval(insertCheckboxes, 2000);

// Run every 2 seconds to ensure the button is added, even after page updates
setInterval(insertButton, 2000);
