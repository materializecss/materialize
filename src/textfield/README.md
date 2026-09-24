new approach for floating labels aka "form-fields" (css only)

- also use for selects, autocomplete, etc.

```html
<div class="row g-1 p-3">
  <!-- Animated -->
  <fieldset class="form-field animated s12 m4">
    <legend>Given Name</legend>
    <input type="text" id="my-input-1" placeholder=" " />
    <label for="my-input-1">Given Name</label>
  </fieldset>

  <!-- Disabled-->
  <fieldset class="form-field s12 m4" disabled>
    <legend>Family Name</legend>
    <input type="text" id="my-input-2" placeholder="e.g. Doe" />
    <label for="my-input-2">Family Name</label>
  </fieldset>

  <!-- different placeholder than label + required -->
  <fieldset class="form-field s12 m4">
    <legend>Birthmonth</legend>
    <input type="text" id="my-input-3" placeholder="e.g. April" required />
    <label for="my-input-3">Birthmonth</label>
  </fieldset>
</div>
```
