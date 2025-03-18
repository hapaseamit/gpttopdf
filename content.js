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
function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

// Store the currently hovered element
let hoveredElement = null;

// Store selected elements
let selectedElements = new Set();

// Event listener to track mouse hover over target elements
document.body.addEventListener("mouseover", (event) => {
  if (event.target.closest(".flex.max-w-full.flex-col.flex-grow")) {
    hoveredElement = event.target.closest(
      ".flex.max-w-full.flex-col.flex-grow"
    );
  } else {
    hoveredElement = null;
  }
});

// Event listener for keydown (Ctrl + X)
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "x") {
    event.preventDefault(); // Prevent default Ctrl+X behavior

    if (!hoveredElement) return;

    let parent = hoveredElement;

    // Traverse up 5 levels in the DOM hierarchy to find the relevant parent container
    for (let i = 0; i < 5; i++) {
      if (parent) {
        parent = parent.parentElement;
      }
    }

    if (parent) {
      // Toggle selection
      if (selectedElements.has(hoveredElement)) {
        hoveredElement.style.border = "";
        selectedElements.delete(hoveredElement);
      } else {
        hoveredElement.style.border = "1px solid darkgreen";
        selectedElements.add(hoveredElement);
      }

      let isSelected = selectedElements.has(hoveredElement);

      // find code block element and remove buttons copy & edit
      let codeblocktitle = parent.querySelectorAll(
        ".flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.h-9.bg-token-sidebar-surface-primary.dark\\:bg-token-main-surface-secondary.select-none.rounded-t-\\[5px\\]"
      );
      codeblocktitle.forEach((title) => {
        title.style.display = isSelected ? "none" : "block";
      });

      // find code block element and remove buttons copy & edit
      let copyeditbtns = parent.querySelectorAll(
        ".absolute.bottom-0.right-0.flex.h-9.items-center.pr-2"
      );
      copyeditbtns.forEach((btn) => {
        btn.style.display = isSelected ? "none" : "block";
      });

      // Show/hide reasonedDiv
      let reasonedDiv = parent.querySelector(".my-1.flex.flex-col");
      if (reasonedDiv) {
        let button = reasonedDiv.querySelector("button");
        if (button && button.innerText.includes("Reasoned")) {
          reasonedDiv.style.display = isSelected ? "none" : "block";
        }
      }

      // Hide/show all <hr> elements
      let all_hrs = parent.querySelectorAll("hr");
      all_hrs.forEach((hr) => {
        hr.style.display = isSelected ? "none" : "block";
      });

      // Change font style
      let elementsToChange = parent.querySelectorAll(".overflow-y-auto.p-4");
      elementsToChange.forEach((element) => {
        element.style.fontStyle = isSelected ? "italic" : "";
      });
    }
  }
});

// button.addEventListener("click", () => {
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "j") {
    event.preventDefault(); // Prevent default Ctrl+j behavior
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

    if (contentToAppend) {
      let newTab = window.open("", "_blank");

      if (newTab) {
        // Ensure the document is fully loaded before modifying content
        newTab.document.write(`
      <html class="light" style="color-scheme: light;">
      <head>
        <title>Content</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .content-wrapper { border: 1px solid #ddd; padding: 10px; }
        </style>
      </head>
      <body>
        <div class="content-wrapper">${contentToAppend}</div>
      </body>
      </html>
    `);
        newTab.document.close();

        // Wait for content to be fully loaded before applying styles & printing
        newTab.onload = () => {
          reduceFontSize(newTab.document.body);
          newTab.print();
        };
      }
    }
  }
});
