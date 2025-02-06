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

          // Use the specified XPath element for the target
          let targetElement = document.evaluate(
            "/html/body/div[1]/div/div[1]/div[2]/main/div[1]/div[1]/div/div/div/div/article[" +
              (index + 1) +
              "]/div/div/div/div/div[2]/div/div",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (targetElement) {
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

      let checkboxes = document.querySelectorAll("input[type='checkbox']");

      checkboxes.forEach((checkbox) => {
        // Add event listener to checkbox for click event
        checkbox.addEventListener("click", () => {
          if (checkbox.checked) {
            // Traverse up to the 5th parent
            let parent = checkbox;
            for (let i = 0; i < 5; i++) {
              if (parent) {
                parent = parent.parentElement;
              }
            }

            if (parent) {
              // Add green border if checkbox is checked

              parent.firstElementChild.style.border = "1px solid darkgreen";

              // Hide all matching elements
              let notes = parent.querySelectorAll(
                ".flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9.bg-token-sidebar-surface-primary.dark\\:bg-token-main-surface-secondary.select-none"
              );
              notes.forEach((note) => {
                note.style.display = "none"; // Hide each matching element
              });

              let notes2 = parent.querySelectorAll(
                ".absolute.bottom-0.right-2.flex.h-9.items-center"
              );
              notes2.forEach((note2) => {
                note2.style.display = "none"; // Hide each matching element
              });
              let elementsToChange = parent.querySelectorAll(
                ".overflow-y-auto.p-4"
              );
              elementsToChange.forEach((element) => {
                // Change the inner text style to italic
                element.style.fontStyle = "italic";
              });
            }
          } else {
            // If unchecked, remove the green border
            let parent = checkbox;
            for (let i = 0; i < 5; i++) {
              if (parent) {
                parent = parent.parentElement;
              }
            }

            if (parent) {
              // Remove green border
              parent.firstElementChild.style.border = "";
            }

            // Toggle visibility of all target elements
            let notes = parent.querySelectorAll(
              ".flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9.bg-token-sidebar-surface-primary.dark\\:bg-token-main-surface-secondary.select-none"
            );
            notes.forEach((note) => {
              note.style.display = "block"; // Show each matching element
            });

            let notes2 = parent.querySelectorAll(
              ".absolute.bottom-0.right-2.flex.h-9.items-center"
            );
            notes2.forEach((note2) => {
              note2.style.display = "block"; // Show each matching element
            });
            // Toggle code italic
            let elementsToChange = parent.querySelectorAll(
              ".overflow-y-auto.p-4"
            );
            elementsToChange.forEach((element) => {
              // Remove italic style
              element.style.fontStyle = "";
            });
          }
        });
      });
      // Add click event listener to the button
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
              // Now target the first child of the 5th parent
              let firstChild = parent.firstElementChild;
              if (firstChild) {
                // Get the first child itself as the content
                let lastDiv = firstChild; // Directly target the firstChild itself
                if (lastDiv) {
                  // Append the content to the contentToAppend string
                  contentToAppend += lastDiv.innerHTML + "<hr>"; // Preserve the HTML structure
                }
              }
            }
          }
        });

        // Check if no content was appended (no checkbox selected)
        if (!contentToAppend) {
          alert("Please select at least one checkbox!");
          return; // Exit the function to prevent opening a new tab
        }

        // Open a single new tab and append all the content
        if (contentToAppend) {
          let newTab = window.open("", "_blank");
          newTab.document.write(
            '<html class="light" style="color-scheme: light;"><head><title>Content</title>'
          );
          newTab.document.write(
            '<style>body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; font-size: 14px !important; margin: 0; padding: 20px; width: 100%; }' +
              "</style>"
          );
          newTab.document.write(
            '<link rel="stylesheet" href="https://cdn.oaistatic.com/assets/root-lbp7d9q9.css">'
          );
          newTab.document.write(
            '<link rel="stylesheet" href="https://cdn.oaistatic.com/assets/conversation-small-nranh1cg.css">'
          );

          newTab.document.write("</head><body>");
          // Create a content wrapper to contain the content inside the viewport
          newTab.document.write('<div class="content-wrapper">');
          newTab.document.write(contentToAppend); // Append all the content
          newTab.document.write("</div>");
          newTab.document.write("</body></html>");
          newTab.document.close(); // Close the document after writing
          newTab.print();
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
