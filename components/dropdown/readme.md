# Dropdown

Use popover and anchor positioning

```html
<button
  id="dropdown-trigger-1"
  class="dropdown-trigger"
  data-target="my-dropdown"
  aria-expanded="false"
>
  Options Menu ▾
</button>

<ul id="my-dropdown" class="dropdown-content">
  <li><a href="#profile">Profile</a></li>
  <li><a href="#settings">Settings</a></li>
  <li><a href="#help">Help & Support</a></li>
  <li tabindex="-1"><hr /></li>
  <li><button type="button">Sign Out</button></li>
</ul>
```
