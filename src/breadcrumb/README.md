# Breadcrumb

Good for navigating a tree structure.

## Usage

```html
<nav aria-label="Breadcrumb">
  <ol class="mw-breadcrumb">
    <li class="mw-breadcrumb-item">
      <a href="#" class="mw-breadcrumb-link">
        <span class="material-symbols-outlined">home</span>
        Home
      </a>
    </li>
    <span class="material-symbols-outlined mw-breadcrumb-separator" aria-hidden="true"
      >chevron_right</span
    >
    <li class="mw-breadcrumb-item">
      <a href="#" class="mw-breadcrumb-link">Settings</a>
    </li>
    <span class="material-symbols-outlined mw-breadcrumb-separator" aria-hidden="true"
      >chevron_right</span
    >
    <li class="mw-breadcrumb-item" aria-current="page">Accessibility</li>
  </ol>
</nav>
```

Deprecated, old:

```html
<nav class="breadcrumb-wrapper">
  <div class="col s12">
    <a href="#!" class="breadcrumb">First</a>
    <a href="#!" class="breadcrumb">Second</a>
    <a href="#!" class="breadcrumb">Third</a>
  </div>
</nav>
```
