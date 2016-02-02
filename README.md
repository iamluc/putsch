Putsch
======

ABOUT
-----
Putsch is a simple jQuery plugin to load remote content and synchronize URL using pushState.

LICENSE
-------
MIT

USAGE
-----

Standard

```html
<script>
    jQuery(document).ready(function() {
        $('[data-putsch-target]').putsch();
    })
</script>

<div class="container">
    <a href="/link-content.html" data-putsch-target="#container">Test !</a>
    <div id="container">Nothing here.</div>
</div>
```

