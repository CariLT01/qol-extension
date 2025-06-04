// redirect.js
;(function() {
  const { origin, pathname, search, hash } = window.location;

  // Only act if the path ends with "/Doc2.aspx"
  if (pathname.endsWith("/Doc2.aspx")) {
    console.warn("Redirecting from /Doc2.aspx to /Doc.aspx");

    // Replace just the "/Doc2.aspx" at the end of the path
    const newPath = pathname.replace(/\/Doc2\.aspx$/, "/Doc.aspx");

    // Reconstruct full URL: origin + new path + original query + original hash
    const newUrl = origin + newPath + search + hash;
    window.location.replace(newUrl);
  } else {
    console.warn("URL does NOT end with /Doc2.aspx, no redirect");
  }
})();