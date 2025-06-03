(() => {
  const ICON_URL: string = chrome.runtime.getURL("assets/word-icon.png");

  function injectFavicon(): void {
    if (!document.head) return;
    console.log("Attempt to inject icon");
    const link: HTMLLinkElement = document.createElement("link");
    link.rel = "icon";
    link.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAWlBMVEVHcEwqVpkpVZgqVpkpVJcqVpkpVZkqVpkqV5onUpX///8oVJcsWZ0qV5sqVpk5YqDi6PHx9PlTdq21xdzZ4e2muNSYrc53k776+/1BaaTF0eSHoMVmhbbK1eaTVyW8AAAACXRSTlMAIOnaaJO8PxFXEloGAAACd0lEQVRYw9WXiXKDIBCGzdkgl6KgeLz/a3aXYIqKiaTTmeZvZ9Jq9hv491Cy7E91O3ydL9fj+d3Qy/V0pISQ85uhFINJAuARKoSgXjsBGHrGUM6F127AFMr4XVO8CACXw5ZuWQahTpyzGSBcwXFLp+tXxnw8ewJgckv8+gDwxRZCQF9vqJJiF0DnG6ol/RBAU0VUJwAEZysJkwCgEZEUwGAiGj8qCzpv14oDXKAjMGgA4QF2iKiaA+DrABFyGJoBwomqxrpiUxZIRPMs9N1YSc7pULZ5xwDQwG09bUHaiHQIwKooleCih6uFhWmC/J54gCkiKkMAb9q8HaDgcGOlAhcq/CS7syAU8BoqJBZ43hAqoUwKuR/AMdIIx4E/KLVFnlfiMVDGiIp5FmDJYDpYB4iOkQHSbMgEiPQSY/MscPh3lOBlO+JlTEI7PADkdTNRcLGwrMvLvkT3DCbjARj6iLr5ChTGwc5rBXtrMAkjS+kFbmtYs2rBCNiDQU91WjOhiz2UUU/h25XLKknrRti11ugc+FeDI66MPEA1ES2aSUDcWKNz6IZ29+jPA/5lM91dLLGRwMl2KqNnj7YlwLoq1jAIOre9nrx4tJULwD2u8Y3oyyg0sV39LiaS8Y2I9TyVUUoW0EW4ANPQdVTHgployoja5Qqs0ZUBELQy3DQkAEgVkV4CmPBTmVulBhtO5V1pDMY6xs3Gut21gifPBdPu8eCfv2Do9U/KCwYVa9HfvmAkARodUf1bEz8rjf3YRTXqne/Kgm1JXKfzwlPA8bSly8Gf7NYnltmR57Z9YJkdEIMzU+Kha4F5GzDHvA1YYN4FeIyjnLP/rG84ZazjhyPn+wAAAABJRU5ErkJggg==";
    document.head.appendChild(link);
  }

  function observeHead(): void {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      // mutations is already an array, so for-of is fine here
      for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m];
        // mutation.addedNodes is a NodeList, NOT iterable in some TS configs
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (!(node instanceof HTMLLinkElement)) continue;
          const rel = (node.getAttribute("rel") || "").toLowerCase();
          if (rel.includes("icon")) {
            node.remove();
            // If ours got removed, re-inject
            if (!document.querySelector("link[rel='icon']")) {
              injectFavicon();
            }
          }
        }
      }
    });

    observer.observe(document.head!, { childList: true, subtree: true });
  }

  if (document.head) {
    injectFavicon();
    observeHead();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      injectFavicon();
      observeHead();
    });
  }
})();