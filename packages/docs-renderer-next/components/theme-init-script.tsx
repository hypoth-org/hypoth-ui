import Script from "next/script";

// Theme init script - runs before paint to prevent flash
const themeInitScript = `(function(){
  var root = document.documentElement;
  var mode = (function() {
    try {
      var stored = localStorage.getItem('ds-mode');
      if (stored) return stored;
    } catch(e) {}
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    if (window.matchMedia('(prefers-contrast: more)').matches) return 'high-contrast';
    return 'light';
  })();
  root.dataset.mode = mode;
  try {
    var brand = localStorage.getItem('ds-brand');
    if (brand) root.dataset.brand = brand;
  } catch(e) {}
})();`;

/**
 * Theme initialization script component
 * Uses dangerouslySetInnerHTML to inject the script that runs before paint
 * This is safe because the script content is a static string defined in this file
 */
export function ThemeInitScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
