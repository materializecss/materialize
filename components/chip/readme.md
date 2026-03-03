# Chips

Chips can be used to represent small blocks of information. They are most commonly used either for contacts or for tags.

<!-- component -->
<div class="chip">
  <img src="images/yuna.jpg" alt="Contact Person"> Jane Doe
</div>
<div class="chip">
  Tag
  <i class="close material-icons">close</i>
</div>
<div class="chip">
  <i class="material-icons">check</i>
  Filter
  <i class="close material-icons">close</i>
</div>
<div class="chip outlined">Information</div>
<div class="chip outlined">
  <i class="material-icons">check</i>
  Filter
  <i class="close material-icons">close</i>
</div>
<!-- /component -->

```html
<div class="chip">
  <img src="images/yuna.jpg" alt="Contact Person"> Jane Doe
</div>
<div class="chip">
  Tag
  <i class="close material-icons">close</i>
</div>
<div class="chip">
  <i class="material-icons">check</i>
  Filter
  <i class="close material-icons">close</i>
</div>
<div class="chip outlined">Information</div>
<div class="chip outlined">
  <i class="material-icons">check</i>
  Filter
  <i class="close material-icons">close</i>
</div>
```

## Contacts

To create a contact chip just add an img inside.

<!-- component -->
<div class="chip">
  <img src="images/yuna.jpg" alt="Contact Person"> Jane Doe
</div>
<!-- /component -->

```html
<div class="chip">
  <img src="images/yuna.jpg" alt="Contact Person">
  Jane Doe
</div>
```

## Tags

To create a tag chip just add a close icon inside with the class `close`.

<!-- component -->
<div class="chip">
  Tag
  <i class="close material-icons">close</i>
</div>
<!-- /component -->

```html
<div class="chip">
  Tag
  <i class="close material-icons">close</i>
</div>
```

## Javascript Plugin

To add tags, just enter your tag text and press enter. You can delete them by clicking on the close icon or by
  using your delete button.

<!-- Update Info -->
<p class="red-text"><strong>ATTENTION:</strong> Data-Format has changed from version 1.X.X to 2.0.0! Please update option 'data'.</p>

Normal:

<!-- component -->
<div class="chips"></div>
<!-- /component -->

Set initial tags:

<!-- component -->
<div class="chips chips-initial"></div>
<!-- /component -->

Use placeholders and override hint texts:

<!-- component -->
<div class="chips chips-placeholder"></div>
<!-- /component -->

Use autocomplete with chips:

<!-- component -->
<div class="chips chips-autocomplete"></div>
<!-- /component -->

```html
<!-- Default with no input (automatically generated)  -->
<div class="chips"></div>
<div class="chips chips-initial"></div>
<div class="chips chips-placeholder"></div>
<div class="chips chips-autocomplete"></div>
<!-- Customizable input  -->
<div class="chips">
  <input class="custom-class">
</div>
```

## Initialization

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.chips');
  const instances = M.Chips.init(elems, {
    // specify options here
    autocompleteOptions: {
      data: [
        {id: 12, text: "Apple"},
        {id: 13, text: "Microsoft"},
        {id: 42, text: "Google", image: 'http://placehold.it/250x250'}
      ]
    },
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
  });
});
```

Chip data object:

```javascript
const chip = {
  id: '4711', // unique identifier (can be a string too)
  text: 'Title' // optional Text
  image: '', // optional Image-Url
};
```
        
## Options

Note: This could be generated from the JSDocs

<table class="table highlight">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td>Array</td>
      <td>[]</td>
      <td>Set the chip data (look at the Chip data object)</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>String</td>
      <td>''</td>
      <td>Set first placeholder when there are no tags.</td>
    </tr>
    <tr>
      <td>secondaryPlaceholder</td>
      <td>String</td>
      <td>''</td>
      <td>Set second placeholder when adding additional tags.</td>
    </tr>
    <tr>
      <td>closeIconClass</td>
      <td>String</td>
      <td>'material-icons'</td>
      <td>Specifies class to be used in "close" button (useful when working with Material Symbols icon set).</td>
    </tr>
    <tr>
      <td>allowUserInput</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Specifies option to render user input field</td>
    </tr>
    <tr>
      <td>autocompleteOptions</td>
      <td>Object</td>
      <td>{}</td>
      <td>Set autocomplete options.</td>
    </tr>
    <tr>
      <td>autocompleteOnly</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Toggles abililty to add custom value not in autocomplete list.</td>
    </tr>
    <tr>
      <td>limit</td>
      <td>Integer</td>
      <td>Infinity</td>
      <td>Set chips limit.</td>
    </tr>
    <tr>
      <td>onChipAdd</td>
      <td>Function</td>
      <td>null</td>
      <td>Callback for chip add.</td>
    </tr>
    <tr>
      <td>onChipSelect</td>
      <td>Function</td>
      <td>null</td>
      <td>Callback for chip select.</td>
    </tr>
    <tr>
      <td>onChipDelete</td>
      <td>Function</td>
      <td>null</td>
      <td>Callback for chip delete.</td>
    </tr>
    <tr>
  </tbody>
</table>

## Methods

Use these methods to interact with chips. All the methods are called on the plugin instance. You can get the plugin instance like this:

```javascript
const instance = M.Chips.getInstance(elem);
```


### .addChip();
Add chip to input.

#### Arguments
<b>Chip:</b> Chip data object.

```javascript
instance.addChip({
  id: 1337,
  text: 'John Doe', // optional
  image: '', // optional
});
```


### .deleteChip();
Delete nth chip.

#### Arguments
<b>Integer:</b> Index of chip.

```javascript
instance.deleteChip(3); // Delete 3rd chip.
```

### .selectChip();
Select nth chip.

#### Arguments
<b>Integer:</b> Index of chip.

```javascript
instance.selectChip(2); // Select 2nd chip
```

## Properties

Note: This could be generated from JSDocs.

<table class="striped">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>el</td>
      <td>Element</td>
      <td>The DOM element the plugin was initialized with.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>Object</td>
      <td>The options the instance was initialized with.</td>
    </tr>
    <tr>
      <td>chipsData</td>
      <td>Array</td>
      <td>Array of the current chips data.</td>
    </tr>
    <tr>
      <td>hasAutocomplete</td>
      <td>Boolean</td>
      <td>If the chips has autocomplete enabled.</td>
    </tr>
    <tr>
      <td>autocomplete</td>
      <td>Object</td>
      <td><a href="autocomplete.html">Autocomplete</a> instance, if any.</td>
    </tr>
  </tbody>
</table>
