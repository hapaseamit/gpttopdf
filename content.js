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

      // Adding a click event listener to the entire document body
      document.body.addEventListener("click", (event) => {
        // Checking if the clicked element is a checkbox input
        if (event.target.matches("input[type='checkbox']")) {
          let checkbox = event.target; // Get the clicked checkbox
          let parent = checkbox; // Initialize parent variable with the checkbox element

          // Traverse up 5 levels in the DOM hierarchy to find the relevant parent container
          for (let i = 0; i < 5; i++) {
            if (parent) {
              parent = parent.parentElement;
            }
          }

          if (parent) {
            // Find a specific child element with the given class and apply a border when checkbox is checked
            let targetChild = parent.querySelector(
              ".flex.max-w-full.flex-col.flex-grow"
            );
            if (targetChild) {
              targetChild.style.border = checkbox.checked
                ? "1px solid darkgreen" // Add border when checked
                : ""; // Remove border when unchecked
            }

            // Find and hide/show elements matching the specified class when checkbox is checked/unchecked
            let notes = parent.querySelectorAll(
              ".flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md.h-9.bg-token-sidebar-surface-primary.dark\\:bg-token-main-surface-secondary.select-none"
            );
            notes.forEach((note) => {
              note.style.display = checkbox.checked ? "none" : "block";
            });

            // Another set of elements to hide/show based on checkbox state
            let notes2 = parent.querySelectorAll(
              ".absolute.bottom-0.right-2.flex.h-9.items-center"
            );
            notes2.forEach((note2) => {
              note2.style.display = checkbox.checked ? "none" : "block";
            });

            // Show hide reasondiv
            let reasonedDiv = parent.querySelector(".my-1.flex.flex-col");
            if (reasonedDiv) {
              let button = reasonedDiv.querySelector("button");
              if (button && button.innerText.includes("Reasoned")) {
                reasonedDiv.style.display = checkbox.checked ? "none" : "block";
              }
            }

            // Remove all <hr> tags from the content
            all_hrs = parent.querySelectorAll("hr");
            for (let hr of all_hrs) {
              hr.style.display = checkbox.checked ? "none" : "block";
            }

            // Find elements with a specific class and change font style when checkbox is checked
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

        // Select all elements with 'border: 1px solid darkgreen'
        let borderedElements = document.querySelectorAll(
          ".flex.max-w-full.flex-col.flex-grow"
        );

        borderedElements.forEach((element) => {
          if (element.style.border == "1px solid darkgreen") {
            // Append the content of the selected div
            contentToAppend += element.innerHTML + "<hr>"; // Preserve structure
          }
        });

        // Check if no content was appended
        if (!contentToAppend) {
          alert("Please select at least one element with a dark green border!");
          return;
        }

        // Function to recursively reduce font size by 3% for each element
        function reduceFontSize(element) {
          if (
            element.nodeType === 1 &&
            !element.hasAttribute("data-font-resized")
          ) {
            let currentFontSize = window.getComputedStyle(element).fontSize;
            let fontSizeValue = parseFloat(currentFontSize);
            let reducedFontSize = fontSizeValue * 0.97; // Reduce by 3%

            element.style.fontSize = reducedFontSize + "px";
            element.setAttribute("data-font-resized", "true");

            for (let child of element.children) {
              reduceFontSize(child);
            }
          }

          for (let child of element.childNodes) {
            if (child.nodeType !== 1) {
              reduceFontSize(child);
            }
          }
        }

        // Open a new tab and append content
        if (contentToAppend) {
          let newTab = window.open("", "_blank");
          newTab.document.write(
            '<html class="light" style="color-scheme: light;"><head><title>Content</title></head><body>'
          );
          newTab.document.write('<div class="content-wrapper">');
          newTab.document.write(contentToAppend);
          newTab.document.write("</div>");
          newTab.document.write("</body></html>");
          newTab.document.close();

          // Reduce font size
          reduceFontSize(newTab.document.body);

          // Print the content
          newTab.print();
        }
      });
    } // Close if (exitingButton)
  } else {
    console.log("Target element not found.");
  }
}

// Run every 2 seconds for checkboxes
setInterval(insertCheckboxes, 2000);

// Run every 2 seconds to ensure the button is added, even after page updates
setInterval(insertButton, 2000);
