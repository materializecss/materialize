/*!
* Materialize v2.2.2 (https://materializeweb.com)
* Copyright 2014-2025 Materialize
* MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)
*/
var M = (function (exports) {
    'use strict';

    /**
     * Class with utilitary functions for global usage.
     */
    class Utils {
        /** Specifies wether tab is pressed or not. */
        static tabPressed = false;
        /** Specifies wether there is a key pressed. */
        static keyDown = false;
        /**
         * Key maps.
         */
        static keys = {
            TAB: ['Tab'],
            ENTER: ['Enter'],
            ESC: ['Escape', 'Esc'],
            BACKSPACE: ['Backspace'],
            ARROW_UP: ['ArrowUp', 'Up'],
            ARROW_DOWN: ['ArrowDown', 'Down'],
            ARROW_LEFT: ['ArrowLeft', 'Left'],
            ARROW_RIGHT: ['ArrowRight', 'Right'],
            DELETE: ['Delete', 'Del']
        };
        /**
         * Detects when a key is pressed.
         * @param e Event instance.
         */
        static docHandleKeydown(e) {
            Utils.keyDown = true;
            if ([...Utils.keys.TAB, ...Utils.keys.ARROW_DOWN, ...Utils.keys.ARROW_UP].includes(e.key)) {
                Utils.tabPressed = true;
            }
        }
        /**
         * Detects when a key is released.
         * @param e Event instance.
         */
        static docHandleKeyup(e) {
            Utils.keyDown = false;
            if ([...Utils.keys.TAB, ...Utils.keys.ARROW_DOWN, ...Utils.keys.ARROW_UP].includes(e.key)) {
                Utils.tabPressed = false;
            }
        }
        /**
         * Detects when document is focused.
         * @param e Event instance.
         */
        /* eslint-disabled as of required event type condition check */
        /* eslint-disable-next-line */
        static docHandleFocus(e) {
            if (Utils.keyDown) {
                document.body.classList.add('keyboard-focused');
            }
        }
        /**
         * Detects when document is not focused.
         * @param e Event instance.
         */
        /* eslint-disabled as of required event type condition check */
        /* eslint-disable-next-line */
        static docHandleBlur(e) {
            document.body.classList.remove('keyboard-focused');
        }
        /**
         * Generates a unique string identifier.
         */
        static guid() {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
        /**
         * Checks for exceeded edges
         * @param container Container element.
         * @param bounding Bounding rect.
         * @param offset Element offset.
         */
        static checkWithinContainer(container, bounding, offset) {
            const edges = {
                top: false,
                right: false,
                bottom: false,
                left: false
            };
            const containerRect = container.getBoundingClientRect();
            // If body element is smaller than viewport, use viewport height instead.
            const containerBottom = container === document.body
                ? Math.max(containerRect.bottom, window.innerHeight)
                : containerRect.bottom;
            const scrollLeft = container.scrollLeft;
            const scrollTop = container.scrollTop;
            const scrolledX = bounding.left - scrollLeft;
            const scrolledY = bounding.top - scrollTop;
            // Check for container and viewport for each edge
            if (scrolledX < containerRect.left + offset || scrolledX < offset) {
                edges.left = true;
            }
            if (scrolledX + bounding.width > containerRect.right - offset ||
                scrolledX + bounding.width > window.innerWidth - offset) {
                edges.right = true;
            }
            if (scrolledY < containerRect.top + offset || scrolledY < offset) {
                edges.top = true;
            }
            if (scrolledY + bounding.height > containerBottom - offset ||
                scrolledY + bounding.height > window.innerHeight - offset) {
                edges.bottom = true;
            }
            return edges;
        }
        /**
         * Checks if element can be aligned in multiple directions.
         * @param el Element to be inspected.
         * @param container Container element.
         * @param bounding Bounding rect.
         * @param offset Element offset.
         */
        static checkPossibleAlignments(el, container, bounding, offset) {
            const canAlign = {
                top: true,
                right: true,
                bottom: true,
                left: true,
                spaceOnTop: null,
                spaceOnRight: null,
                spaceOnBottom: null,
                spaceOnLeft: null
            };
            const containerAllowsOverflow = getComputedStyle(container).overflow === 'visible';
            const containerRect = container.getBoundingClientRect();
            const containerHeight = Math.min(containerRect.height, window.innerHeight);
            const containerWidth = Math.min(containerRect.width, window.innerWidth);
            const elOffsetRect = el.getBoundingClientRect();
            const scrollLeft = container.scrollLeft;
            const scrollTop = container.scrollTop;
            const scrolledX = bounding.left - scrollLeft;
            const scrolledYTopEdge = bounding.top - scrollTop;
            const scrolledYBottomEdge = bounding.top + elOffsetRect.height - scrollTop;
            // Check for container and viewport for left
            canAlign.spaceOnRight = !containerAllowsOverflow
                ? containerWidth - (scrolledX + bounding.width)
                : window.innerWidth - (elOffsetRect.left + bounding.width);
            if (canAlign.spaceOnRight < 0) {
                canAlign.left = false;
            }
            // Check for container and viewport for Right
            canAlign.spaceOnLeft = !containerAllowsOverflow
                ? scrolledX - bounding.width + elOffsetRect.width
                : elOffsetRect.right - bounding.width;
            if (canAlign.spaceOnLeft < 0) {
                canAlign.right = false;
            }
            // Check for container and viewport for Top
            canAlign.spaceOnBottom = !containerAllowsOverflow
                ? containerHeight - (scrolledYTopEdge + bounding.height + offset)
                : window.innerHeight - (elOffsetRect.top + bounding.height + offset);
            if (canAlign.spaceOnBottom < 0) {
                canAlign.top = false;
            }
            // Check for container and viewport for Bottom
            canAlign.spaceOnTop = !containerAllowsOverflow
                ? scrolledYBottomEdge - (bounding.height - offset)
                : elOffsetRect.bottom - (bounding.height + offset);
            if (canAlign.spaceOnTop < 0) {
                canAlign.bottom = false;
            }
            return canAlign;
        }
        /**
         * Retrieves target element id from trigger.
         * @param trigger Trigger element.
         */
        static getIdFromTrigger(trigger) {
            let id = trigger.dataset.target;
            if (!id) {
                id = trigger.getAttribute('href');
                return id ? id.slice(1) : '';
            }
            return id;
        }
        /**
         * Retrieves document scroll postion from top.
         */
        static getDocumentScrollTop() {
            return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }
        /**
         * Retrieves document scroll postion from left.
         */
        static getDocumentScrollLeft() {
            return window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        }
        /**
         * Fires the given function after a certain ammount of time.
         * @param func Function to be fired.
         * @param wait Wait time.
         * @param options Additional options.
         */
        static throttle(func, wait, options = {}) {
            let context, args, result, timeout = null, previous = 0;
            const later = () => {
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return (...args) => {
                const now = new Date().getTime();
                if (!previous && options.leading === false)
                    previous = now;
                const remaining = wait - (now - previous);
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(this, args);
                }
                else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }
        /**
         * Renders confirm/close buttons with callback function
         */
        static createConfirmationContainer(container, confirmText, cancelText, onConfirm, onCancel) {
            const confirmationButtonsContainer = document.createElement('div');
            confirmationButtonsContainer.classList.add('confirmation-btns');
            container.append(confirmationButtonsContainer);
            this.createButton(confirmationButtonsContainer, cancelText, ['btn-cancel'], true, onCancel);
            this.createButton(confirmationButtonsContainer, confirmText, ['btn-confirm'], true, onConfirm);
        }
        /**
         * Renders a button with optional callback function
         */
        static createButton(container, text, className = [], visibility = true, callback = null) {
            className = className.concat(['btn', 'waves-effect', 'text']);
            const button = document.createElement('button');
            button.className = className.join(' ');
            button.style.visibility = visibility ? 'visible' : 'hidden';
            button.type = 'button';
            button.tabIndex = !!visibility ? 0 : -1;
            button.innerText = text;
            button.addEventListener('click', callback);
            button.addEventListener('keypress', (e) => {
                if (Utils.keys.ENTER.includes(e.key))
                    callback(e);
            });
            container.append(button);
        }
        static _setAbsolutePosition(origin, container, position, margin, transitionMovement, align = 'center') {
            const originHeight = origin.offsetHeight, originWidth = origin.offsetWidth, containerHeight = container.offsetHeight, containerWidth = container.offsetWidth;
            let xMovement = 0, yMovement = 0, targetTop = origin.getBoundingClientRect().top + Utils.getDocumentScrollTop(), targetLeft = origin.getBoundingClientRect().left + Utils.getDocumentScrollLeft();
            if (position === 'top') {
                targetTop += -containerHeight - margin;
                if (align === 'center') {
                    targetLeft += originWidth / 2 - containerWidth / 2; // This is center align
                }
                yMovement = -transitionMovement;
            }
            else if (position === 'right') {
                targetTop += originHeight / 2 - containerHeight / 2;
                targetLeft = originWidth + margin;
                xMovement = transitionMovement;
            }
            else if (position === 'left') {
                targetTop += originHeight / 2 - containerHeight / 2;
                targetLeft = -containerWidth - margin;
                xMovement = -transitionMovement;
            }
            else {
                targetTop += originHeight + margin;
                if (align === 'center') {
                    targetLeft += originWidth / 2 - containerWidth / 2; // This is center align
                }
                yMovement = transitionMovement;
            }
            if (align === 'right') {
                targetLeft += originWidth - containerWidth - margin;
            }
            const newCoordinates = Utils._repositionWithinScreen(targetLeft, targetTop, containerWidth, containerHeight, margin, transitionMovement, align);
            container.style.top = newCoordinates.y + 'px';
            container.style.left = newCoordinates.x + 'px';
            return { x: xMovement, y: yMovement };
        }
        static _repositionWithinScreen(x, y, width, height, margin, transitionMovement, align) {
            const scrollLeft = Utils.getDocumentScrollLeft();
            const scrollTop = Utils.getDocumentScrollTop();
            let newX = x - scrollLeft;
            let newY = y - scrollTop;
            const bounding = {
                left: newX,
                top: newY,
                width: width,
                height: height
            };
            let offset;
            if (align === 'left' || align == 'center') {
                offset = margin + transitionMovement;
            }
            else if (align === 'right') {
                offset = margin - transitionMovement;
            }
            const edges = Utils.checkWithinContainer(document.body, bounding, offset);
            if (edges.left) {
                newX = offset;
            }
            else if (edges.right) {
                newX -= newX + width - window.innerWidth;
            }
            if (edges.top) {
                newY = offset;
            }
            else if (edges.bottom) {
                newY -= newY + height - window.innerHeight;
            }
            return {
                x: newX + scrollLeft,
                y: newY + scrollTop
            };
        }
    }

    /**
     * Base class implementation for Materialize components.
     */
    class Component {
        /**
         * The DOM element the plugin was initialized with.
         */
        el;
        /**
         * The options the instance was initialized with.
         */
        options;
        /**
         * Constructs component instance and set everything up.
         */
        constructor(el, options, classDef) {
            // Display error if el is not a valid HTML Element
            if (!(el instanceof HTMLElement)) {
                console.error(Error(el + ' is not an HTML Element'));
            }
            // If exists, destroy and reinitialize in child
            const ins = classDef.getInstance(el);
            if (!!ins) {
                ins.destroy();
            }
            this.el = el;
        }
        /**
         * Initializes component instances.
         * @param els HTML elements.
         * @param options Component options.
         * @param classDef Class definition.
         */
        static init(els, options, classDef) {
            let instances = null;
            if (els instanceof Element) {
                instances = new classDef(els, options);
            }
            else if (!!els && els.length) {
                instances = [];
                for (let i = 0; i < els.length; i++) {
                    instances.push(new classDef(els[i], options));
                }
            }
            return instances;
        }
        /**
         * @returns default options for component instance.
         */
        static get defaults() {
            return {};
        }
        /**
         * Retrieves component instance for the given element.
         * @param el Associated HTML Element.
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static getInstance(el) {
            throw new Error('This method must be implemented.');
        }
        /**
         * Destroy plugin instance and teardown.
         */
        destroy() {
            throw new Error('This method must be implemented.');
        }
    }

    const _defaults$n = {
        alignment: 'left',
        autoFocus: true,
        constrainWidth: true,
        container: null,
        coverTrigger: true,
        closeOnClick: true,
        hover: false,
        inDuration: 150,
        outDuration: 250,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        onItemClick: null
    };
    class Dropdown extends Component {
        static _dropdowns = [];
        /** ID of the dropdown element. */
        id;
        /** The DOM element of the dropdown. */
        dropdownEl;
        /** If the dropdown is open. */
        isOpen;
        /** If the dropdown content is scrollable. */
        isScrollable;
        isTouchMoving;
        /** The index of the item focused. */
        focusedIndex;
        filterQuery;
        filterTimeout;
        constructor(el, options) {
            super(el, options, Dropdown);
            this.el['M_Dropdown'] = this;
            Dropdown._dropdowns.push(this);
            this.id = Utils.getIdFromTrigger(el);
            this.dropdownEl = document.getElementById(this.id);
            this.options = {
                ...Dropdown.defaults,
                ...options
            };
            this.isOpen = false;
            this.isScrollable = false;
            this.isTouchMoving = false;
            this.focusedIndex = -1;
            this.filterQuery = [];
            this.el.ariaExpanded = 'false';
            // Move dropdown-content after dropdown-trigger
            this._moveDropdownToElement();
            this._makeDropdownFocusable();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$n;
        }
        /**
         * Initializes instances of Dropdown.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Dropdown);
        }
        static getInstance(el) {
            return el['M_Dropdown'];
        }
        destroy() {
            this._resetDropdownStyles();
            this._removeEventHandlers();
            Dropdown._dropdowns.splice(Dropdown._dropdowns.indexOf(this), 1);
            this.el['M_Dropdown'] = undefined;
        }
        _setupEventHandlers() {
            // Trigger keydown handler
            this.el.addEventListener('keydown', this._handleTriggerKeydown);
            // Item click handler
            this.dropdownEl?.addEventListener('click', this._handleDropdownClick);
            // Hover event handlers
            if (this.options.hover) {
                this.el.addEventListener('mouseenter', this._handleMouseEnter);
                this.el.addEventListener('mouseleave', this._handleMouseLeave);
                this.dropdownEl.addEventListener('mouseleave', this._handleMouseLeave);
                // Click event handlers
            }
            else {
                this.el.addEventListener('click', this._handleClick);
            }
        }
        _removeEventHandlers() {
            this.el.removeEventListener('keydown', this._handleTriggerKeydown);
            this.dropdownEl.removeEventListener('click', this._handleDropdownClick);
            if (this.options.hover) {
                this.el.removeEventListener('mouseenter', this._handleMouseEnter);
                this.el.removeEventListener('mouseleave', this._handleMouseLeave);
                this.dropdownEl.removeEventListener('mouseleave', this._handleMouseLeave);
            }
            else {
                this.el.removeEventListener('click', this._handleClick);
            }
        }
        _setupTemporaryEventHandlers() {
            document.body.addEventListener('click', this._handleDocumentClick);
            document.body.addEventListener('touchmove', this._handleDocumentTouchmove);
            this.dropdownEl.addEventListener('keydown', this._handleDropdownKeydown);
            window.addEventListener('resize', this._handleWindowResize);
        }
        _removeTemporaryEventHandlers() {
            document.body.removeEventListener('click', this._handleDocumentClick);
            document.body.removeEventListener('touchmove', this._handleDocumentTouchmove);
            this.dropdownEl.removeEventListener('keydown', this._handleDropdownKeydown);
            window.removeEventListener('resize', this._handleWindowResize);
        }
        _handleClick = (e) => {
            e.preventDefault();
            //this._moveDropdown((<HTMLElement>e.target).closest('li'));
            if (this.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        };
        _handleMouseEnter = () => {
            //this._moveDropdown((<HTMLElement>e.target).closest('li'));
            this.open();
        };
        _handleMouseLeave = (e) => {
            const toEl = e.relatedTarget;
            const leaveToDropdownContent = !!toEl.closest('.dropdown-content');
            let leaveToActiveDropdownTrigger = false;
            const closestTrigger = toEl.closest('.dropdown-trigger');
            if (closestTrigger && !!closestTrigger['M_Dropdown'] && closestTrigger['M_Dropdown'].isOpen) {
                leaveToActiveDropdownTrigger = true;
            }
            // Close hover dropdown if mouse did not leave to either active dropdown-trigger or dropdown-content
            if (!leaveToActiveDropdownTrigger && !leaveToDropdownContent) {
                this.close();
            }
        };
        _handleDocumentClick = (e) => {
            const target = e.target;
            if (this.options.closeOnClick && target.closest('.dropdown-content') && !this.isTouchMoving) {
                // isTouchMoving to check if scrolling on mobile.
                this.close();
            }
            else if (!target.closest('.dropdown-content')) {
                // Do this one frame later so that if the element clicked also triggers _handleClick
                // For example, if a label for a select was clicked, that we don't close/open the dropdown
                setTimeout(() => {
                    if (this.isOpen) {
                        this.close();
                    }
                }, 0);
            }
            this.isTouchMoving = false;
        };
        _handleTriggerKeydown = (e) => {
            // ARROW DOWN OR ENTER WHEN SELECT IS CLOSED - open Dropdown
            const arrowDownOrEnter = Utils.keys.ARROW_DOWN.includes(e.key) || Utils.keys.ENTER.includes(e.key);
            if (arrowDownOrEnter && !this.isOpen) {
                e.preventDefault();
                this.open();
            }
        };
        _handleDocumentTouchmove = (e) => {
            const target = e.target;
            if (target.closest('.dropdown-content')) {
                this.isTouchMoving = true;
            }
        };
        _handleDropdownClick = (e) => {
            // onItemClick callback
            if (typeof this.options.onItemClick === 'function') {
                const itemEl = e.target.closest('li');
                this.options.onItemClick.call(this, itemEl);
            }
        };
        _handleDropdownKeydown = (e) => {
            const arrowUpOrDown = Utils.keys.ARROW_DOWN.includes(e.key) || Utils.keys.ARROW_UP.includes(e.key);
            if (Utils.keys.TAB.includes(e.key)) {
                e.preventDefault();
                this.close();
            }
            // Navigate down dropdown list
            else if (arrowUpOrDown && this.isOpen) {
                e.preventDefault();
                const direction = Utils.keys.ARROW_DOWN.includes(e.key) ? 1 : -1;
                let newFocusedIndex = this.focusedIndex;
                let hasFoundNewIndex = false;
                do {
                    newFocusedIndex = newFocusedIndex + direction;
                    if (!!this.dropdownEl.children[newFocusedIndex] &&
                        this.dropdownEl.children[newFocusedIndex].tabIndex !== -1) {
                        hasFoundNewIndex = true;
                        break;
                    }
                } while (newFocusedIndex < this.dropdownEl.children.length && newFocusedIndex >= 0);
                if (hasFoundNewIndex) {
                    // Remove active class from old element
                    if (this.focusedIndex >= 0)
                        this.dropdownEl.children[this.focusedIndex].classList.remove('active');
                    this.focusedIndex = newFocusedIndex;
                    this._focusFocusedItem();
                }
            }
            // ENTER selects choice on focused item
            else if (Utils.keys.ENTER.includes(e.key) && this.isOpen) {
                // Search for <a> and <button>
                const focusedElement = this.dropdownEl.children[this.focusedIndex];
                const activatableElement = focusedElement?.querySelector('a, button');
                // Click a or button tag if exists, otherwise click li tag
                if (!!activatableElement) {
                    activatableElement.click();
                }
                else if (!!focusedElement) {
                    if (focusedElement instanceof HTMLElement) {
                        focusedElement.click();
                    }
                }
            }
            // Close dropdown on ESC
            else if (Utils.keys.ESC.includes(e.key) && this.isOpen) {
                e.preventDefault();
                this.close();
            }
            // CASE WHEN USER TYPE LTTERS
            const keyText = e.key.toLowerCase();
            const isLetter = /[a-zA-Z0-9-_]/.test(keyText);
            const specialKeys = [
                ...Utils.keys.ARROW_DOWN,
                ...Utils.keys.ARROW_UP,
                ...Utils.keys.ENTER,
                ...Utils.keys.ESC,
                ...Utils.keys.TAB
            ];
            if (isLetter && !specialKeys.includes(e.key)) {
                this.filterQuery.push(keyText);
                const string = this.filterQuery.join('');
                const newOptionEl = Array.from(this.dropdownEl.querySelectorAll('li')).find((el) => el.innerText.toLowerCase().indexOf(string) === 0);
                if (newOptionEl) {
                    this.focusedIndex = [...newOptionEl.parentNode.children].indexOf(newOptionEl);
                    this._focusFocusedItem();
                }
            }
            this.filterTimeout = setTimeout(this._resetFilterQuery, 1000);
        };
        _handleWindowResize = () => {
            // Only re-place the dropdown if it's still visible
            // Accounts for elements hiding via media queries
            if (this.el.offsetParent) {
                this.recalculateDimensions();
            }
        };
        _resetFilterQuery = () => {
            this.filterQuery = [];
        };
        _resetDropdownStyles() {
            this.dropdownEl.style.display = '';
            this._resetDropdownPositioningStyles();
            this.dropdownEl.style.transform = '';
            this.dropdownEl.style.opacity = '';
        }
        _resetDropdownPositioningStyles() {
            this.dropdownEl.style.width = '';
            this.dropdownEl.style.height = '';
            this.dropdownEl.style.left = '';
            this.dropdownEl.style.top = '';
            this.dropdownEl.style.transformOrigin = '';
        }
        _moveDropdownToElement(containerEl = null) {
            if (this.options.container) {
                this.options.container.append(this.dropdownEl);
                return;
            }
            if (containerEl) {
                if (!containerEl.contains(this.dropdownEl))
                    containerEl.append(this.dropdownEl);
                return;
            }
            this.el.after(this.dropdownEl);
        }
        _makeDropdownFocusable() {
            if (!this.dropdownEl)
                return;
            this.dropdownEl.popover = '';
            // Needed for arrow key navigation
            this.dropdownEl.tabIndex = 0;
            // Only set tabindex if it hasn't been set by user
            Array.from(this.dropdownEl.children).forEach((el) => {
                if (!el.getAttribute('tabindex'))
                    el.setAttribute('tabindex', '0');
            });
        }
        _focusFocusedItem() {
            if (this.focusedIndex >= 0 &&
                this.focusedIndex < this.dropdownEl.children.length &&
                this.options.autoFocus) {
                this.dropdownEl.children[this.focusedIndex].focus({
                    preventScroll: true
                });
                this.dropdownEl.children[this.focusedIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
        _getDropdownPosition(closestOverflowParent) {
            // const offsetParentBRect = this.el.offsetParent.getBoundingClientRect();
            const triggerBRect = this.el.getBoundingClientRect();
            const dropdownBRect = this.dropdownEl.getBoundingClientRect();
            let idealHeight = dropdownBRect.height;
            let idealWidth = dropdownBRect.width;
            let idealXPos = triggerBRect.left - dropdownBRect.left;
            let idealYPos = triggerBRect.top - dropdownBRect.top;
            const dropdownBounds = {
                left: idealXPos,
                top: idealYPos,
                height: idealHeight,
                width: idealWidth
            };
            const alignments = Utils.checkPossibleAlignments(this.el, closestOverflowParent, dropdownBounds, this.options.coverTrigger ? 0 : triggerBRect.height);
            let verticalAlignment = 'top';
            let horizontalAlignment = this.options.alignment;
            idealYPos += this.options.coverTrigger ? 0 : triggerBRect.height;
            // Reset isScrollable
            this.isScrollable = false;
            if (!alignments.top) {
                if (alignments.bottom) {
                    verticalAlignment = 'bottom';
                    if (!this.options.coverTrigger) {
                        idealYPos -= triggerBRect.height;
                    }
                }
                else {
                    this.isScrollable = true;
                    // Determine which side has most space and cutoff at correct height
                    idealHeight -= 20; // Add padding when cutoff
                    if (alignments.spaceOnTop > alignments.spaceOnBottom) {
                        verticalAlignment = 'bottom';
                        idealHeight += alignments.spaceOnTop;
                        idealYPos -= this.options.coverTrigger
                            ? alignments.spaceOnTop - 20
                            : alignments.spaceOnTop - 20 + triggerBRect.height;
                    }
                    else {
                        idealHeight += alignments.spaceOnBottom;
                    }
                }
            }
            // If preferred horizontal alignment is possible
            if (!alignments[horizontalAlignment]) {
                const oppositeAlignment = horizontalAlignment === 'left' ? 'right' : 'left';
                if (alignments[oppositeAlignment]) {
                    horizontalAlignment = oppositeAlignment;
                }
                else {
                    // Determine which side has most space and cutoff at correct height
                    if (alignments.spaceOnLeft > alignments.spaceOnRight) {
                        horizontalAlignment = 'right';
                        idealWidth += alignments.spaceOnLeft;
                        idealXPos -= alignments.spaceOnLeft;
                    }
                    else {
                        horizontalAlignment = 'left';
                        idealWidth += alignments.spaceOnRight;
                    }
                }
            }
            if (verticalAlignment === 'bottom') {
                idealYPos =
                    idealYPos - dropdownBRect.height + (this.options.coverTrigger ? triggerBRect.height : 0);
            }
            if (horizontalAlignment === 'right') {
                idealXPos = idealXPos - dropdownBRect.width + triggerBRect.width;
            }
            return {
                x: idealXPos,
                y: idealYPos,
                verticalAlignment: verticalAlignment,
                horizontalAlignment: horizontalAlignment,
                height: idealHeight,
                width: idealWidth
            };
        }
        _animateIn() {
            const duration = this.options.inDuration;
            this.dropdownEl.style.transition = 'none';
            // from
            this.dropdownEl.style.opacity = '0';
            this.dropdownEl.style.transform = 'scale(0.3, 0.3)';
            setTimeout(() => {
                // easeOutQuad (opacity) & easeOutQuint
                this.dropdownEl.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                // to
                this.dropdownEl.style.opacity = '1';
                this.dropdownEl.style.transform = 'scale(1, 1)';
            }, 1);
            setTimeout(() => {
                if (this.options.autoFocus)
                    this.dropdownEl.focus();
                if (typeof this.options.onOpenEnd === 'function')
                    this.options.onOpenEnd.call(this, this.el);
            }, duration);
        }
        _animateOut() {
            const duration = this.options.outDuration;
            // easeOutQuad (opacity) & easeOutQuint
            this.dropdownEl.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            // to
            this.dropdownEl.style.opacity = '0';
            this.dropdownEl.style.transform = 'scale(0.3, 0.3)';
            setTimeout(() => {
                this._resetDropdownStyles();
                if (typeof this.options.onCloseEnd === 'function')
                    this.options.onCloseEnd.call(this, this.el);
            }, duration);
        }
        _getClosestAncestor(el, condition) {
            let ancestor = el.parentNode;
            while (ancestor !== null && ancestor !== document) {
                if (condition(ancestor)) {
                    return ancestor;
                }
                ancestor = ancestor.parentElement;
            }
            return null;
        }
        _placeDropdown() {
            // Container here will be closest ancestor with overflow: hidden
            let closestOverflowParent = this._getClosestAncestor(this.dropdownEl, (ancestor) => {
                return (!['HTML', 'BODY'].includes(ancestor.tagName) &&
                    getComputedStyle(ancestor).overflow !== 'visible');
            });
            // Fallback
            if (!closestOverflowParent) {
                closestOverflowParent = ((!!this.dropdownEl.offsetParent ? this.dropdownEl.offsetParent : this.dropdownEl.parentNode));
            }
            if (getComputedStyle(closestOverflowParent).position === 'static')
                closestOverflowParent.style.position = 'relative';
            //this._moveDropdown(closestOverflowParent);
            // Set width before calculating positionInfo
            const idealWidth = this.options.constrainWidth
                ? this.el.getBoundingClientRect().width
                : this.dropdownEl.getBoundingClientRect().width;
            this.dropdownEl.style.width = idealWidth + 'px';
            const positionInfo = this._getDropdownPosition(closestOverflowParent);
            this.dropdownEl.style.left = positionInfo.x + 'px';
            this.dropdownEl.style.top = positionInfo.y + 'px';
            this.dropdownEl.style.height = positionInfo.height + 'px';
            this.dropdownEl.style.width = positionInfo.width + 'px';
            this.dropdownEl.style.transformOrigin = `${positionInfo.horizontalAlignment === 'left' ? '0' : '100%'} ${positionInfo.verticalAlignment === 'top' ? '0' : '100%'}`;
        }
        /**
         * Open dropdown.
         */
        open = () => {
            if (this.isOpen)
                return;
            this.isOpen = true;
            // onOpenStart callback
            if (typeof this.options.onOpenStart === 'function') {
                this.options.onOpenStart.call(this, this.el);
            }
            // Reset styles
            this._resetDropdownStyles();
            this.dropdownEl.style.display = 'block';
            this._placeDropdown();
            this._animateIn();
            // Do this one frame later so that we don't bind an event handler that's immediately
            // called when the event bubbles up to the document and closes the dropdown
            setTimeout(() => this._setupTemporaryEventHandlers(), 0);
            this.el.ariaExpanded = 'true';
        };
        /**
         * Close dropdown.
         */
        close = () => {
            if (!this.isOpen)
                return;
            this.isOpen = false;
            this.focusedIndex = -1;
            // onCloseStart callback
            if (typeof this.options.onCloseStart === 'function') {
                this.options.onCloseStart.call(this, this.el);
            }
            this._animateOut();
            this._removeTemporaryEventHandlers();
            if (this.options.autoFocus) {
                this.el.focus();
            }
            this.el.ariaExpanded = 'false';
        };
        /**
         * While dropdown is open, you can recalculate its dimensions if its contents have changed.
         */
        recalculateDimensions = () => {
            if (this.isOpen) {
                this._resetDropdownPositioningStyles();
                this._placeDropdown();
            }
        };
    }

    const _defaults$m = {
        data: [], // Autocomplete data set
        onAutocomplete: null, // Callback for when autocompleted
        dropdownOptions: {
            // Default dropdown options
            autoFocus: false,
            closeOnClick: false,
            coverTrigger: false
        },
        minLength: 1, // Min characters before autocomplete starts
        isMultiSelect: false,
        onSearch: (text, autocomplete) => {
            const normSearch = text.toLocaleLowerCase();
            autocomplete.setMenuItems(autocomplete.options.data.filter((option) => option.id.toString().toLocaleLowerCase().includes(normSearch)
                || option.text?.toLocaleLowerCase().includes(normSearch)));
        },
        maxDropDownHeight: '300px',
        allowUnsafeHTML: false,
        selected: []
    };
    class Autocomplete extends Component {
        /** If the autocomplete is open. */
        isOpen;
        /** Number of matching autocomplete options. */
        count;
        /** Index of the current selected option. */
        activeIndex;
        oldVal;
        $active;
        _mousedown;
        container;
        /** Instance of the dropdown plugin for this autocomplete. */
        dropdown;
        static _keydown;
        selectedValues;
        menuItems;
        constructor(el, options) {
            super(el, options, Autocomplete);
            this.el['M_Autocomplete'] = this;
            this.options = {
                ...Autocomplete.defaults,
                ...options
            };
            this.isOpen = false;
            this.count = 0;
            this.activeIndex = -1;
            this.oldVal = '';
            this.selectedValues = this.selectedValues || this.options.selected.map((value) => ({ id: value })) || [];
            this.menuItems = this.options.data || [];
            this.$active = null;
            this._mousedown = false;
            this._setupDropdown();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$m;
        }
        /**
         * Initializes instances of Autocomplete.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Autocomplete);
        }
        static getInstance(el) {
            return el['M_Autocomplete'];
        }
        destroy() {
            this._removeEventHandlers();
            this._removeDropdown();
            this.el['M_Autocomplete'] = undefined;
        }
        _setupEventHandlers() {
            this.el.addEventListener('blur', this._handleInputBlur);
            this.el.addEventListener('keyup', this._handleInputKeyup);
            this.el.addEventListener('focus', this._handleInputFocus);
            this.el.addEventListener('keydown', this._handleInputKeydown);
            this.el.addEventListener('click', this._handleInputClick);
            this.container.addEventListener('mousedown', this._handleContainerMousedownAndTouchstart);
            this.container.addEventListener('mouseup', this._handleContainerMouseupAndTouchend);
            if (typeof window.ontouchstart !== 'undefined') {
                this.container.addEventListener('touchstart', this._handleContainerMousedownAndTouchstart);
                this.container.addEventListener('touchend', this._handleContainerMouseupAndTouchend);
            }
        }
        _removeEventHandlers() {
            this.el.removeEventListener('blur', this._handleInputBlur);
            this.el.removeEventListener('keyup', this._handleInputKeyup);
            this.el.removeEventListener('focus', this._handleInputFocus);
            this.el.removeEventListener('keydown', this._handleInputKeydown);
            this.el.removeEventListener('click', this._handleInputClick);
            this.container.removeEventListener('mousedown', this._handleContainerMousedownAndTouchstart);
            this.container.removeEventListener('mouseup', this._handleContainerMouseupAndTouchend);
            if (typeof window.ontouchstart !== 'undefined') {
                this.container.removeEventListener('touchstart', this._handleContainerMousedownAndTouchstart);
                this.container.removeEventListener('touchend', this._handleContainerMouseupAndTouchend);
            }
        }
        _setupDropdown() {
            this.container = document.createElement('ul');
            this.container.style.maxHeight = this.options.maxDropDownHeight;
            this.container.id = `autocomplete-options-${Utils.guid()}`;
            this.container.classList.add('autocomplete-content', 'dropdown-content');
            this.container.ariaExpanded = 'true';
            this.el.setAttribute('data-target', this.container.id);
            this.menuItems.forEach((menuItem) => {
                const itemElement = this._createDropdownItem(menuItem);
                this.container.append(itemElement);
            });
            // ! Issue in Component Dropdown: _placeDropdown moves dom-position
            this.el.parentElement.appendChild(this.container);
            // Initialize dropdown
            const dropdownOptions = {
                ...Autocomplete.defaults.dropdownOptions,
                ...this.options.dropdownOptions
            };
            // @todo shouldn't we conditionally check if dropdownOptions.onItemClick is set in first place?
            const userOnItemClick = dropdownOptions.onItemClick;
            // Ensuring the select Option call when user passes custom onItemClick function to dropdown
            dropdownOptions.onItemClick = (li) => {
                if (!li)
                    return;
                const entryID = li.getAttribute('data-id');
                this.selectOption(entryID);
                // Handle user declared onItemClick if needed
                if (userOnItemClick && typeof userOnItemClick === 'function')
                    userOnItemClick.call(this.dropdown, this.el);
            };
            this.dropdown = Dropdown.init(this.el, dropdownOptions);
            // ! Workaround for Label: move label up again
            // TODO: Just use PopperJS in future!
            const label = this.el.parentElement.querySelector('label');
            if (label)
                this.el.after(label);
            // Sketchy removal of dropdown click handler
            this.el.removeEventListener('click', this.dropdown._handleClick);
            if (!this.options.isMultiSelect && !(this.options.selected.length === 0)) {
                const selectedValue = this.menuItems.filter((value) => value.id === this.selectedValues[0].id);
                this.el.value = selectedValue[0].text;
            }
            // Set Value if already set in HTML
            if (this.el.value)
                this.selectOption(this.el.value);
            // Add StatusInfo
            const div = document.createElement('div');
            div.classList.add('status-info');
            div.setAttribute('style', 'position: absolute;right:0;top:0;');
            this.el.parentElement.appendChild(div);
            this._updateSelectedInfo();
        }
        _removeDropdown() {
            this.container.ariaExpanded = 'false';
            this.container.parentNode.removeChild(this.container);
        }
        _handleInputBlur = () => {
            if (!this._mousedown) {
                this.close();
                this._resetAutocomplete();
            }
        };
        _handleInputKeyup = (e) => {
            if (e.type === 'keyup')
                Autocomplete._keydown = false;
            this.count = 0;
            const actualValue = this.el.value.toLocaleLowerCase();
            // Don't capture enter or arrow key usage.
            if (Utils.keys.ENTER.includes(e.key) ||
                Utils.keys.ARROW_UP.includes(e.key) ||
                Utils.keys.ARROW_DOWN.includes(e.key))
                return;
            // Check if the input isn't empty
            // Check if focus triggered by tab
            if (this.oldVal !== actualValue && Utils.tabPressed) {
                this.open();
            }
            this._inputChangeDetection(actualValue);
        };
        _handleInputFocus = () => {
            this.count = 0;
            const actualValue = this.el.value.toLocaleLowerCase();
            this._inputChangeDetection(actualValue);
        };
        _inputChangeDetection = (value) => {
            // Value has changed!
            if (this.oldVal !== value) {
                this._setStatusLoading();
                this.options.onSearch(this.el.value, this);
            }
            // Reset Single-Select when Input cleared
            if (!this.options.isMultiSelect && this.el.value.length === 0) {
                this.selectedValues = [];
                this._triggerChanged();
            }
            this.oldVal = value;
        };
        _handleInputKeydown = (e) => {
            Autocomplete._keydown = true;
            // Arrow keys and enter key usage
            const numItems = this.container.querySelectorAll('li').length;
            // select element on Enter
            if (Utils.keys.ENTER.includes(e.key) && this.activeIndex >= 0) {
                const liElement = this.container.querySelectorAll('li')[this.activeIndex];
                if (liElement) {
                    this.selectOption(liElement.getAttribute('data-id'));
                    e.preventDefault();
                }
                return;
            }
            // Capture up and down key
            if (Utils.keys.ARROW_UP.includes(e.key) || Utils.keys.ARROW_DOWN.includes(e.key)) {
                e.preventDefault();
                if (Utils.keys.ARROW_UP.includes(e.key) && this.activeIndex > 0)
                    this.activeIndex--;
                if (Utils.keys.ARROW_DOWN.includes(e.key) && this.activeIndex < numItems - 1)
                    this.activeIndex++;
                this.$active?.classList.remove('active');
                if (this.activeIndex >= 0) {
                    this.$active = this.container.querySelectorAll('li')[this.activeIndex];
                    this.$active?.classList.add('active');
                    // Focus selected
                    this.container.children[this.activeIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            }
        };
        _handleInputClick = () => {
            this.open();
        };
        _handleContainerMousedownAndTouchstart = () => {
            this._mousedown = true;
        };
        _handleContainerMouseupAndTouchend = () => {
            this._mousedown = false;
        };
        _resetCurrentElementPosition() {
            this.activeIndex = -1;
            this.$active?.classList.remove('active');
        }
        _resetAutocomplete() {
            this.container.replaceChildren();
            this._resetCurrentElementPosition();
            this.oldVal = null;
            this.isOpen = false;
            this._mousedown = false;
        }
        _highlightPartialText(input, label) {
            const start = label.toLocaleLowerCase().indexOf('' + input.toLocaleLowerCase() + '');
            const end = start + input.length - 1;
            //custom filters may return results where the string does not match any part
            if (start == -1 || end == -1) {
                return [label, '', ''];
            }
            return [label.slice(0, start), label.slice(start, end + 1), label.slice(end + 1)];
        }
        _createDropdownItem(entry) {
            const item = document.createElement('li');
            item.setAttribute('data-id', entry.id);
            item.setAttribute('style', 'display:grid; grid-auto-flow: column; user-select: none; align-items: center;');
            item.tabIndex = 0;
            // Checkbox
            if (this.options.isMultiSelect) {
                item.innerHTML = `
        <div class="item-selection" style="text-align:center;">
        <input type="checkbox"${this.selectedValues.some((sel) => sel.id === entry.id) ? ' checked="checked"' : ''}><span style="padding-left:21px;"></span>
      </div>`;
            }
            // Image
            if (entry.image) {
                const img = document.createElement('img');
                img.classList.add('circle');
                img.src = entry.image;
                item.appendChild(img);
            }
            // Text
            const inputText = this.el.value.toLocaleLowerCase();
            const parts = this._highlightPartialText(inputText, (entry.text || entry.id).toString());
            const div = document.createElement('div');
            div.setAttribute('style', 'line-height:1.2;font-weight:500;');
            if (this.options.allowUnsafeHTML) {
                div.innerHTML = parts[0] + '<span class="highlight">' + parts[1] + '</span>' + parts[2];
            }
            else {
                div.appendChild(document.createTextNode(parts[0]));
                if (parts[1]) {
                    const highlight = document.createElement('span');
                    highlight.textContent = parts[1];
                    highlight.classList.add('highlight');
                    div.appendChild(highlight);
                    div.appendChild(document.createTextNode(parts[2]));
                }
            }
            const itemText = document.createElement('div');
            itemText.classList.add('item-text');
            itemText.setAttribute('style', 'padding:5px;overflow:hidden;');
            item.appendChild(itemText);
            item.querySelector('.item-text').appendChild(div);
            // Description
            if (typeof entry.description === 'string' ||
                (typeof entry.description === 'number' && !isNaN(entry.description))) {
                const description = document.createElement('small');
                description.setAttribute('style', 'line-height:1.3;color:grey;white-space:nowrap;text-overflow:ellipsis;display:block;width:90%;overflow:hidden;');
                description.innerText = entry.description;
                item.querySelector('.item-text').appendChild(description);
            }
            // Set Grid
            const getGridConfig = () => {
                if (this.options.isMultiSelect) {
                    if (entry.image)
                        return '40px min-content auto'; // cb-img-txt
                    return '40px auto'; // cb-txt
                }
                if (entry.image)
                    return 'min-content auto'; // img-txt
                return 'auto'; // txt
            };
            item.style.gridTemplateColumns = getGridConfig();
            return item;
        }
        _renderDropdown() {
            this._resetAutocomplete();
            // Check if Data is empty
            if (this.menuItems.length === 0) {
                this.menuItems = this.selectedValues; // Show selected Items
            }
            for (let i = 0; i < this.menuItems.length; i++) {
                const item = this._createDropdownItem(this.menuItems[i]);
                this.container.append(item);
            }
        }
        _setStatusLoading() {
            this.el.parentElement.querySelector('.status-info').innerHTML =
                `<div style="height:100%;width:50px;"><svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
    <circle fill="#888c" stroke="none" cx="6" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/></circle>
    <circle fill="#888c" stroke="none" cx="26" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/></circle>
    <circle fill="#888c" stroke="none" cx="46" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite"  begin="0.3"/></circle>
  </svg></div>`;
        }
        _updateSelectedInfo() {
            const statusElement = this.el.parentElement.querySelector('.status-info');
            if (statusElement) {
                if (this.options.isMultiSelect)
                    statusElement.innerHTML = this.selectedValues.length.toString();
                else
                    statusElement.innerHTML = '';
            }
        }
        _refreshInputText() {
            if (this.selectedValues.length === 1) {
                const entry = this.selectedValues[0];
                this.el.value = entry.text || entry.id; // Write Text to Input
            }
        }
        _triggerChanged() {
            this.el.dispatchEvent(new Event('change'));
            // Trigger Autocomplete Event
            if (typeof this.options.onAutocomplete === 'function')
                this.options.onAutocomplete.call(this, this.selectedValues);
        }
        /**
         * Show autocomplete.
         */
        open = () => {
            const inputText = this.el.value.toLocaleLowerCase();
            this._resetAutocomplete();
            if (inputText.length >= this.options.minLength) {
                this.isOpen = true;
                this._renderDropdown();
            }
            // Open dropdown
            if (!this.dropdown.isOpen) {
                setTimeout(() => {
                    this.dropdown.open();
                }, 0); // TODO: why?
            }
            else
                this.dropdown.recalculateDimensions(); // Recalculate dropdown when its already open
        };
        /**
         * Hide autocomplete.
         */
        close = () => {
            this.dropdown.close();
        };
        /**
         * Updates the visible or selectable items shown in the menu.
         * @param menuItems Items to be available.
         * @param selected Selected item ids
         * @param open Option to conditionally open dropdown
         */
        setMenuItems(menuItems, selected = null, open = true) {
            this.menuItems = menuItems;
            this.options.data = menuItems;
            if (selected) {
                this.selectedValues = this.menuItems.filter((item) => !(selected.indexOf(item.id) === -1));
            }
            if (this.options.isMultiSelect) {
                this._renderDropdown();
            }
            else {
                this._refreshInputText();
            }
            if (open)
                this.open();
            this._updateSelectedInfo();
            this._triggerChanged();
        }
        /**
         * Sets selected values.
         * @deprecated @see https://github.com/materializecss/materialize/issues/552
         * @param entries
         */
        setValues(entries) {
            this.selectedValues = entries;
            this._updateSelectedInfo();
            if (!this.options.isMultiSelect) {
                this._refreshInputText();
            }
            this._triggerChanged();
        }
        /**
         * Select a specific autocomplete option via id-property.
         * @param id The id of a data-entry.
         */
        selectOption(id) {
            const entry = this.menuItems.find((item) => item.id == id);
            if (!entry)
                return;
            // Toggle Checkbox
            /* const li = this.container.querySelector('li[data-id="' + id + '"]');
            if (!li) return;*/
            if (this.options.isMultiSelect) {
                /* const checkbox = <HTMLInputElement | null>li.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;*/
                if (!(this.selectedValues.filter((selectedEntry) => selectedEntry.id === entry.id).length >= 1))
                    this.selectedValues.push(entry);
                else
                    this.selectedValues = this.selectedValues.filter((selectedEntry) => selectedEntry.id !== entry.id);
                this._renderDropdown();
                this.el.focus();
            }
            else {
                // Single-Select
                this.selectedValues = [entry];
                this._refreshInputText();
                this._resetAutocomplete();
                this.close();
            }
            this._updateSelectedInfo();
            this._triggerChanged();
        }
        selectOptions(ids) {
            const entries = this.menuItems.filter((item) => !(ids.indexOf(item.id) === -1));
            if (!entries)
                return;
            this.selectedValues = entries;
            this._renderDropdown();
        }
    }

    const _defaults$l = {
        direction: 'top',
        hoverEnabled: true,
        toolbarEnabled: false
    };
    class FloatingActionButton extends Component {
        /**
         * Describes open/close state of FAB.
         */
        isOpen;
        _anchor;
        _menu;
        _floatingBtns;
        _floatingBtnsReverse;
        offsetY;
        offsetX;
        btnBottom;
        btnLeft;
        btnWidth;
        constructor(el, options) {
            super(el, options, FloatingActionButton);
            this.el['M_FloatingActionButton'] = this;
            this.options = {
                ...FloatingActionButton.defaults,
                ...options
            };
            this.isOpen = false;
            this._anchor = this.el.querySelector('a');
            this._menu = this.el.querySelector('ul');
            this._floatingBtns = Array.from(this.el.querySelectorAll('ul .btn-floating'));
            this._floatingBtnsReverse = this._floatingBtns.reverse();
            this.offsetY = 0;
            this.offsetX = 0;
            this.el.classList.add(`direction-${this.options.direction}`);
            this._anchor.tabIndex = 0;
            this._menu.ariaExpanded = 'false';
            if (this.options.direction === 'top')
                this.offsetY = 40;
            else if (this.options.direction === 'right')
                this.offsetX = -40;
            else if (this.options.direction === 'bottom')
                this.offsetY = -40;
            else
                this.offsetX = 40;
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$l;
        }
        /**
         * Initializes instances of FloatingActionButton.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, FloatingActionButton);
        }
        static getInstance(el) {
            return el['M_FloatingActionButton'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['M_FloatingActionButton'] = undefined;
        }
        _setupEventHandlers() {
            if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
                this.el.addEventListener('mouseenter', this.open);
                this.el.addEventListener('mouseleave', this.close);
            }
            else {
                this.el.addEventListener('click', this._handleFABClick);
            }
            this.el.addEventListener('keypress', this._handleFABKeyPress);
        }
        _removeEventHandlers() {
            if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
                this.el.removeEventListener('mouseenter', this.open);
                this.el.removeEventListener('mouseleave', this.close);
            }
            else {
                this.el.removeEventListener('click', this._handleFABClick);
            }
            this.el.removeEventListener('keypress', this._handleFABKeyPress);
        }
        _handleFABClick = () => {
            this._handleFABToggle();
        };
        _handleFABKeyPress = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleFABToggle();
            }
        };
        _handleFABToggle = () => {
            if (this.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        };
        _handleDocumentClick = (e) => {
            const elem = e.target;
            if (elem !== this._menu)
                this.close();
        };
        /**
         * Open FAB.
         */
        open = () => {
            if (this.isOpen)
                return;
            if (this.options.toolbarEnabled)
                this._animateInToolbar();
            else
                this._animateInFAB();
            this.isOpen = true;
        };
        /**
         * Close FAB.
         */
        close = () => {
            if (!this.isOpen)
                return;
            if (this.options.toolbarEnabled) {
                window.removeEventListener('scroll', this.close, true);
                document.body.removeEventListener('click', this._handleDocumentClick, true);
            }
            else {
                this._animateOutFAB();
            }
            this.isOpen = false;
        };
        _animateInFAB() {
            this.el.classList.add('active');
            this._menu.ariaExpanded = 'true';
            const delayIncrement = 40;
            const duration = 275;
            this._floatingBtnsReverse.forEach((el, index) => {
                const delay = delayIncrement * index;
                el.style.transition = 'none';
                el.style.opacity = '0';
                el.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(0.4)`;
                setTimeout(() => {
                    // from:
                    el.style.opacity = '0.4';
                    // easeInOutQuad
                    setTimeout(() => {
                        // to:
                        el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                        el.style.opacity = '1';
                        el.style.transform = 'translate(0, 0) scale(1)';
                        el.tabIndex = 0;
                    }, 1);
                }, delay);
            });
        }
        _animateOutFAB() {
            const duration = 175;
            setTimeout(() => {
                this.el.classList.remove('active');
                this._menu.ariaExpanded = 'false';
            }, duration);
            this._floatingBtnsReverse.forEach((el) => {
                el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                // to
                el.style.opacity = '0';
                el.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(0.4)`;
                el.tabIndex = -1;
            });
        }
        _animateInToolbar() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const btnRect = this.el.getBoundingClientRect();
            const backdrop = document.createElement('div'), scaleFactor = windowWidth / backdrop[0].clientWidth, fabColor = getComputedStyle(this._anchor).backgroundColor; // css('background-color');
            backdrop.classList.add('fab-backdrop'); //  $('<div class="fab-backdrop"></div>');
            backdrop.style.backgroundColor = fabColor;
            this._anchor.append(backdrop);
            this.offsetX = btnRect.left - windowWidth / 2 + btnRect.width / 2;
            this.offsetY = windowHeight - btnRect.bottom;
            this.btnBottom = btnRect.bottom;
            this.btnLeft = btnRect.left;
            this.btnWidth = btnRect.width;
            // Set initial state
            this.el.classList.add('active');
            this.el.style.textAlign = 'center';
            this.el.style.width = '100%';
            this.el.style.bottom = '0';
            this.el.style.left = '0';
            this.el.style.transform = 'translateX(' + this.offsetX + 'px)';
            this.el.style.transition = 'none';
            this._menu.ariaExpanded = 'true';
            this._anchor.style.transform = `translateY(${this.offsetY}px`;
            this._anchor.style.transition = 'none';
            setTimeout(() => {
                this.el.style.transform = '';
                this.el.style.transition =
                    'transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s';
                this._anchor.style.overflow = 'visible';
                this._anchor.style.transform = '';
                this._anchor.style.transition = 'transform .2s';
                setTimeout(() => {
                    this.el.style.overflow = 'hidden';
                    this.el.style.backgroundColor = fabColor;
                    backdrop.style.transform = 'scale(' + scaleFactor + ')';
                    backdrop.style.transition = 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)';
                    this._menu.querySelectorAll('li > a').forEach((a) => {
                        a.style.opacity = '1';
                        a.tabIndex = 0;
                    });
                    // Scroll to close.
                    window.addEventListener('scroll', this.close, true);
                    document.body.addEventListener('click', this._handleDocumentClick, true);
                }, 100);
            }, 0);
        }
    }

    const _defaults$k = {
        onOpen: null,
        onClose: null,
        inDuration: 225,
        outDuration: 300
    };
    class Cards extends Component {
        isOpen = false;
        cardReveal;
        initialOverflow;
        _activators;
        cardRevealClose;
        constructor(el, options) {
            super(el, options, Cards);
            this.el['M_Cards'] = this;
            this.options = {
                ...Cards.defaults,
                ...options
            };
            this._activators = [];
            this.cardReveal = this.el.querySelector('.card-reveal');
            if (this.cardReveal) {
                this.initialOverflow = getComputedStyle(this.el).overflow;
                this._activators = Array.from(this.el.querySelectorAll('.activator'));
                this._activators.forEach((el) => {
                    if (el)
                        el.tabIndex = 0;
                });
                this.cardRevealClose = this.cardReveal?.querySelector('.card-title');
                if (this.cardRevealClose)
                    this.cardRevealClose.tabIndex = -1;
                this.cardReveal.ariaExpanded = 'false';
                this._setupEventHandlers();
            }
        }
        static get defaults() {
            return _defaults$k;
        }
        /**
         * Initializes instances of Cards.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options) {
            return super.init(els, options, Cards);
        }
        static getInstance(el) {
            return el['M_Cards'];
        }
        /**
         * {@inheritDoc}
         */
        destroy() {
            this._removeEventHandlers();
            this._activators = [];
        }
        _setupEventHandlers = () => {
            this._activators.forEach((el) => {
                el.addEventListener('click', this._handleClickInteraction);
                el.addEventListener('keypress', this._handleKeypressEvent);
            });
        };
        _removeEventHandlers = () => {
            this._activators.forEach((el) => {
                el.removeEventListener('click', this._handleClickInteraction);
                el.removeEventListener('keypress', this._handleKeypressEvent);
            });
        };
        _handleClickInteraction = () => {
            this._handleRevealEvent();
        };
        _handleKeypressEvent = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleRevealEvent();
            }
        };
        _handleRevealEvent = () => {
            // Reveal Card
            this._activators.forEach((el) => (el.tabIndex = -1));
            this.open();
        };
        _setupRevealCloseEventHandlers = () => {
            this.cardRevealClose.addEventListener('click', this.close);
            this.cardRevealClose.addEventListener('keypress', this._handleKeypressCloseEvent);
        };
        _removeRevealCloseEventHandlers = () => {
            this.cardRevealClose.addEventListener('click', this.close);
            this.cardRevealClose.addEventListener('keypress', this._handleKeypressCloseEvent);
        };
        _handleKeypressCloseEvent = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this.close();
            }
        };
        /**
         * Show card reveal.
         */
        open = () => {
            if (this.isOpen)
                return;
            this.isOpen = true;
            this.el.style.overflow = 'hidden';
            this.cardReveal.style.display = 'block';
            this.cardReveal.ariaExpanded = 'true';
            this.cardRevealClose.tabIndex = 0;
            setTimeout(() => {
                this.cardReveal.style.transition = `transform ${this.options.outDuration}ms ease`; //easeInOutQuad
                this.cardReveal.style.transform = 'translateY(-100%)';
            }, 1);
            if (typeof this.options.onOpen === 'function') {
                this.options.onOpen.call(this);
            }
            this._setupRevealCloseEventHandlers();
        };
        /**
         * Hide card reveal.
         */
        close = () => {
            if (!this.isOpen)
                return;
            this.isOpen = false;
            this.cardReveal.style.transition = `transform ${this.options.inDuration}ms ease`; //easeInOutQuad
            this.cardReveal.style.transform = 'translateY(0)';
            setTimeout(() => {
                this.cardReveal.style.display = 'none';
                this.cardReveal.ariaExpanded = 'false';
                this._activators.forEach((el) => (el.tabIndex = 0));
                this.cardRevealClose.tabIndex = -1;
                this.el.style.overflow = this.initialOverflow;
            }, this.options.inDuration);
            if (typeof this.options.onClose === 'function') {
                this.options.onClose.call(this);
            }
            this._removeRevealCloseEventHandlers();
        };
        static Init() {
            if (typeof document !== 'undefined')
                // Handle initialization of static cards.
                document.addEventListener('DOMContentLoaded', () => {
                    const cards = document.querySelectorAll('.card');
                    cards.forEach((el) => {
                        if (el && (el['M_Card'] == undefined))
                            this.init(el);
                    });
                });
        }
    }

    const _defaults$j = {
        duration: 200, // ms
        dist: -100, // zoom scale TODO: make this more intuitive as an option
        shift: 0, // spacing for center image
        padding: 0, // Padding between non center items
        numVisible: 5, // Number of visible items in carousel
        fullWidth: false, // Change to full width styles
        indicators: false, // Toggle indicators
        noWrap: false, // Don't wrap around and cycle through items.
        onCycleTo: null // Callback for when a new slide is cycled to.
    };
    class Carousel extends Component {
        hasMultipleSlides;
        showIndicators;
        noWrap;
        /** If the carousel is being clicked or tapped. */
        pressed;
        /** If the carousel is currently being dragged. */
        dragged;
        offset;
        target;
        images;
        itemWidth;
        itemHeight;
        dim;
        _indicators;
        count;
        xform;
        verticalDragged;
        reference;
        referenceY;
        velocity;
        frame;
        timestamp;
        ticker;
        amplitude;
        /** The index of the center carousel item. */
        center = 0;
        imageHeight;
        scrollingTimeout;
        oneTimeCallback;
        constructor(el, options) {
            super(el, options, Carousel);
            this.el['M_Carousel'] = this;
            this.options = {
                ...Carousel.defaults,
                ...options
            };
            // Setup
            this.hasMultipleSlides = this.el.querySelectorAll('.carousel-item').length > 1;
            this.showIndicators = this.options.indicators && this.hasMultipleSlides;
            this.noWrap = this.options.noWrap || !this.hasMultipleSlides;
            this.pressed = false;
            this.dragged = false;
            this.offset = this.target = 0;
            this.images = [];
            this.itemWidth = this.el.querySelector('.carousel-item').clientWidth;
            this.itemHeight = this.el.querySelector('.carousel-item').clientHeight;
            this.dim = this.itemWidth * 2 + this.options.padding || 1; // Make sure dim is non zero for divisions.
            // Full Width carousel setup
            if (this.options.fullWidth) {
                this.options.dist = 0;
                this._setCarouselHeight();
                // Offset fixed items when indicators.
                if (this.showIndicators) {
                    this.el.querySelector('.carousel-fixed-item')?.classList.add('with-indicators');
                }
            }
            // Iterate through slides
            this._indicators = document.createElement('ul');
            this._indicators.classList.add('indicators');
            this.el.querySelectorAll('.carousel-item').forEach((item, i) => {
                this.images.push(item);
                if (this.showIndicators) {
                    const indicator = document.createElement('li');
                    indicator.classList.add('indicator-item');
                    indicator.tabIndex = 0;
                    if (i === 0) {
                        indicator.classList.add('active');
                    }
                    this._indicators.appendChild(indicator);
                }
            });
            if (this.showIndicators)
                this.el.appendChild(this._indicators);
            this.count = this.images.length;
            // Cap numVisible at count
            this.options.numVisible = Math.min(this.count, this.options.numVisible);
            // Setup cross browser string
            this.xform = 'transform';
            ['webkit', 'Moz', 'O', 'ms'].every((prefix) => {
                const e = prefix + 'Transform';
                if (typeof document.body.style[e] !== 'undefined') {
                    this.xform = e;
                    return false;
                }
                return true;
            });
            this._setupEventHandlers();
            this._scroll(this.offset);
        }
        static get defaults() {
            return _defaults$j;
        }
        /**
         * Initializes instances of Carousel.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Carousel);
        }
        static getInstance(el) {
            return el['M_Carousel'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['M_Carousel'] = undefined;
        }
        _setupEventHandlers() {
            if (typeof window.ontouchstart !== 'undefined') {
                this.el.addEventListener('touchstart', this._handleCarouselTap);
                this.el.addEventListener('touchmove', this._handleCarouselDrag);
                this.el.addEventListener('touchend', this._handleCarouselRelease);
            }
            this.el.addEventListener('mousedown', this._handleCarouselTap);
            this.el.addEventListener('mousemove', this._handleCarouselDrag);
            this.el.addEventListener('mouseup', this._handleCarouselRelease);
            this.el.addEventListener('mouseleave', this._handleCarouselRelease);
            this.el.addEventListener('click', this._handleCarouselClick);
            if (this.showIndicators && this._indicators) {
                this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
                    el.addEventListener('click', this._handleIndicatorClick);
                    el.addEventListener('keypress', this._handleIndicatorKeyPress);
                });
            }
            // Resize
            window.addEventListener('resize', this._handleThrottledResize);
        }
        _removeEventHandlers() {
            if (typeof window.ontouchstart !== 'undefined') {
                this.el.removeEventListener('touchstart', this._handleCarouselTap);
                this.el.removeEventListener('touchmove', this._handleCarouselDrag);
                this.el.removeEventListener('touchend', this._handleCarouselRelease);
            }
            this.el.removeEventListener('mousedown', this._handleCarouselTap);
            this.el.removeEventListener('mousemove', this._handleCarouselDrag);
            this.el.removeEventListener('mouseup', this._handleCarouselRelease);
            this.el.removeEventListener('mouseleave', this._handleCarouselRelease);
            this.el.removeEventListener('click', this._handleCarouselClick);
            if (this.showIndicators && this._indicators) {
                this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
                    el.removeEventListener('click', this._handleIndicatorClick);
                });
            }
            window.removeEventListener('resize', this._handleThrottledResize);
        }
        _handleThrottledResize = () => Utils.throttle(this._handleResize, 200, null).bind(this);
        _handleCarouselTap = (e) => {
            // Fixes firefox draggable image bug
            if (e.type === 'mousedown' && e.target.tagName === 'IMG') {
                e.preventDefault();
            }
            this.pressed = true;
            this.dragged = false;
            this.verticalDragged = false;
            this.reference = this._xpos(e);
            this.referenceY = this._ypos(e);
            this.velocity = this.amplitude = 0;
            this.frame = this.offset;
            this.timestamp = Date.now();
            clearInterval(this.ticker);
            this.ticker = setInterval(this._track, 100);
        };
        _handleCarouselDrag = (e) => {
            let x, y, delta, deltaY;
            if (this.pressed) {
                x = this._xpos(e);
                y = this._ypos(e);
                delta = this.reference - x;
                deltaY = Math.abs(this.referenceY - y);
                if (deltaY < 30 && !this.verticalDragged) {
                    // If vertical scrolling don't allow dragging.
                    if (delta > 2 || delta < -2) {
                        this.dragged = true;
                        this.reference = x;
                        this._scroll(this.offset + delta);
                    }
                }
                else if (this.dragged) {
                    // If dragging don't allow vertical scroll.
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                else {
                    // Vertical scrolling.
                    this.verticalDragged = true;
                }
            }
            if (this.dragged) {
                // If dragging don't allow vertical scroll.
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
        _handleCarouselRelease = (e) => {
            if (this.pressed) {
                this.pressed = false;
            }
            else {
                return;
            }
            clearInterval(this.ticker);
            this.target = this.offset;
            if (this.velocity > 10 || this.velocity < -10) {
                this.amplitude = 0.9 * this.velocity;
                this.target = this.offset + this.amplitude;
            }
            this.target = Math.round(this.target / this.dim) * this.dim;
            // No wrap of items.
            if (this.noWrap) {
                if (this.target >= this.dim * (this.count - 1)) {
                    this.target = this.dim * (this.count - 1);
                }
                else if (this.target < 0) {
                    this.target = 0;
                }
            }
            this.amplitude = this.target - this.offset;
            this.timestamp = Date.now();
            requestAnimationFrame(this._autoScroll);
            if (this.dragged) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        };
        _handleCarouselClick = (e) => {
            // Disable clicks if carousel was dragged.
            if (this.dragged) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            else if (!this.options.fullWidth) {
                const clickedElem = e.target.closest('.carousel-item');
                if (!clickedElem)
                    return;
                const clickedIndex = [...clickedElem.parentNode.children].indexOf(clickedElem);
                const diff = this._wrap(this.center) - clickedIndex;
                // Disable clicks if carousel was shifted by click
                if (diff !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // fixes https://github.com/materializecss/materialize/issues/180
                if (clickedIndex < 0) {
                    // relative X position > center of carousel = clicked at the right part of the carousel
                    if (e.clientX - e.target.getBoundingClientRect().left >
                        this.el.clientWidth / 2) {
                        this.next();
                    }
                    else {
                        this.prev();
                    }
                }
                else {
                    this._cycleTo(clickedIndex);
                }
            }
        };
        _handleIndicatorClick = (e) => {
            e.stopPropagation();
            this._handleIndicatorInteraction(e);
        };
        _handleIndicatorKeyPress = (e) => {
            e.stopPropagation();
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleIndicatorInteraction(e);
            }
        };
        _handleIndicatorInteraction = (e) => {
            const indicator = e.target.closest('.indicator-item');
            if (indicator) {
                const index = [...indicator.parentNode.children].indexOf(indicator);
                this._cycleTo(index);
            }
        };
        _handleResize = () => {
            if (this.options.fullWidth) {
                this.itemWidth = this.el.querySelector('.carousel-item').clientWidth;
                this.imageHeight = this.el.querySelector('.carousel-item.active').clientHeight;
                this.dim = this.itemWidth * 2 + this.options.padding;
                this.offset = this.center * 2 * this.itemWidth;
                this.target = this.offset;
                this._setCarouselHeight(true);
            }
            else {
                this._scroll();
            }
        };
        _setCarouselHeight(imageOnly = false) {
            const firstSlide = this.el.querySelector('.carousel-item.active')
                ? this.el.querySelector('.carousel-item.active')
                : this.el.querySelector('.carousel-item');
            const firstImage = firstSlide.querySelector('img');
            if (firstImage) {
                if (firstImage.complete) {
                    // If image won't trigger the load event
                    const imageHeight = firstImage.clientHeight;
                    if (imageHeight > 0) {
                        this.el.style.height = imageHeight + 'px';
                    }
                    else {
                        // If image still has no height, use the natural dimensions to calculate
                        const naturalWidth = firstImage.naturalWidth;
                        const naturalHeight = firstImage.naturalHeight;
                        const adjustedHeight = (this.el.clientWidth / naturalWidth) * naturalHeight;
                        this.el.style.height = adjustedHeight + 'px';
                    }
                }
                else {
                    // Get height when image is loaded normally
                    firstImage.addEventListener('load', () => {
                        this.el.style.height = firstImage.offsetHeight + 'px';
                    });
                }
            }
            else if (!imageOnly) {
                const slideHeight = firstSlide.clientHeight;
                this.el.style.height = slideHeight + 'px';
            }
        }
        _xpos(e) {
            // touch event
            if (e.type.startsWith('touch') && e.targetTouches.length >= 1) {
                return e.targetTouches[0].clientX;
            }
            // mouse event
            return e.clientX;
        }
        _ypos(e) {
            // touch event
            if (e.type.startsWith('touch') && e.targetTouches.length >= 1) {
                return e.targetTouches[0].clientY;
            }
            // mouse event
            return e.clientY;
        }
        _wrap(x) {
            return x >= this.count ? x % this.count : x < 0 ? this._wrap(this.count + (x % this.count)) : x;
        }
        _track = () => {
            const now = Date.now(), elapsed = now - this.timestamp, delta = this.offset - this.frame, v = (1000 * delta) / (1 + elapsed);
            // now = Date.now();
            // elapsed = now - this.timestamp;
            this.timestamp = now;
            // delta = this.offset - this.frame;
            this.frame = this.offset;
            // v = (1000 * delta) / (1 + elapsed);
            this.velocity = 0.8 * v + 0.2 * this.velocity;
        };
        _autoScroll = () => {
            let elapsed, delta;
            if (this.amplitude) {
                elapsed = Date.now() - this.timestamp;
                delta = this.amplitude * Math.exp(-elapsed / this.options.duration);
                if (delta > 2 || delta < -2) {
                    this._scroll(this.target - delta);
                    requestAnimationFrame(this._autoScroll);
                }
                else {
                    this._scroll(this.target);
                }
            }
        };
        _scroll(x = 0) {
            // Track scrolling state
            if (!this.el.classList.contains('scrolling')) {
                this.el.classList.add('scrolling');
            }
            if (this.scrollingTimeout != null) {
                clearTimeout(this.scrollingTimeout);
            }
            this.scrollingTimeout = setTimeout(() => {
                this.el.classList.remove('scrolling');
            }, this.options.duration);
            // Start actual scroll
            this.offset = typeof x === 'number' ? x : this.offset;
            this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
            const half = this.count >> 1, delta = this.offset - this.center * this.dim, dir = delta < 0 ? 1 : -1, tween = (-dir * delta * 2) / this.dim;
            let i, el, alignment, zTranslation, tweenedOpacity, centerTweenedOpacity;
            const lastCenter = this.center;
            const numVisibleOffset = 1 / this.options.numVisible;
            // delta = this.offset - this.center * this.dim;
            // dir = delta < 0 ? 1 : -1;
            // tween = (-dir * delta * 2) / this.dim;
            // half = this.count >> 1;
            if (this.options.fullWidth) {
                alignment = 'translateX(0)';
                centerTweenedOpacity = 1;
            }
            else {
                alignment = 'translateX(' + (this.el.clientWidth - this.itemWidth) / 2 + 'px) ';
                alignment += 'translateY(' + (this.el.clientHeight - this.itemHeight) / 2 + 'px)';
                centerTweenedOpacity = 1 - numVisibleOffset * tween;
            }
            // Set indicator active
            if (this.showIndicators) {
                const diff = this.center % this.count;
                const activeIndicator = this._indicators.querySelector('.indicator-item.active');
                const activeIndicatorIndex = [...activeIndicator.parentNode.children].indexOf(activeIndicator);
                if (activeIndicatorIndex !== diff) {
                    activeIndicator.classList.remove('active');
                    const pos = diff < 0 ? this.count + diff : diff;
                    this._indicators.querySelectorAll('.indicator-item')[pos].classList.add('active');
                }
            }
            // center
            // Don't show wrapped items.
            if (!this.noWrap || (this.center >= 0 && this.center < this.count)) {
                el = this.images[this._wrap(this.center)];
                // Add active class to center item.
                if (!el.classList.contains('active')) {
                    this.el.querySelector('.carousel-item').classList.remove('active');
                    el.classList.add('active');
                }
                const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * this.options.shift * tween * i}px) translateZ(${this.options.dist * tween}px)`;
                this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
            }
            for (i = 1; i <= half; ++i) {
                // right side
                if (this.options.fullWidth) {
                    zTranslation = this.options.dist;
                    tweenedOpacity = i === half && delta < 0 ? 1 - tween : 1;
                }
                else {
                    zTranslation = this.options.dist * (i * 2 + tween * dir);
                    tweenedOpacity = 1 - numVisibleOffset * (i * 2 + tween * dir);
                }
                // Don't show wrapped items.
                if (!this.noWrap || this.center + i < this.count) {
                    el = this.images[this._wrap(this.center + i)];
                    const transformString = `${alignment} translateX(${this.options.shift + (this.dim * i - delta) / 2}px) translateZ(${zTranslation}px)`;
                    this._updateItemStyle(el, tweenedOpacity, -i, transformString);
                }
                // left side
                if (this.options.fullWidth) {
                    zTranslation = this.options.dist;
                    tweenedOpacity = i === half && delta > 0 ? 1 - tween : 1;
                }
                else {
                    zTranslation = this.options.dist * (i * 2 - tween * dir);
                    tweenedOpacity = 1 - numVisibleOffset * (i * 2 - tween * dir);
                }
                // Don't show wrapped items.
                if (!this.noWrap || this.center - i >= 0) {
                    el = this.images[this._wrap(this.center - i)];
                    const transformString = `${alignment} translateX(${-this.options.shift + (-this.dim * i - delta) / 2}px) translateZ(${zTranslation}px)`;
                    this._updateItemStyle(el, tweenedOpacity, -i, transformString);
                }
            }
            // center
            // Don't show wrapped items.
            if (!this.noWrap || (this.center >= 0 && this.center < this.count)) {
                el = this.images[this._wrap(this.center)];
                const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * this.options.shift * tween}px) translateZ(${this.options.dist * tween}px)`;
                this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
            }
            // onCycleTo callback
            const _currItem = this.el.querySelectorAll('.carousel-item')[this._wrap(this.center)];
            if (lastCenter !== this.center && typeof this.options.onCycleTo === 'function') {
                this.options.onCycleTo.call(this, _currItem, this.dragged);
            }
            // One time callback
            if (typeof this.oneTimeCallback === 'function') {
                this.oneTimeCallback.call(this, _currItem, this.dragged);
                this.oneTimeCallback = null;
            }
        }
        _updateItemStyle(el, opacity, zIndex, transform) {
            el.style[this.xform] = transform;
            el.style.zIndex = zIndex.toString();
            el.style.opacity = opacity.toString();
            el.style.visibility = 'visible';
        }
        _cycleTo(n, callback = null) {
            let diff = (this.center % this.count) - n;
            // Account for wraparound.
            if (!this.noWrap) {
                if (diff < 0) {
                    if (Math.abs(diff + this.count) < Math.abs(diff)) {
                        diff += this.count;
                    }
                }
                else if (diff > 0) {
                    if (Math.abs(diff - this.count) < diff) {
                        diff -= this.count;
                    }
                }
            }
            this.target = this.dim * Math.round(this.offset / this.dim);
            // Next
            if (diff < 0) {
                this.target += this.dim * Math.abs(diff);
            } // Prev
            else if (diff > 0) {
                this.target -= this.dim * diff;
            }
            // Set one time callback
            if (typeof callback === 'function') {
                this.oneTimeCallback = callback;
            }
            // Scroll
            if (this.offset !== this.target) {
                this.amplitude = this.target - this.offset;
                this.timestamp = Date.now();
                requestAnimationFrame(this._autoScroll);
            }
        }
        /**
         * Move carousel to next slide or go forward a given amount of slides.
         * @param n How many times the carousel slides.
         */
        next(n = 1) {
            if (n === undefined || isNaN(n)) {
                n = 1;
            }
            let index = this.center + n;
            if (index >= this.count || index < 0) {
                if (this.noWrap)
                    return;
                index = this._wrap(index);
            }
            this._cycleTo(index);
        }
        /**
         * Move carousel to previous slide or go back a given amount of slides.
         * @param n How many times the carousel slides.
         */
        prev(n = 1) {
            if (n === undefined || isNaN(n)) {
                n = 1;
            }
            let index = this.center - n;
            if (index >= this.count || index < 0) {
                if (this.noWrap)
                    return;
                index = this._wrap(index);
            }
            this._cycleTo(index);
        }
        /**
         * Move carousel to nth slide.
         * @param n Index of slide.
         * @param callback "onCycleTo" optional callback.
         */
        set(n, callback) {
            if (n === undefined || isNaN(n)) {
                n = 0;
            }
            if (n > this.count || n < 0) {
                if (this.noWrap)
                    return;
                n = this._wrap(n);
            }
            this._cycleTo(n, callback);
        }
    }

    const _defaults$i = {
        data: [],
        placeholder: '',
        secondaryPlaceholder: '',
        closeIconClass: 'material-icons',
        autocompleteOptions: {},
        autocompleteOnly: false,
        limit: Infinity,
        allowUserInput: false,
        onChipAdd: null,
        onChipSelect: null,
        onChipDelete: null
    };
    function gGetIndex(el) {
        return [...el.parentNode.children].indexOf(el);
    }
    class Chips extends Component {
        /** Array of the current chips data. */
        chipsData;
        /** If the chips has autocomplete enabled. */
        hasAutocomplete;
        /** Autocomplete instance, if any. */
        autocomplete;
        _input;
        _label;
        _chips;
        static _keydown;
        _selectedChip;
        constructor(el, options) {
            super(el, options, Chips);
            this.el['M_Chips'] = this;
            this.options = {
                ...Chips.defaults,
                ...options
            };
            this.el.classList.add('chips');
            this.chipsData = [];
            this._chips = [];
            // Render initial chips
            if (this.options.data.length) {
                this.chipsData = this.options.data;
                this._renderChips();
            }
            this._setupLabel();
            // Render input element, setup event handlers
            if (this.options.allowUserInput) {
                this.el.classList.add('input-field');
                this._setupInput();
                this._setupEventHandlers();
                // move input to end
                this.el.append(this._input);
            }
        }
        static get defaults() {
            return _defaults$i;
        }
        /**
         * Initializes instances of Chips.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Chips);
        }
        static getInstance(el) {
            return el['M_Chips'];
        }
        getData() {
            return this.chipsData;
        }
        destroy() {
            if (this.options.allowUserInput) {
                this._removeEventHandlers();
            }
            this._chips.forEach((c) => c.remove());
            this._chips = [];
            this.el['M_Chips'] = undefined;
        }
        _setupEventHandlers() {
            this.el.addEventListener('click', this._handleChipClick);
            // @todo why do we need this as document event listener, shouldn't we apply it to the element wrapper itself?
            document.addEventListener('keydown', Chips._handleChipsKeydown);
            document.addEventListener('keyup', Chips._handleChipsKeyup);
            this.el.addEventListener('blur', Chips._handleChipsBlur, true);
            this._input.addEventListener('focus', this._handleInputFocus);
            this._input.addEventListener('blur', this._handleInputBlur);
            this._input.addEventListener('keydown', this._handleInputKeydown);
        }
        _removeEventHandlers() {
            this.el.removeEventListener('click', this._handleChipClick);
            document.removeEventListener('keydown', Chips._handleChipsKeydown);
            document.removeEventListener('keyup', Chips._handleChipsKeyup);
            this.el.removeEventListener('blur', Chips._handleChipsBlur, true);
            this._input.removeEventListener('focus', this._handleInputFocus);
            this._input.removeEventListener('blur', this._handleInputBlur);
            this._input.removeEventListener('keydown', this._handleInputKeydown);
        }
        _handleChipClick = (e) => {
            const _chip = e.target.closest('.chip');
            const clickedClose = e.target.classList.contains('close');
            if (_chip) {
                const index = [..._chip.parentNode.children].indexOf(_chip);
                if (clickedClose) {
                    this.deleteChip(index);
                    this._input.focus();
                }
                else {
                    this.selectChip(index);
                }
                // Default handle click to focus on input
            }
            else {
                this._input.focus();
            }
        };
        static _handleChipsKeydown(e) {
            Chips._keydown = true;
            const chips = e.target.closest('.chips');
            const chipsKeydown = e.target && chips;
            // Don't handle keydown inputs on input and textarea
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || !chipsKeydown)
                return;
            const currChips = chips['M_Chips'];
            if (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.DELETE.includes(e.key)) {
                e.preventDefault();
                let selectIndex = currChips.chipsData.length;
                if (currChips._selectedChip) {
                    const index = gGetIndex(currChips._selectedChip);
                    currChips.deleteChip(index);
                    currChips._selectedChip = null;
                    // Make sure selectIndex doesn't go negative
                    selectIndex = Math.max(index - 1, 0);
                }
                if (currChips.chipsData.length)
                    currChips.selectChip(selectIndex);
                else
                    currChips._input.focus();
            }
            else if (Utils.keys.ARROW_LEFT.includes(e.key)) {
                if (currChips._selectedChip) {
                    const selectIndex = gGetIndex(currChips._selectedChip) - 1;
                    if (selectIndex < 0)
                        return;
                    currChips.selectChip(selectIndex);
                }
            }
            else if (Utils.keys.ARROW_RIGHT.includes(e.key)) {
                if (currChips._selectedChip) {
                    const selectIndex = gGetIndex(currChips._selectedChip) + 1;
                    if (selectIndex >= currChips.chipsData.length)
                        currChips._input.focus();
                    else
                        currChips.selectChip(selectIndex);
                }
            }
        }
        static _handleChipsKeyup() {
            Chips._keydown = false;
        }
        static _handleChipsBlur(e) {
            if (!Chips._keydown && document.hidden) {
                const chips = e.target.closest('.chips');
                const currChips = chips['M_Chips'];
                currChips._selectedChip = null;
            }
        }
        _handleInputFocus = () => {
            this.el.classList.add('focus');
        };
        _handleInputBlur = () => {
            this.el.classList.remove('focus');
        };
        _handleInputKeydown = (e) => {
            Chips._keydown = true;
            if (Utils.keys.ENTER.includes(e.key)) {
                // Override enter if autocompleting.
                if (this.hasAutocomplete && this.autocomplete && this.autocomplete.isOpen) {
                    return;
                }
                e.preventDefault();
                if (!this.hasAutocomplete || (this.hasAutocomplete && !this.options.autocompleteOnly)) {
                    this.addChip({ id: this._input.value });
                }
                this._input.value = '';
            }
            else if ((Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.ARROW_LEFT.includes(e.key)) &&
                this._input.value === '' &&
                this.chipsData.length) {
                e.preventDefault();
                this.selectChip(this.chipsData.length - 1);
            }
        };
        _renderChip(chip) {
            if (!chip.id)
                return;
            const renderedChip = document.createElement('div');
            renderedChip.classList.add('chip');
            renderedChip.innerText = chip.text || chip.id;
            // attach image if needed
            if (chip.image) {
                const img = document.createElement('img');
                img.setAttribute('src', chip.image);
                renderedChip.insertBefore(img, renderedChip.firstChild);
            }
            if (this.options.allowUserInput) {
                renderedChip.setAttribute('tabindex', '0');
                const closeIcon = document.createElement('i');
                closeIcon.classList.add(this.options.closeIconClass, 'close');
                closeIcon.innerText = 'close';
                renderedChip.appendChild(closeIcon);
            }
            return renderedChip;
        }
        _renderChips() {
            this._chips = []; //.remove();
            for (let i = 0; i < this.chipsData.length; i++) {
                const chipElem = this._renderChip(this.chipsData[i]);
                this.el.appendChild(chipElem);
                this._chips.push(chipElem);
            }
        }
        _setupAutocomplete() {
            this.options.autocompleteOptions.onAutocomplete = (items) => {
                if (items.length > 0)
                    this.addChip({
                        id: items[0].id,
                        text: items[0].text,
                        image: items[0].image
                    });
                this._input.value = '';
                this._input.focus();
            };
            this.autocomplete = Autocomplete.init(this._input, this.options.autocompleteOptions);
        }
        _setupInput() {
            this._input = this.el.querySelector('input');
            if (!this._input) {
                this._input = document.createElement('input');
                this.el.append(this._input);
            }
            this._input.classList.add('input');
            this.hasAutocomplete = Object.keys(this.options.autocompleteOptions).length > 0;
            // Setup autocomplete if needed
            if (this.hasAutocomplete)
                this._setupAutocomplete();
            this._setPlaceholder();
            // Set input id
            if (!this._input.getAttribute('id'))
                this._input.setAttribute('id', Utils.guid());
        }
        _setupLabel() {
            this._label = this.el.querySelector('label');
            if (this._label)
                this._label.setAttribute('for', this._input.getAttribute('id'));
        }
        _setPlaceholder() {
            if (this.chipsData !== undefined && !this.chipsData.length && this.options.placeholder) {
                this._input.placeholder = this.options.placeholder;
            }
            else if ((this.chipsData === undefined || !!this.chipsData.length) &&
                this.options.secondaryPlaceholder) {
                this._input.placeholder = this.options.secondaryPlaceholder;
            }
        }
        _isValidAndNotExist(chip) {
            const isValid = !!chip.id;
            const doesNotExist = !this.chipsData.some((item) => item.id == chip.id);
            return isValid && doesNotExist;
        }
        /**
         * Add chip to input.
         * @param chip Chip data object
         */
        addChip(chip) {
            if (!this._isValidAndNotExist(chip) || this.chipsData.length >= this.options.limit)
                return;
            const renderedChip = this._renderChip(chip);
            this._chips.push(renderedChip);
            this.chipsData.push(chip);
            //$(this._input).before(renderedChip);
            this._input.before(renderedChip);
            this._setPlaceholder();
            // fire chipAdd callback
            if (typeof this.options.onChipAdd === 'function') {
                this.options.onChipAdd(this.el, renderedChip);
            }
        }
        /**
         * Delete nth chip.
         * @param chipIndex  Index of chip
         */
        deleteChip(chipIndex) {
            const chip = this._chips[chipIndex];
            this._chips[chipIndex].remove();
            this._chips.splice(chipIndex, 1);
            this.chipsData.splice(chipIndex, 1);
            this._setPlaceholder();
            // fire chipDelete callback
            if (typeof this.options.onChipDelete === 'function') {
                this.options.onChipDelete(this.el, chip);
            }
        }
        /**
         * Select nth chip.
         * @param chipIndex Index of chip
         */
        selectChip(chipIndex) {
            const chip = this._chips[chipIndex];
            this._selectedChip = chip;
            chip.focus();
            // fire chipSelect callback
            if (typeof this.options.onChipSelect === 'function') {
                this.options.onChipSelect(this.el, chip);
            }
        }
        static Init() {
            if (typeof document !== 'undefined')
                // Handle removal of static chips.
                document.addEventListener('DOMContentLoaded', () => {
                    const chips = document.querySelectorAll('.chips');
                    chips.forEach((el) => {
                        // if (el && (el['M_Chips == undefined) return;
                        el.addEventListener('click', (e) => {
                            if (e.target.classList.contains('close')) {
                                const chip = e.target.closest('.chip');
                                if (chip)
                                    chip.remove();
                            }
                        });
                    });
                });
        }
        static {
            Chips._keydown = false;
        }
    }

    const _defaults$h = {
        accordion: true,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        inDuration: 300,
        outDuration: 300
    };
    class Collapsible extends Component {
        _headers;
        constructor(el, options) {
            super(el, options, Collapsible);
            this.el['M_Collapsible'] = this;
            this.options = {
                ...Collapsible.defaults,
                ...options
            };
            // Setup tab indices
            this._headers = Array.from(this.el.querySelectorAll('li > .collapsible-header'));
            this._headers.forEach((el) => (el.tabIndex = 0));
            this._setupEventHandlers();
            // Open active
            const activeBodies = Array.from(this.el.querySelectorAll('li.active > .collapsible-body'));
            if (this.options.accordion) {
                if (activeBodies.length > 0) {
                    // Accordion => open first active only
                    this._setExpanded(activeBodies[0]);
                }
            }
            else {
                // Expandables => all active
                activeBodies.forEach((el) => this._setExpanded(el));
            }
        }
        static get defaults() {
            return _defaults$h;
        }
        /**
         * Initializes instances of Collapsible.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Collapsible);
        }
        static getInstance(el) {
            return el['M_Collapsible'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['M_Collapsible'] = undefined;
        }
        _setupEventHandlers() {
            this.el.addEventListener('click', this._handleCollapsibleClick);
            this._headers.forEach((header) => header.addEventListener('keydown', this._handleCollapsibleKeydown));
        }
        _removeEventHandlers() {
            this.el.removeEventListener('click', this._handleCollapsibleClick);
            this._headers.forEach((header) => header.removeEventListener('keydown', this._handleCollapsibleKeydown));
        }
        _handleCollapsibleClick = (e) => {
            const header = e.target.closest('.collapsible-header');
            if (e.target && header) {
                const collapsible = header.closest('.collapsible');
                if (collapsible !== this.el)
                    return;
                const li = header.closest('li');
                const isActive = li.classList.contains('active');
                const index = [...li.parentNode.children].indexOf(li);
                if (isActive)
                    this.close(index);
                else
                    this.open(index);
            }
        };
        _handleCollapsibleKeydown = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleCollapsibleClick(e);
            }
        };
        _setExpanded(li) {
            li.style.maxHeight = li.scrollHeight + 'px';
        }
        _animateIn(index) {
            const li = this.el.children[index];
            if (!li)
                return;
            const body = li.querySelector('.collapsible-body');
            const duration = this.options.inDuration; // easeInOutCubic
            body.style.transition = `max-height ${duration}ms ease-out`;
            this._setExpanded(body);
            setTimeout(() => {
                if (typeof this.options.onOpenEnd === 'function') {
                    this.options.onOpenEnd.call(this, li);
                }
            }, duration);
        }
        _animateOut(index) {
            const li = this.el.children[index];
            if (!li)
                return;
            const body = li.querySelector('.collapsible-body');
            const duration = this.options.outDuration; // easeInOutCubic
            body.style.transition = `max-height ${duration}ms ease-out`;
            body.style.maxHeight = '0';
            setTimeout(() => {
                if (typeof this.options.onCloseEnd === 'function') {
                    this.options.onCloseEnd.call(this, li);
                }
            }, duration);
        }
        /**
         * Open collapsible section.
         * @param n Nth section to open.
         */
        open = (index) => {
            const listItems = Array.from(this.el.children).filter((c) => c.tagName === 'LI');
            const li = listItems[index];
            if (li && !li.classList.contains('active')) {
                // onOpenStart callback
                if (typeof this.options.onOpenStart === 'function') {
                    this.options.onOpenStart.call(this, li);
                }
                // Handle accordion behavior
                if (this.options.accordion) {
                    const activeLis = listItems.filter((li) => li.classList.contains('active'));
                    activeLis.forEach((activeLi) => {
                        const index = listItems.indexOf(activeLi);
                        this.close(index);
                    });
                }
                // Animate in
                li.classList.add('active');
                this._animateIn(index);
            }
        };
        /**
         * Close collapsible section.
         * @param n Nth section to close.
         */
        close = (index) => {
            const li = Array.from(this.el.children).filter((c) => c.tagName === 'LI')[index];
            if (li && li.classList.contains('active')) {
                // onCloseStart callback
                if (typeof this.options.onCloseStart === 'function') {
                    this.options.onCloseStart.call(this, li);
                }
                // Animate out
                li.classList.remove('active');
                this._animateOut(index);
            }
        };
    }

    const _defaults$g = {
        classes: '',
        dropdownOptions: {}
    };
    class FormSelect extends Component {
        /** If this is a multiple select. */
        isMultiple;
        /**
         * Label associated with the current select element.
         * Is "null", if not detected.
         */
        labelEl;
        /** Dropdown UL element. */
        dropdownOptions;
        /** Text input that shows current selected option. */
        input;
        /** Instance of the dropdown plugin for this select. */
        dropdown;
        /** The select wrapper element. */
        wrapper;
        selectOptions;
        _values;
        nativeTabIndex;
        constructor(el, options) {
            super(el, options, FormSelect);
            if (this.el.classList.contains('browser-default'))
                return;
            this.el['M_FormSelect'] = this;
            this.options = {
                ...FormSelect.defaults,
                ...options
            };
            this.isMultiple = this.el.multiple;
            this.nativeTabIndex = this.el.tabIndex ?? -1;
            this.el.tabIndex = -1;
            this._values = [];
            this._setupDropdown();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$g;
        }
        /**
         * Initializes instances of FormSelect.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, FormSelect);
        }
        static getInstance(el) {
            return el['M_FormSelect'];
        }
        destroy() {
            this._removeEventHandlers();
            this._removeDropdown();
            this.el['M_FormSelect'] = undefined;
        }
        _setupEventHandlers() {
            this.dropdownOptions.querySelectorAll('li:not(.optgroup)').forEach((el) => {
                el.addEventListener('click', this._handleOptionClick);
                el.addEventListener('keydown', (e) => {
                    if (e.key === ' ' || e.key === 'Enter')
                        this._handleOptionClick(e);
                });
            });
            this.el.addEventListener('change', this._handleSelectChange);
            this.input.addEventListener('click', this._handleInputClick);
        }
        _removeEventHandlers() {
            this.dropdownOptions.querySelectorAll('li:not(.optgroup)').forEach((el) => {
                el.removeEventListener('click', this._handleOptionClick);
            });
            this.el.removeEventListener('change', this._handleSelectChange);
            this.input.removeEventListener('click', this._handleInputClick);
        }
        _handleSelectChange = () => {
            this._setValueToInput();
        };
        _handleOptionClick = (e) => {
            e.preventDefault();
            const virtualOption = e.target.closest('li');
            this._selectOptionElement(virtualOption);
            e.stopPropagation();
        };
        _arraysEqual(a, b) {
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            if (a.length !== b.length)
                return false;
            for (let i = 0; i < a.length; ++i)
                if (a[i] !== b[i])
                    return false;
            return true;
        }
        _selectOptionElement(virtualOption) {
            if (!virtualOption.classList.contains('disabled') &&
                !virtualOption.classList.contains('optgroup')) {
                const value = this._values.find((value) => value.optionEl === virtualOption);
                const previousSelectedValues = this.getSelectedValues();
                if (this.isMultiple) {
                    // Multi-Select
                    this._toggleEntryFromArray(value);
                }
                else {
                    // Single-Select
                    this._deselectAll();
                    this._selectValue(value);
                }
                // Refresh Input-Text
                this._setValueToInput();
                // Trigger Change-Event only when data is different
                const actualSelectedValues = this.getSelectedValues();
                const selectionHasChanged = !this._arraysEqual(previousSelectedValues, actualSelectedValues);
                if (selectionHasChanged)
                    this.el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true })); // trigger('change');
            }
            if (!this.isMultiple)
                this.dropdown.close();
        }
        _handleInputClick = () => {
            if (this.dropdown && this.dropdown.isOpen) {
                this._setValueToInput();
                this._setSelectedStates();
            }
        };
        _setupDropdown() {
            this.labelEl = document.querySelector('[for="' + this.el.id + '"]');
            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('select-wrapper', 'input-field');
            if (this.options.classes.length > 0) {
                this.wrapper.classList.add(...this.options.classes.split(' '));
            }
            this.el.before(this.wrapper);
            // Move actual select element into overflow hidden wrapper
            const hiddenDiv = document.createElement('div');
            hiddenDiv.classList.add('hide-select');
            this.wrapper.append(hiddenDiv);
            hiddenDiv.appendChild(this.el);
            if (this.el.disabled)
                this.wrapper.classList.add('disabled');
            this.selectOptions = (Array.from(this.el.children).filter((el) => ['OPTION', 'OPTGROUP'].includes(el.tagName)));
            // Create dropdown
            this.dropdownOptions = document.createElement('ul');
            this.dropdownOptions.id = `select-options-${Utils.guid()}`;
            this.dropdownOptions.setAttribute('popover', 'auto');
            this.dropdownOptions.classList.add('dropdown-content', 'select-dropdown');
            this.dropdownOptions.setAttribute('role', 'listbox');
            this.dropdownOptions.ariaMultiSelectable = this.isMultiple.toString();
            if (this.isMultiple)
                this.dropdownOptions.classList.add('multiple-select-dropdown');
            // Create dropdown structure
            if (this.selectOptions.length > 0) {
                this.selectOptions.forEach((realOption) => {
                    if (realOption.tagName === 'OPTION') {
                        // Option
                        const virtualOption = this._createAndAppendOptionWithIcon(realOption, this.isMultiple ? 'multiple' : undefined);
                        this._addOptionToValues(realOption, virtualOption);
                    }
                    else if (realOption.tagName === 'OPTGROUP') {
                        // Optgroup
                        const groupId = 'opt-group-' + Utils.guid();
                        const groupParent = document.createElement('li');
                        groupParent.classList.add('optgroup');
                        groupParent.tabIndex = -1;
                        groupParent.setAttribute('role', 'group');
                        groupParent.setAttribute('aria-labelledby', groupId);
                        groupParent.innerHTML = `<span id="${groupId}" role="presentation">${realOption.getAttribute('label')}</span>`;
                        this.dropdownOptions.append(groupParent);
                        const groupChildren = [];
                        const selectOptions = (Array.from(realOption.children).filter((el) => el.tagName === 'OPTION'));
                        selectOptions.forEach((realOption) => {
                            const virtualOption = this._createAndAppendOptionWithIcon(realOption, 'optgroup-option');
                            const childId = 'opt-child-' + Utils.guid();
                            virtualOption.id = childId;
                            groupChildren.push(childId);
                            this._addOptionToValues(realOption, virtualOption);
                        });
                        groupParent.setAttribute('aria-owns', groupChildren.join(' '));
                    }
                });
            }
            this.wrapper.append(this.dropdownOptions);
            // Add input dropdown
            this.input = document.createElement('input');
            this.input.id = 'm_select-input-' + Utils.guid();
            this.input.classList.add('select-dropdown', 'dropdown-trigger');
            this.input.type = 'text';
            this.input.readOnly = true;
            this.input.setAttribute('data-target', this.dropdownOptions.id);
            this.input.ariaReadOnly = 'true';
            this.input.ariaRequired = this.el.hasAttribute('required').toString(); //setAttribute("aria-required", this.el.hasAttribute("required"));
            if (this.el.disabled)
                this.input.disabled = true; // 'true');
            this.input.setAttribute('tabindex', this.nativeTabIndex.toString());
            const attrs = this.el.attributes;
            for (let i = 0; i < attrs.length; ++i) {
                const attr = attrs[i];
                if (attr.name.startsWith('aria-'))
                    this.input.setAttribute(attr.name, attr.value);
            }
            // Adds aria-attributes to input element
            this.input.setAttribute('role', 'combobox');
            this.input.ariaExpanded = 'false';
            this.input.setAttribute('aria-owns', this.dropdownOptions.id);
            this.input.setAttribute('aria-controls', this.dropdownOptions.id);
            this.input.placeholder = ' ';
            this.wrapper.prepend(this.input);
            this._setValueToInput();
            // Add caret
            const dropdownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //document.createElement('svg')
            dropdownIcon.classList.add('caret');
            dropdownIcon.setAttribute('height', '24');
            dropdownIcon.setAttribute('width', '24');
            dropdownIcon.setAttribute('viewBox', '0 0 24 24');
            dropdownIcon.ariaHidden = 'true';
            dropdownIcon.innerHTML = `<path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/>`;
            this.wrapper.prepend(dropdownIcon);
            // Initialize dropdown
            if (!this.el.disabled) {
                const dropdownOptions = { ...this.options.dropdownOptions };
                dropdownOptions.coverTrigger = false;
                const userOnOpenEnd = dropdownOptions.onOpenEnd;
                const userOnCloseEnd = dropdownOptions.onCloseEnd;
                // Add callback for centering selected option when dropdown content is scrollable
                dropdownOptions.onOpenEnd = () => {
                    const selectedOption = this.dropdownOptions.querySelector('.selected');
                    if (selectedOption) {
                        // Focus selected option in dropdown
                        Utils.keyDown = true;
                        this.dropdown.focusedIndex = [...selectedOption.parentNode.children].indexOf(selectedOption);
                        this.dropdown._focusFocusedItem();
                        Utils.keyDown = false;
                        // Handle scrolling to selected option
                        if (this.dropdown.isScrollable) {
                            let scrollOffset = selectedOption.getBoundingClientRect().top -
                                this.dropdownOptions.getBoundingClientRect().top; // scroll to selected option
                            scrollOffset -= this.dropdownOptions.clientHeight / 2; // center in dropdown
                            this.dropdownOptions.scrollTop = scrollOffset;
                        }
                    }
                    this.input.ariaExpanded = 'true';
                    // Handle user declared onOpenEnd if needed
                    if (userOnOpenEnd && typeof userOnOpenEnd === 'function')
                        userOnOpenEnd.call(this.dropdown, this.el);
                };
                // Add callback for reseting "expanded" state
                dropdownOptions.onCloseEnd = () => {
                    this.input.ariaExpanded = 'false';
                    // Handle user declared onOpenEnd if needed
                    if (userOnCloseEnd && typeof userOnCloseEnd === 'function')
                        userOnCloseEnd.call(this.dropdown, this.el);
                };
                // Prevent dropdown from closing too early
                dropdownOptions.closeOnClick = false;
                this.dropdown = Dropdown.init(this.input, dropdownOptions);
            }
            // Add initial selections
            this._setSelectedStates();
            // move label
            if (this.labelEl)
                this.input.after(this.labelEl);
        }
        _addOptionToValues(realOption, virtualOption) {
            this._values.push({ el: realOption, optionEl: virtualOption });
        }
        _removeDropdown() {
            this.wrapper.querySelector('.caret').remove();
            this.input.remove();
            this.dropdownOptions.remove();
            this.wrapper.before(this.el);
            this.wrapper.remove();
        }
        _createAndAppendOptionWithIcon(realOption, type) {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            if (realOption.disabled) {
                li.classList.add('disabled');
                li.ariaDisabled = 'true';
            }
            if (type === 'optgroup-option')
                li.classList.add(type);
            // Text / Checkbox
            const span = document.createElement('span');
            span.innerHTML = realOption.innerHTML;
            if (this.isMultiple && !realOption.disabled) {
                span.innerHTML = `<label><input type="checkbox"><span>${realOption.innerHTML}</span></label>`;
            }
            li.appendChild(span);
            // add Icon
            const iconUrl = realOption.getAttribute('data-icon');
            const classes = realOption.getAttribute('class')?.split(' ');
            if (iconUrl) {
                const img = document.createElement('img');
                if (classes)
                    img.classList.add(...classes);
                img.src = iconUrl;
                img.ariaHidden = 'true';
                li.prepend(img);
            }
            // Check for multiple type
            this.dropdownOptions.append(li);
            return li;
        }
        _selectValue(value) {
            value.el.selected = true;
            value.optionEl.classList.add('selected');
            value.optionEl.ariaSelected = 'true'; // setAttribute("aria-selected", true);
            const checkbox = value.optionEl.querySelector('input[type="checkbox"]');
            if (checkbox)
                checkbox.checked = true;
        }
        _deselectValue(value) {
            value.el.selected = false;
            value.optionEl.classList.remove('selected');
            value.optionEl.ariaSelected = 'false'; //setAttribute("aria-selected", false);
            const checkbox = value.optionEl.querySelector('input[type="checkbox"]');
            if (checkbox)
                checkbox.checked = false;
        }
        _deselectAll() {
            this._values.forEach((value) => this._deselectValue(value));
        }
        _isValueSelected(value) {
            const realValues = this.getSelectedValues();
            return realValues.some((realValue) => realValue === value.el.value);
        }
        _toggleEntryFromArray(value) {
            if (this._isValueSelected(value))
                this._deselectValue(value);
            else
                this._selectValue(value);
        }
        _getSelectedOptions() {
            // remove null, false, ... values
            return Array.prototype.filter.call(this.el.selectedOptions, (realOption) => realOption);
        }
        _setValueToInput() {
            const selectedRealOptions = this._getSelectedOptions();
            const selectedOptionPairs = this._values.filter((value) => selectedRealOptions.indexOf(value.el) >= 0);
            // Filter not disabled
            const notDisabledOptionPairs = selectedOptionPairs.filter((op) => !op.el.disabled);
            const texts = notDisabledOptionPairs.map((value) => value.optionEl.querySelector('span').innerText.trim());
            // Set input-text to first Option with empty value which indicates a description like "choose your option"
            if (texts.length === 0) {
                const firstDisabledOption = this.el.querySelector('option:disabled');
                if (firstDisabledOption && firstDisabledOption.value === '') {
                    this.input.value = firstDisabledOption.innerText;
                    return;
                }
            }
            this.input.value = texts.join(', ');
        }
        _setSelectedStates() {
            this._values.forEach((value) => {
                const optionIsSelected = value.el.selected;
                const cb = value.optionEl.querySelector('input[type="checkbox"]');
                if (cb)
                    cb.checked = optionIsSelected;
                if (optionIsSelected) {
                    this._activateOption(this.dropdownOptions, value.optionEl);
                }
                else {
                    value.optionEl.classList.remove('selected');
                    value.optionEl.ariaSelected = 'false'; // attr("aria-selected", 'false');
                }
            });
        }
        _activateOption(ul, li) {
            if (!li)
                return;
            if (!this.isMultiple)
                ul.querySelectorAll('li.selected').forEach((li) => li.classList.remove('selected'));
            li.classList.add('selected');
            li.ariaSelected = 'true';
        }
        getSelectedValues() {
            return this._getSelectedOptions().map((realOption) => realOption.value);
        }
    }

    const _defaults$f = {
        margin: 5,
        transition: 10,
        duration: 250,
        align: 'left'
    };
    class DockedDisplayPlugin {
        el;
        container;
        options;
        visible;
        constructor(el, container, options) {
            this.el = el;
            this.options = {
                ..._defaults$f,
                ...options
            };
            this.container = document.createElement('div');
            this.container.classList.add('display-docked');
            this.container.append(container);
            el.parentElement.append(this.container);
            document.addEventListener('click', (e) => {
                if (this.visible && !(this.el === e.target) && !(e.target.closest('.display-docked'))) {
                    this.hide();
                }
            });
        }
        /**
         * Initializes instance of DockedDisplayPlugin
         * @param el HTMLElement to position to
         * @param container HTMLElement to be positioned
         * @param options Plugin options
         */
        static init(el, container, options) {
            return new DockedDisplayPlugin(el, container, options);
        }
        show = () => {
            if (this.visible)
                return;
            this.visible = true;
            const coordinates = Utils._setAbsolutePosition(this.el, this.container, 'bottom', this.options.margin, this.options.transition, this.options.align);
            // @todo move to Util? -> duplicate code fragment with tooltip
            // easeOutCubic
            this.container.style.visibility = 'visible';
            this.container.style.transition = `
      transform ${this.options.duration}ms ease-out,
      opacity ${this.options.duration}ms ease-out`;
            setTimeout(() => {
                this.container.style.transform = `translateX(${coordinates.x}px) translateY(${coordinates.y}px)`;
                this.container.style.opacity = (1).toString();
            }, 1);
        };
        hide = () => {
            if (!this.visible)
                return;
            this.visible = false;
            // @todo move to Util? -> duplicate code fragment with tooltip
            this.container.removeAttribute('style');
            this.container.style.transition = `
      transform ${this.options.duration}ms ease-out,
      opacity ${this.options.duration}ms ease-out`;
            setTimeout(() => {
                this.container.style.transform = `translateX(0px) translateY(0px)`;
                this.container.style.opacity = '0';
            }, 1);
        };
    }

    const _defaults$e = {
        // the default output format for the input field value
        format: 'mmm dd, yyyy',
        // Used to create date object from current input string
        parse: null,
        // The initial condition if the datepicker is based on date range
        isDateRange: false,
        // The selector of the user specified date range end element
        dateRangeEndEl: null,
        // The initial condition if the datepicker is based on multiple date selection
        isMultipleSelection: false,
        // The initial date to view when first opened
        defaultDate: null,
        // The initial end date to view when first opened
        defaultEndDate: null,
        // Make the `defaultDate` the initial selected value
        setDefaultDate: false,
        // Make the `defaultEndDate` the initial selected value
        setDefaultEndDate: false,
        disableWeekends: false,
        disableDayFn: null,
        // First day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,
        // The earliest date that can be selected
        minDate: null,
        // Thelatest date that can be selected
        maxDate: null,
        // Number of years either side, or array of upper/lower range
        yearRange: 10,
        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,
        startRange: null,
        endRange: null,
        isRTL: false,
        yearRangeReverse: false,
        // Render the month after year in the calendar title
        showMonthAfterYear: false,
        // Render days of the calendar grid that fall in the next or previous month
        showDaysInNextAndPreviousMonths: false,
        // Specify if docked picker is in open state by default
        openByDefault: false,
        // Specify a DOM element to render the calendar in
        container: null,
        // Show clear button
        showClearBtn: false,
        // Autosubmit
        autoSubmit: true,
        // internationalization
        i18n: {
            cancel: 'Cancel',
            clear: 'Clear',
            done: 'Ok',
            previousMonth: '‹',
            nextMonth: '›',
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            monthsShort: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            weekdaysAbbrev: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        },
        // events array
        events: [],
        // callback function
        onSelect: null,
        onDraw: null,
        onInputInteraction: null,
        displayPlugin: null,
        displayPluginOptions: null,
        onConfirm: null,
        onCancel: null,
    };
    class Datepicker extends Component {
        id;
        multiple = false;
        calendarEl;
        /** CLEAR button instance. */
        // clearBtn: HTMLElement;
        /** DONE button instance */
        /*doneBtn: HTMLElement;
        cancelBtn: HTMLElement;*/
        containerEl;
        yearTextEl;
        dateTextEl;
        endDateEl;
        dateEls;
        /** The selected Date. */
        date;
        endDate;
        dates;
        formats;
        calendars;
        _y;
        _m;
        displayPlugin;
        footer;
        static _template;
        constructor(el, options) {
            super(el, options, Datepicker);
            this.el['M_Datepicker'] = this;
            this.options = {
                ...Datepicker.defaults,
                ...options
            };
            // make sure i18n defaults are not lost when only few i18n option properties are passed
            if (!!options && options.hasOwnProperty('i18n') && typeof options.i18n === 'object') {
                this.options.i18n = { ...Datepicker.defaults.i18n, ...options.i18n };
            }
            // Remove time component from minDate and maxDate options
            if (this.options.minDate)
                this.options.minDate.setHours(0, 0, 0, 0);
            if (this.options.maxDate)
                this.options.maxDate.setHours(0, 0, 0, 0);
            this.id = Utils.guid();
            this._setupVariables();
            this._insertHTMLIntoDOM();
            this._setupEventHandlers();
            if (!this.options.defaultDate) {
                this.options.defaultDate = new Date(Date.parse(this.el.value));
            }
            const defDate = this.options.defaultDate;
            if (Datepicker._isDate(defDate)) {
                if (this.options.setDefaultDate) {
                    this.setDate(defDate, true);
                    this.setInputValue(this.el, defDate);
                }
                else {
                    this.gotoDate(defDate);
                }
            }
            else {
                this.gotoDate(new Date());
            }
            if (this.options.isDateRange) {
                this.multiple = true;
                const defEndDate = this.options.defaultEndDate;
                if (Datepicker._isDate(defEndDate)) {
                    if (this.options.setDefaultEndDate) {
                        this.setDate(defEndDate, true, true);
                        this.setInputValue(this.endDateEl, defEndDate);
                    }
                }
            }
            if (this.options.isMultipleSelection) {
                this.multiple = true;
                this.dates = [];
                this.dateEls = [];
                this.dateEls.push(el);
            }
            if (this.options.displayPlugin) {
                if (this.options.displayPlugin === 'docked')
                    this.displayPlugin = DockedDisplayPlugin.init(this.el, this.containerEl, this.options.displayPluginOptions);
            }
        }
        static get defaults() {
            return _defaults$e;
        }
        /**
         * Initializes instances of Datepicker.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Datepicker);
        }
        static _isDate(obj) {
            return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
        }
        static _isWeekend(date) {
            const day = date.getDay();
            return day === 0 || day === 6;
        }
        /**
         * @deprecated as this function has no effect without any return statement or global parameter setter.
         */
        static _setToStartOfDay(date) {
            if (Datepicker._isDate(date))
                date.setHours(0, 0, 0, 0);
        }
        static _getDaysInMonth(year, month) {
            return [31, Datepicker._isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        }
        static _isLeapYear(year) {
            // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }
        static _compareDates(a, b) {
            // weak date comparison (use setToStartOfDay(date) to ensure correct result)
            return a.getTime() === b.getTime();
        }
        static _compareWithinRange(day, date, dateEnd) {
            return day.getTime() > date.getTime() && day.getTime() < dateEnd.getTime();
        }
        static _comparePastDate(a, b) {
            return a.getTime() < b.getTime();
        }
        static getInstance(el) {
            return el['M_Datepicker'];
        }
        destroy() {
            this._removeEventHandlers();
            this.containerEl.remove();
            this.destroySelects();
            this.el['M_Datepicker'] = undefined;
        }
        destroySelects() {
            const oldYearSelect = this.calendarEl.querySelector('.orig-select-year');
            if (oldYearSelect) {
                FormSelect.getInstance(oldYearSelect).destroy();
            }
            const oldMonthSelect = this.calendarEl.querySelector('.orig-select-month');
            if (oldMonthSelect) {
                FormSelect.getInstance(oldMonthSelect).destroy();
            }
        }
        _insertHTMLIntoDOM() {
            // HTML5 input date field support
            if (this.el.type == 'date') {
                this.el.classList.add('datepicker-date-input');
            }
            if (!this.el.parentElement.querySelector('.datepicker-format') === null) {
                this._renderDateInputFormat(this.el);
            }
            if (this.options.isDateRange) {
                this.containerEl.classList.add('daterange');
                if (!this.options.dateRangeEndEl) {
                    this.endDateEl = this.createDateInput();
                    this.endDateEl.classList.add('datepicker-end-date');
                }
                else if (document.querySelector(this.options.dateRangeEndEl) === undefined) {
                    console.warn('Specified date range end input element in dateRangeEndEl not found');
                }
                else {
                    this.endDateEl = document.querySelector(this.options.dateRangeEndEl);
                    if (!this.endDateEl.parentElement.querySelector('.datepicker-format') === null) {
                        this._renderDateInputFormat(this.endDateEl);
                    }
                }
            }
            /*if (this.options.showClearBtn) {
              this.clearBtn.style.visibility = '';
              this.clearBtn.innerText = this.options.i18n.clear;
            }
            this.doneBtn.innerText = this.options.i18n.done;
            this.cancelBtn.innerText = this.options.i18n.cancel;*/
            Utils.createButton(this.footer, this.options.i18n.clear, ['datepicker-clear'], this.options.showClearBtn, this._handleClearClick);
            if (!this.options.autoSubmit) {
                Utils.createConfirmationContainer(this.footer, this.options.i18n.done, this.options.i18n.cancel, this._confirm, this._cancel);
            }
            if (this.options.container) {
                const optEl = this.options.container;
                this.options.container =
                    optEl instanceof HTMLElement ? optEl : document.querySelector(optEl);
                this.options.container.append(this.containerEl);
            }
            else {
                //this.containerEl.before(this.el);
                const appendTo = !this.endDateEl ? this.el : this.endDateEl;
                if (!this.options.openByDefault)
                    this.containerEl.setAttribute('style', 'display: none; visibility: hidden;');
                appendTo.parentElement.after(this.containerEl);
            }
        }
        /**
         * Renders the date input format
         */
        _renderDateInputFormat(el) {
            el.parentElement.querySelector('.datepicker-format').innerHTML = this.options.format.toString();
        }
        /**
         * Gets a string representation of the given date.
         */
        toString(date = this.date, format = null) {
            format = format || this.options.format;
            if (typeof format === 'function')
                return format(date);
            if (!Datepicker._isDate(date))
                return '';
            // String Format
            return this.formatDate(date, format);
        }
        /**
         * Returns the formatted date.
         */
        formatDate(date, format) {
            const formatArray = format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
            return formatArray
                .map((label) => (this.formats[label] ? this.formats[label](date) : label))
                .join('');
        }
        /**
         * Sets date from input field.
         */
        setDateFromInput(el) {
            const date = new Date(Date.parse(el.value));
            this.setDate(date, false, el == this.endDateEl, true);
        }
        /**
         * Set a date on the datepicker.
         * @param date Date to set on the datepicker.
         * @param preventOnSelect Undocumented as of 5 March 2018.
         * @param isEndDate
         * @param fromUserInput
         */
        setDate(date = null, preventOnSelect = false, isEndDate = false, fromUserInput = false) {
            const selectedDate = this.validateDate(date);
            if (!selectedDate) {
                return;
            }
            if (!this.options.isMultipleSelection)
                this.setSingleDate(selectedDate, isEndDate);
            else if (!fromUserInput)
                this.setMultiDate(selectedDate);
            Datepicker._setToStartOfDay(selectedDate);
            this.gotoDate(selectedDate);
            if (!preventOnSelect && typeof this.options.onSelect === 'function') {
                this.options.onSelect.call(this, selectedDate);
            }
        }
        validateDate(date) {
            if (!date) {
                this._renderDateDisplay(date);
                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!Datepicker._isDate(date)) {
                return;
            }
            const min = this.options.minDate, max = this.options.maxDate;
            if (Datepicker._isDate(min) && date < min) {
                date = min;
            }
            else if (Datepicker._isDate(max) && date > max) {
                date = max;
            }
            return new Date(date.getTime());
        }
        /**
         * Set a single date on the datepicker.
         * @param date Date to set on the datepicker.
         * @param isEndDate
         */
        setSingleDate(date, isEndDate) {
            if (!isEndDate) {
                this.date = date;
            }
            else if (isEndDate) {
                this.endDate = date;
            }
        }
        /**
         * Set a multi date on the datepicker.
         * @param date Date to set on the datepicker.
         */
        setMultiDate(date) {
            const selectedDate = this.dates?.find((item) => {
                return item.getTime() === date.getTime() ? item : false;
            });
            if (!selectedDate) {
                this.dates.push(date);
            }
            else {
                this.dates.splice(this.dates.indexOf(selectedDate), 1);
            }
            this.dates.sort((a, b) => (a.getTime() < b.getTime() ? -1 : 0));
        }
        /**
         * Sets the data-date attribute on the date input field
         */
        setDataDate(el, date) {
            el.setAttribute('data-date', this.toString(date));
        }
        /**
         * Sets dates on the input values.
         */
        setInputValues() {
            if (!this.options?.isMultipleSelection) {
                this.setInputValue(this.el, this.date);
                if (this.options?.isDateRange) {
                    this.setInputValue(this.endDateEl, this.endDate);
                }
                return;
            }
            this.setMultipleSelectionInputValues();
        }
        setMultipleSelectionInputValues() {
            const dateElsArr = Array.from(this.dateEls).filter((el, index) => {
                if (index > this.dates.length - 1)
                    return el;
            });
            dateElsArr.forEach((el) => {
                el.remove();
            });
            this.dates.forEach((date, index) => {
                if (Array.from(this.dateEls)[index]) {
                    this.setInputValue(this.dateEls[index], date);
                    return;
                }
                const dateEl = this.createDateInput();
                this.setInputValue(dateEl, date);
                this.dateEls.push(dateEl);
            });
        }
        /**
         * Sets given date as the input value on the given element.
         */
        setInputValue(el, date) {
            if (el.type == 'date') {
                this.setDataDate(el, date);
                el.value = this.formatDate(date, 'yyyy-mm-dd');
            }
            else {
                el.value = this.toString(date);
            }
            this.el.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: { firedBy: this }
            }));
        }
        /**
         * Renders the date in the modal head section.
         */
        _renderDateDisplay(date, endDate = null) {
            const displayDate = Datepicker._isDate(date) ? date : new Date();
            // this.yearTextEl.innerHTML = displayDate.getFullYear().toString();
            // @todo should we include an option for date formatting by component options?
            if (!this.options.isDateRange) {
                this.dateTextEl.innerHTML = this.formatDate(displayDate, 'ddd, mmm d');
            }
            else {
                const displayEndDate = Datepicker._isDate(endDate) ? endDate : new Date();
                this.dateTextEl.innerHTML = `${this.formatDate(displayDate, 'mmm d')} - ${this.formatDate(displayEndDate, 'mmm d')}`;
            }
        }
        /**
         * Change date view to a specific date on the datepicker.
         * @param date Date to show on the datepicker.
         */
        gotoDate(date) {
            let newCalendar = true;
            if (!Datepicker._isDate(date)) {
                return;
            }
            if (this.calendars) {
                const firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1), lastVisibleDate = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1), visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
                lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
                newCalendar =
                    visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate;
            }
            if (newCalendar) {
                this.calendars = [
                    {
                        month: date.getMonth(),
                        year: date.getFullYear()
                    }
                ];
            }
            this.adjustCalendars();
        }
        adjustCalendars() {
            this.calendars[0] = this.adjustCalendar(this.calendars[0]);
            this.draw();
        }
        adjustCalendar(calendar) {
            if (calendar.month < 0) {
                calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
                calendar.month += 12;
            }
            if (calendar.month > 11) {
                calendar.year += Math.floor(Math.abs(calendar.month) / 12);
                calendar.month -= 12;
            }
            return calendar;
        }
        nextMonth() {
            this.calendars[0].month++;
            this.adjustCalendars();
        }
        prevMonth() {
            this.calendars[0].month--;
            this.adjustCalendars();
        }
        render(year, month, randId) {
            const now = new Date(), days = Datepicker._getDaysInMonth(year, month), data = [];
            let before = new Date(year, month, 1).getDay(), row = [];
            Datepicker._setToStartOfDay(now);
            if (this.options.firstDay > 0) {
                before -= this.options.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            const previousMonth = month === 0 ? 11 : month - 1, nextMonth = month === 11 ? 0 : month + 1, yearOfPreviousMonth = month === 0 ? year - 1 : year, yearOfNextMonth = month === 11 ? year + 1 : year, daysInPreviousMonth = Datepicker._getDaysInMonth(yearOfPreviousMonth, previousMonth);
            let cells = days + before, after = cells;
            while (after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            let isWeekSelected = false;
            for (let i = 0, r = 0; i < cells; i++) {
                const day = new Date(year, month, 1 + (i - before)), isToday = Datepicker._compareDates(day, now), hasEvent = this.options.events.indexOf(day.toDateString()) !== -1, isEmpty = i < before || i >= days + before, isStartRange = this.options.startRange && Datepicker._compareDates(this.options.startRange, day), isEndRange = this.options.endRange && Datepicker._compareDates(this.options.endRange, day), isInRange = this.options.startRange &&
                    this.options.endRange &&
                    this.options.startRange < day &&
                    day < this.options.endRange, isDisabled = (this.options.minDate && day < this.options.minDate) ||
                    (this.options.maxDate && day > this.options.maxDate) ||
                    (this.options.disableWeekends && Datepicker._isWeekend(day)) ||
                    (this.options.disableDayFn && this.options.disableDayFn(day)), isDateRangeStart = this.options.isDateRange && this.date && this.endDate && Datepicker._compareDates(this.date, day), isDateRangeEnd = this.options.isDateRange && this.endDate && Datepicker._compareDates(this.endDate, day), isDateRange = this.options.isDateRange &&
                    Datepicker._isDate(this.endDate) &&
                    Datepicker._compareWithinRange(day, this.date, this.endDate);
                let dayNumber = 1 + (i - before), monthNumber = month, yearNumber = year;
                let isSelected = false;
                if (Datepicker._isDate(this.date)) {
                    isSelected = Datepicker._compareDates(day, this.date);
                }
                if (!isSelected && Datepicker._isDate(this.endDate)) {
                    isSelected = Datepicker._compareDates(day, this.endDate);
                }
                if (this.options.isMultipleSelection &&
                    this.dates?.some((item) => item.getTime() === day.getTime())) {
                    isSelected = true;
                }
                if (isEmpty) {
                    if (i < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    }
                    else {
                        dayNumber = dayNumber - days;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }
                const dayConfig = {
                    day: dayNumber,
                    month: monthNumber,
                    year: yearNumber,
                    hasEvent: hasEvent,
                    isSelected: isSelected,
                    isToday: isToday,
                    isDisabled: isDisabled,
                    isEmpty: isEmpty,
                    isStartRange: isStartRange,
                    isEndRange: isEndRange,
                    isInRange: isInRange,
                    showDaysInNextAndPreviousMonths: this.options.showDaysInNextAndPreviousMonths,
                    isDateRangeStart: isDateRangeStart,
                    isDateRangeEnd: isDateRangeEnd,
                    isDateRange: isDateRange
                };
                row.push(this.renderDay(dayConfig));
                if (++r === 7) {
                    data.push(this.renderRow(row, this.options.isRTL, isWeekSelected));
                    row = [];
                    r = 0;
                    isWeekSelected = false;
                }
            }
            return this.renderTable(this.options, data, randId);
        }
        renderDay(opts) {
            const classMap = {
                isDisabled: 'is-disabled',
                isToday: 'is-today',
                isSelected: 'is-selected',
                hasEvent: 'has-event',
                isInRange: 'is-inrange',
                isStartRange: 'is-startrange',
                isEndRange: 'is-endrange',
                isDateRangeStart: 'is-daterange-start',
                isDateRangeEnd: 'is-daterange-end',
                isDateRange: 'is-daterange'
            }, ariaSelected = !(['isSelected', 'isDateRange'].filter((prop) => !!(opts.hasOwnProperty(prop) && opts[prop] === true)).length === 0), arr = ['datepicker-day'];
            if (opts.isEmpty) {
                if (opts.showDaysInNextAndPreviousMonths) {
                    arr.push('is-outside-current-month');
                    arr.push('is-selection-disabled');
                }
                else {
                    return '<td class="is-empty"></td>';
                }
            }
            for (const [property, className] of Object.entries(classMap)) {
                if (opts.hasOwnProperty(property) && opts[property]) {
                    arr.push(className);
                }
            }
            return (`<td data-day="${opts.day}" class="${arr.join(' ')}" aria-selected="${ariaSelected}">` +
                `<button class="datepicker-day-button" type="button" data-year="${opts.year}" data-month="${opts.month}" data-day="${opts.day}">${opts.day}</button>` +
                '</td>');
        }
        renderRow(days, isRTL, isRowSelected) {
            return ('<tr class="datepicker-row' +
                (isRowSelected ? ' is-selected' : '') +
                '">' +
                (isRTL ? days.reverse() : days).join('') +
                '</tr>');
        }
        renderTable(opts, data, randId) {
            return ('<div class="datepicker-table-wrapper"><table cellpadding="0" cellspacing="0" class="datepicker-table" role="grid" aria-labelledby="' +
                randId +
                '">' +
                this.renderHead(opts) +
                this.renderBody(data) +
                '</table></div>');
        }
        renderHead(opts) {
            const arr = [];
            let i;
            for (i = 0; i < 7; i++) {
                arr.push(`<th scope="col"><abbr title="${this.renderDayName(opts, i)}">${this.renderDayName(opts, i, true)}</abbr></th>`);
            }
            return '<thead><tr>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
        }
        renderBody(rows) {
            return '<tbody>' + rows.join('') + '</tbody>';
        }
        renderTitle(instance, c, year, month, refYear, randId) {
            const opts = this.options, isMinYear = year === opts.minYear, isMaxYear = year === opts.maxYear;
            let i, j, arr = [], html = '<div id="' +
                randId +
                '" class="datepicker-controls" role="heading" aria-live="assertive">', prev = true, next = true;
            for (i = 0; i < 12; i++) {
                arr.push('<option value="' +
                    (year === refYear ? i - c : 12 + i - c) +
                    '"' +
                    (i === month ? ' selected="selected"' : '') +
                    ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth)
                        ? 'disabled="disabled"'
                        : '') +
                    '>' +
                    opts.i18n.months[i] +
                    '</option>');
            }
            const monthHtml = '<select class="datepicker-select orig-select-month" tabindex="-1">' +
                arr.join('') +
                '</select>';
            if (Array.isArray(opts.yearRange)) {
                i = opts.yearRange[0];
                j = opts.yearRange[1] + 1;
            }
            else {
                i = year - opts.yearRange;
                j = 1 + year + opts.yearRange;
            }
            for (arr = []; i < j && i <= opts.maxYear; i++) {
                if (i >= opts.minYear) {
                    arr.push(`<option value="${i}" ${i === year ? 'selected="selected"' : ''}>${i}</option>`);
                }
            }
            if (opts.yearRangeReverse)
                arr.reverse();
            const yearHtml = `<select class="datepicker-select orig-select-year" tabindex="-1">${arr.join('')}</select>`;
            const leftArrow = '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg>';
            html += `<button class="month-prev${prev ? '' : ' is-disabled'
        // @todo remove button class and add scss mixin, current implementation temporary for focus states, @see https://github.com/materializecss/materialize/issues/566
        } btn" type="button">${leftArrow}</button>`;
            html += '<div class="selects-container">';
            if (opts.showMonthAfterYear) {
                html += yearHtml + monthHtml;
            }
            else {
                html += monthHtml + yearHtml;
            }
            html += '</div>';
            if (isMinYear && (month === 0 || opts.minMonth >= month)) {
                prev = false;
            }
            if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
                next = false;
            }
            const rightArrow = '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>';
            html += `<button class="month-next${next ? '' : ' is-disabled'
        // @todo remove button class and add scss mixin, current implementation temporary for focus states, @see https://github.com/materializecss/materialize/issues/566
        } btn" type="button">${rightArrow}</button>`;
            return (html += '</div>');
        }
        // refresh HTML
        draw() {
            const opts = this.options, minYear = opts.minYear, maxYear = opts.maxYear, minMonth = opts.minMonth, maxMonth = opts.maxMonth;
            let html = '';
            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }
            const randId = 'datepicker-title-' +
                Math.random()
                    .toString(36)
                    .replace(/[^a-z]+/g, '')
                    .substr(0, 2);
            for (let c = 0; c < 1; c++) {
                if (!this.options.isDateRange) {
                    this._renderDateDisplay(this.date);
                }
                else {
                    this._renderDateDisplay(this.date, this.endDate);
                }
                html +=
                    this.renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year, randId) + this.render(this.calendars[c].year, this.calendars[c].month, randId);
            }
            this.destroySelects();
            this.calendarEl.innerHTML = html;
            // Init Materialize Select
            const yearSelect = this.calendarEl.querySelector('.orig-select-year');
            const monthSelect = this.calendarEl.querySelector('.orig-select-month');
            // @todo fix accessibility @see https://github.com/materializecss/materialize/issues/522
            FormSelect.init(yearSelect, {
                classes: 'select-year',
                dropdownOptions: { container: document.body, constrainWidth: false }
            });
            FormSelect.init(monthSelect, {
                classes: 'select-month',
                dropdownOptions: { container: document.body, constrainWidth: false }
            });
            // Add change handlers for select
            yearSelect.addEventListener('change', this._handleYearChange);
            monthSelect.addEventListener('change', this._handleMonthChange);
            if (typeof this.options.onDraw === 'function') {
                this.options.onDraw.call(this);
            }
        }
        _setupEventHandlers() {
            this.el.addEventListener('click', this._handleInputClick);
            this.el.addEventListener('keydown', this._handleInputKeydown);
            this.el.addEventListener('change', this._handleInputChange);
            this.calendarEl.addEventListener('click', this._handleCalendarClick);
            /* this.doneBtn.addEventListener('click', this._confirm);
            this.cancelBtn.addEventListener('click', this._cancel);
        
            if (this.options.showClearBtn) {
              this.clearBtn.addEventListener('click', this._handleClearClick);
            }*/
        }
        _setupVariables() {
            const template = document.createElement('template');
            template.innerHTML = Datepicker._template.trim();
            this.containerEl = template.content.firstChild;
            this.calendarEl = this.containerEl.querySelector('.datepicker-calendar');
            this.yearTextEl = this.containerEl.querySelector('.year-text');
            this.dateTextEl = this.containerEl.querySelector('.date-text');
            /* if (this.options.showClearBtn) {
              this.clearBtn = this.containerEl.querySelector('.datepicker-clear');
            }
            this.doneBtn = this.containerEl.querySelector('.datepicker-done');
            this.cancelBtn = this.containerEl.querySelector('.datepicker-cancel');*/
            this.footer = this.containerEl.querySelector('.datepicker-footer');
            this.formats = {
                d: (date) => {
                    return date.getDate();
                },
                dd: (date) => {
                    const d = date.getDate();
                    return (d < 10 ? '0' : '') + d;
                },
                ddd: (date) => {
                    return this.options.i18n.weekdaysShort[date.getDay()];
                },
                dddd: (date) => {
                    return this.options.i18n.weekdays[date.getDay()];
                },
                m: (date) => {
                    return date.getMonth() + 1;
                },
                mm: (date) => {
                    const m = date.getMonth() + 1;
                    return (m < 10 ? '0' : '') + m;
                },
                mmm: (date) => {
                    return this.options.i18n.monthsShort[date.getMonth()];
                },
                mmmm: (date) => {
                    return this.options.i18n.months[date.getMonth()];
                },
                yy: (date) => {
                    return ('' + date.getFullYear()).slice(2);
                },
                yyyy: (date) => {
                    return date.getFullYear();
                }
            };
        }
        _removeEventHandlers() {
            this.el.removeEventListener('click', this._handleInputClick);
            this.el.removeEventListener('keydown', this._handleInputKeydown);
            this.el.removeEventListener('change', this._handleInputChange);
            this.calendarEl.removeEventListener('click', this._handleCalendarClick);
            if (this.options.isDateRange) {
                this.endDateEl.removeEventListener('click', this._handleInputClick);
                this.endDateEl.removeEventListener('keypress', this._handleInputKeydown);
                this.endDateEl.removeEventListener('change', this._handleInputChange);
            }
        }
        _handleInputClick = (e) => {
            // Prevents default browser datepicker modal rendering
            if (e.type == 'date') {
                e.preventDefault();
            }
            this.setDateFromInput(e.target);
            this.draw();
            this.gotoDate(e.target === this.el ? this.date : this.endDate);
            if (this.displayPlugin)
                this.displayPlugin.show();
            if (this.options.onInputInteraction)
                this.options.onInputInteraction.call(this);
        };
        _handleInputKeydown = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                e.preventDefault();
                this.setDateFromInput(e.target);
                this.draw();
                if (this.displayPlugin)
                    this.displayPlugin.show();
                if (this.options.onInputInteraction)
                    this.options.onInputInteraction.call(this);
            }
        };
        _handleCalendarClick = (e) => {
            const target = e.target;
            if (!target.classList.contains('is-disabled')) {
                if (target.classList.contains('datepicker-day-button') &&
                    !target.classList.contains('is-empty') &&
                    !target.parentElement.classList.contains('is-disabled')) {
                    const selectedDate = new Date(e.target.getAttribute('data-year'), e.target.getAttribute('data-month'), e.target.getAttribute('data-day'));
                    if (!this.multiple || (this.multiple && this.options.isMultipleSelection)) {
                        this.setDate(selectedDate);
                    }
                    if (this.options.isDateRange) {
                        this._handleDateRangeCalendarClick(selectedDate);
                    }
                    if (this.options.autoSubmit)
                        this._finishSelection();
                }
                else if (target.closest('.month-prev')) {
                    this.prevMonth();
                }
                else if (target.closest('.month-next')) {
                    this.nextMonth();
                }
            }
        };
        _handleDateRangeCalendarClick = (date) => {
            if (this.endDate == null || !Datepicker._compareDates(date, this.endDate)) {
                if (Datepicker._isDate(this.date) && Datepicker._comparePastDate(date, this.date)) {
                    return;
                }
                this.setDate(date, false, Datepicker._isDate(this.date));
                return;
            }
            this._clearDates();
            this.draw();
        };
        _handleClearClick = () => {
            this._clearDates();
            this.setInputValues();
        };
        _clearDates = () => {
            this.date = null;
            this.endDate = null;
            this.draw();
        };
        _handleMonthChange = (e) => {
            this.gotoMonth(e.target.value);
        };
        _handleYearChange = (e) => {
            this.gotoYear(e.target.value);
        };
        // change view to a specific month (zero-index, e.g. 0: January)
        gotoMonth(month) {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        }
        // change view to a specific full year (e.g. "2012")
        gotoYear(year) {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        }
        _handleInputChange = (e) => {
            let date;
            const el = e.target;
            // Prevent change event from being fired when triggered by the plugin
            if (e['detail']?.firedBy === this)
                return;
            // Prevent change event from being fired if an end date is set without a start date
            if (el == this.endDateEl && !this.date)
                return;
            if (this.options.parse) {
                date = this.options.parse(e.target.value, typeof this.options.format === 'function'
                    ? this.options.format(new Date(this.el.value))
                    : this.options.format);
            }
            else {
                date = new Date(Date.parse(e.target.value));
            }
            if (Datepicker._isDate(date)) {
                this.setDate(date, false, el == this.endDateEl, true);
                if (e.type == 'date') {
                    this.setDataDate(e, date);
                    this.setInputValues();
                }
            }
        };
        renderDayName(opts, day, abbr = false) {
            day += opts.firstDay;
            while (day >= 7) {
                day -= 7;
            }
            return abbr ? opts.i18n.weekdaysAbbrev[day] : opts.i18n.weekdays[day];
        }
        createDateInput() {
            const dateInput = this.el.cloneNode(true);
            dateInput.addEventListener('click', this._handleInputClick);
            dateInput.addEventListener('keypress', this._handleInputKeydown);
            dateInput.addEventListener('change', this._handleInputChange);
            this.el.parentElement.appendChild(dateInput);
            return dateInput;
        }
        // Set input value to the selected date and close Datepicker
        _finishSelection = () => {
            this.setInputValues();
            // Commented out because of function deprecations
            // this.close();
        };
        _confirm = () => {
            this._finishSelection();
            if (typeof this.options.onConfirm === 'function')
                this.options.onConfirm.call(this);
        };
        _cancel = () => {
            if (typeof this.options.onCancel === 'function')
                this.options.onCancel.call(this);
        };
        // deprecated
        open() {
            console.warn('Datepicker.open() is deprecated. Remove this method and wrap in modal yourself.');
            return this;
        }
        close() {
            console.warn('Datepicker.close() is deprecated. Remove this method and wrap in modal yourself.');
            return this;
        }
        static {
            Datepicker._template = `
        <div class="datepicker-container">
          <div class="datepicker-date-display">
            <span class="year-text"></span>
            <span class="date-text"></span>
          </div>
          <div class="datepicker-calendar-container">
            <div class="datepicker-calendar"></div>
            <div class="datepicker-footer">
              <!--<button class="btn-flat datepicker-clear waves-effect" style="visibility: hidden;" type="button"></button>
              <div class="confirmation-btns">
                <button class="btn-flat datepicker-cancel waves-effect" type="button"></button>
                <button class="btn-flat datepicker-done waves-effect" type="button"></button>
              </div>-->
            </div>
          </div>
        </div>`;
        }
    }

    class Forms {
        /**
         * Checks if the label has validation and apply
         * the correct class and styles
         * @param textfield
         */
        static validateField(textfield) {
            if (!textfield) {
                console.error('No text field element found');
                return;
            }
            const hasLength = textfield.getAttribute('data-length') !== null;
            const lenAttr = parseInt(textfield.getAttribute('data-length'));
            const len = textfield.value.length;
            if (len === 0 &&
                textfield.validity.badInput === false &&
                !textfield.required &&
                textfield.classList.contains('validate')) {
                textfield.classList.remove('invalid');
            }
            else if (textfield.classList.contains('validate')) {
                // Check for character counter attributes
                if ((textfield.validity.valid && hasLength && len <= lenAttr) ||
                    (textfield.validity.valid && !hasLength)) {
                    textfield.classList.remove('invalid');
                }
                else {
                    textfield.classList.add('invalid');
                }
            }
        }
        /**
         * Resizes the given TextArea after updating the
         *  value content dynamically.
         * @param e EventTarget
         */
        static textareaAutoResize(e) {
            const textarea = e;
            // if (!textarea) {
            //   console.error('No textarea element found');
            //   return;
            // }
            // Textarea Auto Resize
            let hiddenDiv = document.querySelector('.hiddendiv');
            if (!hiddenDiv) {
                hiddenDiv = document.createElement('div');
                hiddenDiv.classList.add('hiddendiv', 'common');
                document.body.append(hiddenDiv);
            }
            const style = getComputedStyle(textarea);
            // Set font properties of hiddenDiv
            const fontFamily = style.fontFamily; //textarea.css('font-family');
            const fontSize = style.fontSize; //textarea.css('font-size');
            const lineHeight = style.lineHeight; //textarea.css('line-height');
            // Firefox can't handle padding shorthand.
            const paddingTop = style.paddingTop; //getComputedStyle(textarea).css('padding-top');
            const paddingRight = style.paddingRight; //textarea.css('padding-right');
            const paddingBottom = style.paddingBottom; //textarea.css('padding-bottom');
            const paddingLeft = style.paddingLeft; //textarea.css('padding-left');
            if (fontSize)
                hiddenDiv.style.fontSize = fontSize; //('font-size', fontSize);
            if (fontFamily)
                hiddenDiv.style.fontFamily = fontFamily; //css('font-family', fontFamily);
            if (lineHeight)
                hiddenDiv.style.lineHeight = lineHeight; //css('line-height', lineHeight);
            if (paddingTop)
                hiddenDiv.style.paddingTop = paddingTop; //ss('padding-top', paddingTop);
            if (paddingRight)
                hiddenDiv.style.paddingRight = paddingRight; //css('padding-right', paddingRight);
            if (paddingBottom)
                hiddenDiv.style.paddingBottom = paddingBottom; //css('padding-bottom', paddingBottom);
            if (paddingLeft)
                hiddenDiv.style.paddingLeft = paddingLeft; //css('padding-left', paddingLeft);
            // Set original-height, if none
            if (!textarea.hasAttribute('original-height'))
                textarea.setAttribute('original-height', textarea.getBoundingClientRect().height.toString());
            if (textarea.getAttribute('wrap') === 'off') {
                hiddenDiv.style.overflowWrap = 'normal'; // ('overflow-wrap', 'normal')
                hiddenDiv.style.whiteSpace = 'pre'; //.css('white-space', 'pre');
            }
            hiddenDiv.innerText = textarea.value + '\n';
            hiddenDiv.innerHTML = hiddenDiv.innerHTML.replace(/\n/g, '<br>');
            // When textarea is hidden, width goes crazy.
            // Approximate with half of window size
            if (textarea.offsetWidth > 0 && textarea.offsetHeight > 0) {
                hiddenDiv.style.width = textarea.getBoundingClientRect().width + 'px'; // ('width', textarea.width() + 'px');
            }
            else {
                hiddenDiv.style.width = window.innerWidth / 2 + 'px'; //css('width', window.innerWidth / 2 + 'px');
            }
            // Resize if the new height is greater than the
            // original height of the textarea
            const originalHeight = parseInt(textarea.getAttribute('original-height'));
            const prevLength = parseInt(textarea.getAttribute('previous-length'));
            if (isNaN(originalHeight))
                return;
            if (originalHeight <= hiddenDiv.clientHeight) {
                textarea.style.height = hiddenDiv.clientHeight + 'px'; //css('height', hiddenDiv.innerHeight() + 'px');
            }
            else if (textarea.value.length < prevLength) {
                // In case the new height is less than original height, it
                // means the textarea has less text than before
                // So we set the height to the original one
                textarea.style.height = originalHeight + 'px';
            }
            textarea.setAttribute('previous-length', (textarea.value || '').length.toString());
        }
        static Init() {
            if (typeof document !== 'undefined')
                document?.addEventListener('DOMContentLoaded', () => {
                    document.addEventListener('change', (e) => {
                        const target = e.target;
                        if (target instanceof HTMLInputElement) {
                            if (target.value.length !== 0 || target.getAttribute('placeholder') !== null) {
                                for (const child of target.parentNode.children) {
                                    if (child.tagName == 'label') {
                                        child.classList.add('active');
                                    }
                                }
                            }
                            Forms.validateField(target);
                        }
                    });
                    document.addEventListener('keyup', (e) => {
                        const target = e.target;
                        // Radio and Checkbox focus class
                        if (target instanceof HTMLInputElement && ['radio', 'checkbox'].includes(target.type)) {
                            // TAB, check if tabbing to radio or checkbox.
                            if (Utils.keys.TAB.includes(e.key)) {
                                target.classList.add('tabbed');
                                target.addEventListener('blur', () => target.classList.remove('tabbed'), {
                                    once: true
                                });
                            }
                        }
                    });
                    document
                        .querySelectorAll('.materialize-textarea')
                        .forEach((textArea) => {
                        Forms.InitTextarea(textArea);
                    });
                    // File Input Path
                    document
                        .querySelectorAll('.file-field input[type="file"]')
                        .forEach((fileInput) => {
                        Forms.InitFileInputPath(fileInput);
                    });
                });
        }
        static InitTextarea(textarea) {
            // Save Data in Element
            textarea.setAttribute('original-height', textarea.getBoundingClientRect().height.toString());
            textarea.setAttribute('previous-length', (textarea.value || '').length.toString());
            Forms.textareaAutoResize(textarea);
            textarea.addEventListener('keyup', (e) => Forms.textareaAutoResize(e.target));
            textarea.addEventListener('keydown', (e) => Forms.textareaAutoResize(e.target));
        }
        static InitFileInputPath(fileInput) {
            fileInput.addEventListener('change', () => {
                const fileField = fileInput.closest('.file-field');
                const pathInput = fileField.querySelector('input.file-path');
                const files = fileInput.files;
                const filenames = [];
                for (let i = 0; i < files.length; i++) {
                    filenames.push(files[i].name);
                }
                pathInput.value = filenames.join(', ');
                pathInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
            });
        }
    }

    const _defaults$d = {
        inDuration: 275,
        outDuration: 200,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null
    };
    class Materialbox extends Component {
        /** If the materialbox overlay is showing. */
        overlayActive;
        /** If the materialbox is no longer being animated. */
        doneAnimating;
        /** Caption, if specified. */
        caption;
        /** Original width of image. */
        originalWidth;
        /** Original height of image. */
        originalHeight;
        originInlineStyles;
        placeholder;
        _changedAncestorList;
        newHeight;
        newWidth;
        windowWidth;
        windowHeight;
        attrWidth;
        attrHeight;
        _overlay;
        _photoCaption;
        constructor(el, options) {
            super(el, options, Materialbox);
            this.el['M_Materialbox'] = this;
            this.options = {
                ...Materialbox.defaults,
                ...options
            };
            this.overlayActive = false;
            this.doneAnimating = true;
            this.placeholder = document.createElement('div');
            this.placeholder.classList.add('material-placeholder');
            this.originalWidth = 0;
            this.originalHeight = 0;
            this.originInlineStyles = this.el.getAttribute('style');
            this.caption = this.el.getAttribute('data-caption') || '';
            this.el.tabIndex = 0;
            // Wrap
            this.el.before(this.placeholder);
            this.placeholder.append(this.el);
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$d;
        }
        /**
         * Initializes instances of MaterialBox.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Materialbox);
        }
        static getInstance(el) {
            return el['M_Materialbox'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['M_Materialbox'] = undefined;
            // Unwrap image
            //this.placeholder.after(this.el).remove();
            this.placeholder.remove();
            this.el.removeAttribute('style');
        }
        _setupEventHandlers() {
            this.el.addEventListener('click', this._handleMaterialboxClick);
            this.el.addEventListener('keypress', this._handleMaterialboxKeypress);
        }
        _removeEventHandlers() {
            this.el.removeEventListener('click', this._handleMaterialboxClick);
            this.el.removeEventListener('keypress', this._handleMaterialboxKeypress);
        }
        _handleMaterialboxClick = () => {
            this._handleMaterialboxToggle();
        };
        _handleMaterialboxKeypress = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleMaterialboxToggle();
            }
        };
        _handleMaterialboxToggle = () => {
            // If already modal, return to original
            if (this.doneAnimating === false || (this.overlayActive && this.doneAnimating))
                this.close();
            else
                this.open();
        };
        _handleWindowScroll = () => {
            if (this.overlayActive)
                this.close();
        };
        _handleWindowResize = () => {
            if (this.overlayActive)
                this.close();
        };
        _handleWindowEscape = (e) => {
            if (Utils.keys.ESC.includes(e.key) && this.doneAnimating && this.overlayActive)
                this.close();
        };
        _makeAncestorsOverflowVisible() {
            this._changedAncestorList = [];
            let ancestor = this.placeholder.parentNode;
            while (ancestor !== null && ancestor !== document) {
                const curr = ancestor;
                if (curr.style.overflow !== 'visible') {
                    curr.style.overflow = 'visible';
                    this._changedAncestorList.push(curr);
                }
                ancestor = ancestor.parentNode;
            }
        }
        _offset(el) {
            const box = el.getBoundingClientRect();
            const docElem = document.documentElement;
            return {
                top: box.top + window.scrollY - docElem.clientTop,
                left: box.left + window.scrollX - docElem.clientLeft
            };
        }
        _updateVars() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.caption = this.el.getAttribute('data-caption') || '';
        }
        // Image
        _animateImageIn() {
            this.el.style.maxHeight = this.newHeight.toString() + 'px';
            this.el.style.maxWidth = this.newWidth.toString() + 'px';
            const duration = this.options.inDuration;
            // from
            this.el.style.transition = 'none';
            this.el.style.height = this.originalHeight + 'px';
            this.el.style.width = this.originalWidth + 'px';
            setTimeout(() => {
                // easeOutQuad
                this.el.style.transition = `height ${duration}ms ease,
        width ${duration}ms ease,
        left ${duration}ms ease,
        top ${duration}ms ease
      `;
                // to
                this.el.style.height = this.newHeight + 'px';
                this.el.style.width = this.newWidth + 'px';
                this.el.style.left =
                    Utils.getDocumentScrollLeft() +
                        this.windowWidth / 2 -
                        this._offset(this.placeholder).left -
                        this.newWidth / 2 +
                        'px';
                this.el.style.top =
                    Utils.getDocumentScrollTop() +
                        this.windowHeight / 2 -
                        this._offset(this.placeholder).top -
                        this.newHeight / 2 +
                        'px';
            }, 1);
            setTimeout(() => {
                this.doneAnimating = true;
                if (typeof this.options.onOpenEnd === 'function')
                    this.options.onOpenEnd.call(this, this.el);
            }, duration);
            /*
            anim({
              targets: this.el, // image
              height: [this.originalHeight, this.newHeight],
              width: [this.originalWidth, this.newWidth],
              left:
                Utils.getDocumentScrollLeft() +
                this.windowWidth / 2 -
                this._offset(this.placeholder).left -
                this.newWidth / 2,
              top:
                Utils.getDocumentScrollTop() +
                this.windowHeight / 2 -
                this._offset(this.placeholder).top -
                this.newHeight / 2,
        
              duration: this.options.inDuration,
              easing: 'easeOutQuad',
              complete: () => {
                this.doneAnimating = true;
                if (typeof this.options.onOpenEnd === 'function') this.options.onOpenEnd.call(this, this.el);
              }
            });
            */
        }
        _animateImageOut() {
            const duration = this.options.outDuration;
            // easeOutQuad
            this.el.style.transition = `height ${duration}ms ease,
      width ${duration}ms ease,
      left ${duration}ms ease,
      top ${duration}ms ease
    `;
            // to
            this.el.style.height = this.originalWidth + 'px';
            this.el.style.width = this.originalWidth + 'px';
            this.el.style.left = '0';
            this.el.style.top = '0';
            setTimeout(() => {
                this.placeholder.style.height = '';
                this.placeholder.style.width = '';
                this.placeholder.style.position = '';
                this.placeholder.style.top = '';
                this.placeholder.style.left = '';
                // Revert to width or height attribute
                if (this.attrWidth)
                    this.el.setAttribute('width', this.attrWidth.toString());
                if (this.attrHeight)
                    this.el.setAttribute('height', this.attrHeight.toString());
                this.el.removeAttribute('style');
                if (this.originInlineStyles)
                    this.el.setAttribute('style', this.originInlineStyles);
                // Remove class
                this.el.classList.remove('active');
                this.doneAnimating = true;
                // Remove overflow overrides on ancestors
                this._changedAncestorList.forEach((anchestor) => (anchestor.style.overflow = ''));
                // onCloseEnd callback
                if (typeof this.options.onCloseEnd === 'function')
                    this.options.onCloseEnd.call(this, this.el);
            }, duration);
        }
        // Caption
        _addCaption() {
            this._photoCaption = document.createElement('div');
            this._photoCaption.classList.add('materialbox-caption');
            this._photoCaption.innerText = this.caption;
            document.body.append(this._photoCaption);
            this._photoCaption.style.display = 'inline';
            // Animate
            this._photoCaption.style.transition = 'none';
            this._photoCaption.style.opacity = '0';
            const duration = this.options.inDuration;
            setTimeout(() => {
                this._photoCaption.style.transition = `opacity ${duration}ms ease`;
                this._photoCaption.style.opacity = '1';
            }, 1);
        }
        _removeCaption() {
            const duration = this.options.outDuration;
            this._photoCaption.style.transition = `opacity ${duration}ms ease`;
            this._photoCaption.style.opacity = '0';
            setTimeout(() => {
                this._photoCaption.remove();
            }, duration);
        }
        // Overlay
        _addOverlay() {
            this._overlay = document.createElement('div');
            this._overlay.id = 'materialbox-overlay';
            this._overlay.addEventListener('click', () => {
                if (this.doneAnimating)
                    this.close();
            }, { once: true });
            // Put before in origin image to preserve z-index layering.
            this.el.before(this._overlay);
            // Set dimensions if needed
            const overlayOffset = this._overlay.getBoundingClientRect();
            this._overlay.style.width = this.windowWidth + 'px';
            this._overlay.style.height = this.windowHeight + 'px';
            this._overlay.style.left = -1 * overlayOffset.left + 'px';
            this._overlay.style.top = -1 * overlayOffset.top + 'px';
            // Animate
            this._overlay.style.transition = 'none';
            this._overlay.style.opacity = '0';
            const duration = this.options.inDuration;
            setTimeout(() => {
                this._overlay.style.transition = `opacity ${duration}ms ease`;
                this._overlay.style.opacity = '1';
            }, 1);
        }
        _removeOverlay() {
            const duration = this.options.outDuration;
            this._overlay.style.transition = `opacity ${duration}ms ease`;
            this._overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlayActive = false;
                this._overlay.remove();
            }, duration);
        }
        /**
         * Open materialbox.
         */
        open = () => {
            this._updateVars();
            this.originalWidth = this.el.getBoundingClientRect().width;
            this.originalHeight = this.el.getBoundingClientRect().height;
            // Set states
            this.doneAnimating = false;
            this.el.classList.add('active');
            this.overlayActive = true;
            // onOpenStart callback
            if (typeof this.options.onOpenStart === 'function')
                this.options.onOpenStart.call(this, this.el);
            // Set positioning for placeholder
            this.placeholder.style.width = this.placeholder.getBoundingClientRect().width + 'px';
            this.placeholder.style.height = this.placeholder.getBoundingClientRect().height + 'px';
            this.placeholder.style.position = 'relative';
            this.placeholder.style.top = '0';
            this.placeholder.style.left = '0';
            this._makeAncestorsOverflowVisible();
            // Set css on origin
            this.el.style.position = 'absolute';
            this.el.style.zIndex = '1000';
            this.el.style.willChange = 'left, top, width, height';
            // Change from width or height attribute to css
            this.attrWidth = this.el.getAttribute('width');
            this.attrHeight = this.el.getAttribute('height');
            if (this.attrWidth) {
                this.el.style.width = this.attrWidth + 'px';
                this.el.removeAttribute('width');
            }
            if (this.attrHeight) {
                this.el.style.width = this.attrHeight + 'px';
                this.el.removeAttribute('height');
            }
            this._addOverlay();
            // Add and animate caption if it exists
            if (this.caption !== '')
                this._addCaption();
            // Resize Image
            const widthPercent = this.originalWidth / this.windowWidth;
            const heightPercent = this.originalHeight / this.windowHeight;
            this.newWidth = 0;
            this.newHeight = 0;
            if (widthPercent > heightPercent) {
                // Width first
                const ratio = this.originalHeight / this.originalWidth;
                this.newWidth = this.windowWidth * 0.9;
                this.newHeight = this.windowWidth * 0.9 * ratio;
            }
            else {
                // Height first
                const ratio = this.originalWidth / this.originalHeight;
                this.newWidth = this.windowHeight * 0.9 * ratio;
                this.newHeight = this.windowHeight * 0.9;
            }
            this._animateImageIn();
            // Handle Exit triggers
            window.addEventListener('scroll', this._handleWindowScroll);
            window.addEventListener('resize', this._handleWindowResize);
            window.addEventListener('keyup', this._handleWindowEscape);
        };
        /**
         * Close materialbox.
         */
        close = () => {
            this._updateVars();
            this.doneAnimating = false;
            // onCloseStart callback
            if (typeof this.options.onCloseStart === 'function')
                this.options.onCloseStart.call(this, this.el);
            //anim.remove(this.el);
            //anim.remove(this._overlay);
            //if (this.caption !== '') anim.remove(this._photoCaption);
            // disable exit handlers
            window.removeEventListener('scroll', this._handleWindowScroll);
            window.removeEventListener('resize', this._handleWindowResize);
            window.removeEventListener('keyup', this._handleWindowEscape);
            this._removeOverlay();
            this._animateImageOut();
            if (this.caption !== '')
                this._removeCaption();
        };
    }

    const _defaults$c = {
        opacity: 0.5,
        inDuration: 250,
        outDuration: 250,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        preventScrolling: true,
        dismissible: true,
        startingTop: '4%',
        endingTop: '10%'
    };
    class Modal extends Component {
        constructor(el, options) {
            super(el, options, Modal);
            this.el['M_Modal'] = this;
            this.options = {
                ...Modal.defaults,
                ...options
            };
            this.el.tabIndex = 0;
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$c;
        }
        static init(els, options = {}) {
            return super.init(els, options, Modal);
        }
        static getInstance(el) {
            return el['M_Modal'];
        }
        destroy() { }
        _setupEventHandlers() { }
        _removeEventHandlers() { }
        _handleTriggerClick() { }
        _handleOverlayClick() { }
        _handleModalCloseClick() { }
        _handleKeydown() { }
        _handleFocus() { }
        open() {
            return this;
        }
        close() {
            return this;
        }
        // Experimental!
        static #createHtml(config) {
            return `<dialog id="modal1" class="modal">
      ${config.header ? '<div class="modal-header">' + config.header + '</div>' : ''}
      <div class="modal-content">
        ${config.content}
      </div>
      ${config.header ? '<div class="modal-footer">' + config.footer + '</div>' : ''}
    </dialog>`;
        }
        static #createHtmlElement(config) {
            const dialog = document.createElement('dialog');
            dialog.id = config.id;
            return dialog;
        }
        static create(config) {
            return this.#createHtmlElement(config);
        }
        static { }
    }

    const _defaults$b = {
        responsiveThreshold: 0 // breakpoint for swipeable
    };
    class Parallax extends Component {
        _enabled;
        _img;
        static _parallaxes = [];
        static _handleScrollThrottled;
        static _handleWindowResizeThrottled;
        constructor(el, options) {
            super(el, options, Parallax);
            this.el['M_Parallax'] = this;
            this.options = {
                ...Parallax.defaults,
                ...options
            };
            this._enabled = window.innerWidth > this.options.responsiveThreshold;
            this._img = this.el.querySelector('img');
            this._updateParallax();
            this._setupEventHandlers();
            this._setupStyles();
            Parallax._parallaxes.push(this);
        }
        static get defaults() {
            return _defaults$b;
        }
        /**
         * Initializes instances of Parallax.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Parallax);
        }
        static getInstance(el) {
            return el['M_Parallax'];
        }
        destroy() {
            Parallax._parallaxes.splice(Parallax._parallaxes.indexOf(this), 1);
            this._img.style.transform = '';
            this._removeEventHandlers();
            this.el['M_Parallax'] = undefined;
        }
        static _handleScroll() {
            for (let i = 0; i < Parallax._parallaxes.length; i++) {
                const parallaxInstance = Parallax._parallaxes[i];
                parallaxInstance._updateParallax.call(parallaxInstance);
            }
        }
        static _handleWindowResize() {
            for (let i = 0; i < Parallax._parallaxes.length; i++) {
                const parallaxInstance = Parallax._parallaxes[i];
                parallaxInstance._enabled = window.innerWidth > parallaxInstance.options.responsiveThreshold;
            }
        }
        _setupEventHandlers() {
            this._img.addEventListener('load', this._handleImageLoad);
            if (Parallax._parallaxes.length === 0) {
                if (!Parallax._handleScrollThrottled) {
                    Parallax._handleScrollThrottled = Utils.throttle(Parallax._handleScroll, 5);
                }
                if (!Parallax._handleWindowResizeThrottled) {
                    Parallax._handleWindowResizeThrottled = Utils.throttle(Parallax._handleWindowResize, 5);
                }
                window.addEventListener('scroll', Parallax._handleScrollThrottled);
                window.addEventListener('resize', Parallax._handleWindowResizeThrottled);
            }
        }
        _removeEventHandlers() {
            this._img.removeEventListener('load', this._handleImageLoad);
            if (Parallax._parallaxes.length === 0) {
                window.removeEventListener('scroll', Parallax._handleScrollThrottled);
                window.removeEventListener('resize', Parallax._handleWindowResizeThrottled);
            }
        }
        _setupStyles() {
            this._img.style.opacity = '1';
        }
        _handleImageLoad = () => {
            this._updateParallax();
        };
        _offset(el) {
            const box = el.getBoundingClientRect();
            const docElem = document.documentElement;
            return {
                top: box.top + window.scrollY - docElem.clientTop,
                left: box.left + window.scrollX - docElem.clientLeft
            };
        }
        _updateParallax() {
            const containerHeight = this.el.getBoundingClientRect().height > 0 ? this.el.parentElement.offsetHeight : 500;
            const imgHeight = this._img.offsetHeight;
            const parallaxDist = imgHeight - containerHeight;
            const bottom = this._offset(this.el).top + containerHeight;
            const top = this._offset(this.el).top;
            const scrollTop = Utils.getDocumentScrollTop();
            const windowHeight = window.innerHeight;
            const windowBottom = scrollTop + windowHeight;
            const percentScrolled = (windowBottom - top) / (containerHeight + windowHeight);
            const parallax = parallaxDist * percentScrolled;
            if (!this._enabled) {
                this._img.style.transform = '';
            }
            else if (bottom > scrollTop && top < scrollTop + windowHeight) {
                this._img.style.transform = `translate3D(-50%, ${parallax}px, 0)`;
            }
        }
    }

    const _defaults$a = {
        top: 0,
        bottom: Infinity,
        offset: 0,
        onPositionChange: null
    };
    class Pushpin extends Component {
        static _pushpins;
        originalOffset;
        constructor(el, options) {
            super(el, options, Pushpin);
            this.el['M_Pushpin'] = this;
            this.options = {
                ...Pushpin.defaults,
                ...options
            };
            this.originalOffset = this.el.offsetTop;
            Pushpin._pushpins.push(this);
            this._setupEventHandlers();
            this._updatePosition();
        }
        static get defaults() {
            return _defaults$a;
        }
        /**
         * Initializes instances of Pushpin.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Pushpin);
        }
        static getInstance(el) {
            return el['M_Pushpin'];
        }
        destroy() {
            this.el.style.top = null;
            this._removePinClasses();
            // Remove pushpin Inst
            const index = Pushpin._pushpins.indexOf(this);
            Pushpin._pushpins.splice(index, 1);
            if (Pushpin._pushpins.length === 0) {
                this._removeEventHandlers();
            }
            this.el['M_Pushpin'] = undefined;
        }
        static _updateElements() {
            for (const elIndex in Pushpin._pushpins) {
                const pInstance = Pushpin._pushpins[elIndex];
                pInstance._updatePosition();
            }
        }
        _setupEventHandlers() {
            document.addEventListener('scroll', Pushpin._updateElements);
        }
        _removeEventHandlers() {
            document.removeEventListener('scroll', Pushpin._updateElements);
        }
        _updatePosition() {
            const scrolled = Utils.getDocumentScrollTop() + this.options.offset;
            if (this.options.top <= scrolled &&
                this.options.bottom >= scrolled &&
                !this.el.classList.contains('pinned')) {
                this._removePinClasses();
                this.el.style.top = `${this.options.offset}px`;
                this.el.classList.add('pinned');
                // onPositionChange callback
                if (typeof this.options.onPositionChange === 'function') {
                    this.options.onPositionChange.call(this, 'pinned');
                }
            }
            // Add pin-top (when scrolled position is above top)
            if (scrolled < this.options.top && !this.el.classList.contains('pin-top')) {
                this._removePinClasses();
                this.el.style.top = '0';
                this.el.classList.add('pin-top');
                // onPositionChange callback
                if (typeof this.options.onPositionChange === 'function') {
                    this.options.onPositionChange.call(this, 'pin-top');
                }
            }
            // Add pin-bottom (when scrolled position is below bottom)
            if (scrolled > this.options.bottom && !this.el.classList.contains('pin-bottom')) {
                this._removePinClasses();
                this.el.classList.add('pin-bottom');
                this.el.style.top = `${this.options.bottom - this.originalOffset}px`;
                // onPositionChange callback
                if (typeof this.options.onPositionChange === 'function') {
                    this.options.onPositionChange.call(this, 'pin-bottom');
                }
            }
        }
        _removePinClasses() {
            // IE 11 bug (can't remove multiple classes in one line)
            this.el.classList.remove('pin-top');
            this.el.classList.remove('pinned');
            this.el.classList.remove('pin-bottom');
        }
        static {
            Pushpin._pushpins = [];
        }
    }

    const _defaults$9 = {
        throttle: 100,
        scrollOffset: 200, // offset - 200 allows elements near bottom of page to scroll
        activeClass: 'active',
        getActiveElement: (id) => {
            return 'a[href="#' + id + '"]';
        },
        keepTopElementActive: false,
        animationDuration: null
    };
    class ScrollSpy extends Component {
        static _elements;
        static _count;
        static _increment;
        static _elementsInView;
        static _visibleElements;
        static _ticks;
        static _keptTopActiveElement = null;
        tickId;
        id;
        constructor(el, options) {
            super(el, options, ScrollSpy);
            this.el['M_ScrollSpy'] = this;
            this.options = {
                ...ScrollSpy.defaults,
                ...options
            };
            ScrollSpy._elements.push(this);
            ScrollSpy._count++;
            ScrollSpy._increment++;
            this.tickId = -1;
            this.id = ScrollSpy._increment.toString();
            this._setupEventHandlers();
            this._handleWindowScroll();
        }
        static get defaults() {
            return _defaults$9;
        }
        /**
         * Initializes instances of ScrollSpy.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, ScrollSpy);
        }
        static getInstance(el) {
            return el['M_ScrollSpy'];
        }
        destroy() {
            ScrollSpy._elements.splice(ScrollSpy._elements.indexOf(this), 1);
            ScrollSpy._elementsInView.splice(ScrollSpy._elementsInView.indexOf(this), 1);
            ScrollSpy._visibleElements.splice(ScrollSpy._visibleElements.indexOf(this.el), 1);
            ScrollSpy._count--;
            this._removeEventHandlers();
            const actElem = document.querySelector(this.options.getActiveElement(this.el.id));
            actElem.classList.remove(this.options.activeClass);
            this.el['M_ScrollSpy'] = undefined;
        }
        _setupEventHandlers() {
            if (ScrollSpy._count === 1) {
                window.addEventListener('scroll', this._handleWindowScroll);
                window.addEventListener('resize', this._handleThrottledResize);
                document.body.addEventListener('click', this._handleTriggerClick);
            }
        }
        _removeEventHandlers() {
            if (ScrollSpy._count === 0) {
                window.removeEventListener('scroll', this._handleWindowScroll);
                window.removeEventListener('resize', this._handleThrottledResize);
                document.body.removeEventListener('click', this._handleTriggerClick);
            }
        }
        _handleThrottledResize = () => Utils.throttle(this._handleWindowScroll, 200).bind(this);
        _handleTriggerClick = (e) => {
            const trigger = e.target;
            for (let i = ScrollSpy._elements.length - 1; i >= 0; i--) {
                const scrollspy = ScrollSpy._elements[i];
                const x = document.querySelector('a[href="#' + scrollspy.el.id + '"]');
                if (trigger === x) {
                    e.preventDefault();
                    if (scrollspy.el['M_ScrollSpy'].options.animationDuration) {
                        ScrollSpy._smoothScrollIntoView(scrollspy.el, scrollspy.el['M_ScrollSpy'].options.animationDuration);
                    }
                    else {
                        scrollspy.el.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                }
            }
        };
        _handleWindowScroll = () => {
            // unique tick id
            ScrollSpy._ticks++;
            // viewport rectangle
            const top = Utils.getDocumentScrollTop(), left = Utils.getDocumentScrollLeft(), right = left + window.innerWidth, bottom = top + window.innerHeight;
            // determine which elements are in view
            const intersections = ScrollSpy._findElements(top, right, bottom, left);
            for (let i = 0; i < intersections.length; i++) {
                const scrollspy = intersections[i];
                const lastTick = scrollspy.tickId;
                if (lastTick < 0) {
                    // entered into view
                    scrollspy._enter();
                }
                // update tick id
                scrollspy.tickId = ScrollSpy._ticks;
            }
            for (let i = 0; i < ScrollSpy._elementsInView.length; i++) {
                const scrollspy = ScrollSpy._elementsInView[i];
                const lastTick = scrollspy.tickId;
                if (lastTick >= 0 && lastTick !== ScrollSpy._ticks) {
                    // exited from view
                    scrollspy._exit();
                    scrollspy.tickId = -1;
                }
            }
            // remember elements in view for next tick
            ScrollSpy._elementsInView = intersections;
            if (ScrollSpy._elements.length) {
                const options = ScrollSpy._elements[0].el['M_ScrollSpy'].options;
                if (options.keepTopElementActive && ScrollSpy._visibleElements.length === 0) {
                    this._resetKeptTopActiveElementIfNeeded();
                    const topElements = ScrollSpy._elements
                        .filter((value) => ScrollSpy._getDistanceToViewport(value.el) <= 0)
                        .sort((a, b) => {
                        const distanceA = ScrollSpy._getDistanceToViewport(a.el);
                        const distanceB = ScrollSpy._getDistanceToViewport(b.el);
                        if (distanceA < distanceB)
                            return -1;
                        if (distanceA > distanceB)
                            return 1;
                        return 0;
                    });
                    const nearestTopElement = topElements.length
                        ? topElements[topElements.length - 1]
                        : ScrollSpy._elements[0];
                    const actElem = document.querySelector(options.getActiveElement(nearestTopElement.el.id));
                    actElem?.classList.add(options.activeClass);
                    ScrollSpy._keptTopActiveElement = actElem;
                }
            }
        };
        static _offset(el) {
            const box = el.getBoundingClientRect();
            const docElem = document.documentElement;
            return {
                top: box.top + window.pageYOffset - docElem.clientTop,
                left: box.left + window.pageXOffset - docElem.clientLeft
            };
        }
        static _findElements(top, right, bottom, left) {
            const hits = [];
            for (let i = 0; i < ScrollSpy._elements.length; i++) {
                const scrollspy = ScrollSpy._elements[i];
                const currTop = top + scrollspy.options.scrollOffset || 200;
                if (scrollspy.el.getBoundingClientRect().height > 0) {
                    const elTop = ScrollSpy._offset(scrollspy.el).top, elLeft = ScrollSpy._offset(scrollspy.el).left, elRight = elLeft + scrollspy.el.getBoundingClientRect().width, elBottom = elTop + scrollspy.el.getBoundingClientRect().height;
                    const isIntersect = !(elLeft > right ||
                        elRight < left ||
                        elTop > bottom ||
                        elBottom < currTop);
                    if (isIntersect) {
                        hits.push(scrollspy);
                    }
                }
            }
            return hits;
        }
        _enter() {
            ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter((value) => value.getBoundingClientRect().height !== 0);
            if (ScrollSpy._visibleElements[0]) {
                const actElem = document.querySelector(this.options.getActiveElement(ScrollSpy._visibleElements[0].id));
                actElem?.classList.remove(this.options.activeClass);
                if (ScrollSpy._visibleElements[0]['M_ScrollSpy'] &&
                    this.id < ScrollSpy._visibleElements[0]['M_ScrollSpy'].id) {
                    ScrollSpy._visibleElements.unshift(this.el);
                }
                else {
                    ScrollSpy._visibleElements.push(this.el);
                }
            }
            else {
                ScrollSpy._visibleElements.push(this.el);
            }
            this._resetKeptTopActiveElementIfNeeded();
            const selector = this.options.getActiveElement(ScrollSpy._visibleElements[0].id);
            document.querySelector(selector)?.classList.add(this.options.activeClass);
        }
        _exit() {
            ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter((value) => value.getBoundingClientRect().height !== 0);
            if (ScrollSpy._visibleElements[0]) {
                const actElem = document.querySelector(this.options.getActiveElement(ScrollSpy._visibleElements[0].id));
                actElem?.classList.remove(this.options.activeClass);
                ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter((x) => x.id != this.el.id);
                if (ScrollSpy._visibleElements[0]) {
                    // Check if empty
                    const selector = this.options.getActiveElement(ScrollSpy._visibleElements[0].id);
                    document.querySelector(selector)?.classList.add(this.options.activeClass);
                    this._resetKeptTopActiveElementIfNeeded();
                }
            }
        }
        _resetKeptTopActiveElementIfNeeded() {
            if (ScrollSpy._keptTopActiveElement) {
                ScrollSpy._keptTopActiveElement.classList.remove(this.options.activeClass);
                ScrollSpy._keptTopActiveElement = null;
            }
        }
        static _getDistanceToViewport(element) {
            const rect = element.getBoundingClientRect();
            const distance = rect.top;
            return distance;
        }
        static _smoothScrollIntoView(element, duration = 300) {
            const targetPosition = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
            const startPosition = window.scrollY || window.pageYOffset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();
            function scrollStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const scrollY = startPosition + distance * progress;
                if (progress < 1) {
                    window.scrollTo(0, scrollY);
                    requestAnimationFrame(scrollStep);
                }
                else {
                    window.scrollTo(0, targetPosition);
                }
            }
            requestAnimationFrame(scrollStep);
        }
        static {
            ScrollSpy._elements = [];
            ScrollSpy._elementsInView = [];
            ScrollSpy._visibleElements = []; // Array.<cash>
            ScrollSpy._count = 0;
            ScrollSpy._increment = 0;
            ScrollSpy._ticks = 0;
        }
    }

    const _defaults$8 = {
        edge: 'left',
        draggable: true,
        dragTargetWidth: '10px',
        inDuration: 250,
        outDuration: 200,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        preventScrolling: true
    };
    class Sidenav extends Component {
        id;
        /** Describes open/close state of Sidenav. */
        isOpen;
        /** Describes if sidenav is fixed. */
        isFixed;
        /** Describes if Sidenav is being dragged. */
        isDragged;
        lastWindowWidth;
        lastWindowHeight;
        static _sidenavs;
        _overlay;
        dragTarget;
        _startingXpos;
        _xPos;
        _time;
        _width;
        _initialScrollTop;
        _verticallyScrolling;
        deltaX;
        velocityX;
        percentOpen;
        constructor(el, options) {
            super(el, options, Sidenav);
            this.el['M_Sidenav'] = this;
            this.options = {
                ...Sidenav.defaults,
                ...options
            };
            this.id = this.el.id;
            this.isOpen = false;
            this.isFixed = this.el.classList.contains('sidenav-fixed');
            this.isDragged = false;
            // Window size variables for window resize checks
            this.lastWindowWidth = window.innerWidth;
            this.lastWindowHeight = window.innerHeight;
            this._createOverlay();
            this._createDragTarget();
            this._setupEventHandlers();
            this._setupClasses();
            this._setupFixed();
            Sidenav._sidenavs.push(this);
        }
        static get defaults() {
            return _defaults$8;
        }
        /**
         * Initializes instances of Sidenav.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Sidenav);
        }
        static getInstance(el) {
            return el['M_Sidenav'];
        }
        destroy() {
            this._removeEventHandlers();
            this._enableBodyScrolling();
            this._overlay.parentNode.removeChild(this._overlay);
            this.dragTarget.parentNode.removeChild(this.dragTarget);
            this.el['M_Sidenav'] = undefined;
            this.el.style.transform = '';
            const index = Sidenav._sidenavs.indexOf(this);
            if (index >= 0) {
                Sidenav._sidenavs.splice(index, 1);
            }
        }
        _createOverlay() {
            this._overlay = document.createElement('div');
            this._overlay.classList.add('sidenav-overlay');
            this._overlay.addEventListener('click', this.close);
            document.body.appendChild(this._overlay);
        }
        _setupEventHandlers() {
            if (Sidenav._sidenavs.length === 0) {
                document.body.addEventListener('click', this._handleTriggerClick);
            }
            const passiveIfSupported = null;
            this.dragTarget.addEventListener('touchmove', this._handleDragTargetDrag, passiveIfSupported);
            this.dragTarget.addEventListener('touchend', this._handleDragTargetRelease);
            this._overlay.addEventListener('touchmove', this._handleCloseDrag, passiveIfSupported);
            this._overlay.addEventListener('touchend', this._handleCloseRelease);
            this.el.addEventListener('touchmove', this._handleCloseDrag); // , passiveIfSupported);
            this.el.addEventListener('touchend', this._handleCloseRelease);
            this.el.addEventListener('click', this._handleCloseTriggerClick);
            // Add resize for side nav fixed
            if (this.isFixed) {
                window.addEventListener('resize', this._handleWindowResize);
            }
            /* Set aria-hidden state */
            this._setAriaHidden();
            this._setTabIndex();
        }
        _removeEventHandlers() {
            if (Sidenav._sidenavs.length === 1) {
                document.body.removeEventListener('click', this._handleTriggerClick);
            }
            this.dragTarget.removeEventListener('touchmove', this._handleDragTargetDrag);
            this.dragTarget.removeEventListener('touchend', this._handleDragTargetRelease);
            this._overlay.removeEventListener('touchmove', this._handleCloseDrag);
            this._overlay.removeEventListener('touchend', this._handleCloseRelease);
            this.el.removeEventListener('touchmove', this._handleCloseDrag);
            this.el.removeEventListener('touchend', this._handleCloseRelease);
            this.el.removeEventListener('click', this._handleCloseTriggerClick);
            // Remove resize for side nav fixed
            if (this.isFixed) {
                window.removeEventListener('resize', this._handleWindowResize);
            }
        }
        _handleTriggerClick(e) {
            const trigger = e.target.closest('.sidenav-trigger');
            if (e.target && trigger) {
                const sidenavId = Utils.getIdFromTrigger(trigger);
                const sidenavInstance = document.getElementById(sidenavId)['M_Sidenav'];
                if (sidenavInstance) {
                    sidenavInstance.open();
                }
                e.preventDefault();
            }
        }
        // Set variables needed at the beginning of drag and stop any current transition.
        _startDrag(e) {
            const clientX = e.targetTouches[0].clientX;
            this.isDragged = true;
            this._startingXpos = clientX;
            this._xPos = this._startingXpos;
            this._time = Date.now();
            this._width = this.el.getBoundingClientRect().width;
            this._overlay.style.display = 'block';
            this._initialScrollTop = this.isOpen ? this.el.scrollTop : Utils.getDocumentScrollTop();
            this._verticallyScrolling = false;
        }
        //Set variables needed at each drag move update tick
        _dragMoveUpdate(e) {
            const clientX = e.targetTouches[0].clientX;
            const currentScrollTop = this.isOpen ? this.el.scrollTop : Utils.getDocumentScrollTop();
            this.deltaX = Math.abs(this._xPos - clientX);
            this._xPos = clientX;
            this.velocityX = this.deltaX / (Date.now() - this._time);
            this._time = Date.now();
            if (this._initialScrollTop !== currentScrollTop) {
                this._verticallyScrolling = true;
            }
        }
        _handleDragTargetDrag = (e) => {
            // Check if draggable
            if (!this._isDraggable())
                return;
            let totalDeltaX = this._calculateDelta(e);
            const dragDirection = totalDeltaX > 0 ? 'right' : 'left';
            // Don't allow totalDeltaX to exceed Sidenav width or be dragged in the opposite direction
            totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
            if (this.options.edge === dragDirection) {
                totalDeltaX = 0;
            }
            /**
             * transformX is the drag displacement
             * transformPrefix is the initial transform placement
             * Invert values if Sidenav is right edge
             */
            let transformX = totalDeltaX;
            let transformPrefix = 'translateX(-100%)';
            if (this.options.edge === 'right') {
                transformPrefix = 'translateX(100%)';
                transformX = -transformX;
            }
            // Calculate open/close percentage of sidenav, with open = 1 and close = 0
            this.percentOpen = Math.min(1, totalDeltaX / this._width);
            // Set transform and opacity styles
            this.el.style.transform = `${transformPrefix} translateX(${transformX}px)`;
            this._overlay.style.opacity = this.percentOpen.toString();
        };
        _handleDragTargetRelease = () => {
            if (this.isDragged) {
                if (this.percentOpen > 0.2) {
                    this.open();
                }
                else {
                    this._animateOut();
                }
                this.isDragged = false;
                this._verticallyScrolling = false;
            }
        };
        _handleCloseDrag = (e) => {
            // Check if open and draggable
            if (!this.isOpen || !this._isDraggable())
                return;
            let totalDeltaX = this._calculateDelta(e);
            // dragDirection is the attempted user drag direction
            const dragDirection = totalDeltaX > 0 ? 'right' : 'left';
            totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
            if (this.options.edge !== dragDirection) {
                totalDeltaX = 0;
            }
            let transformX = -totalDeltaX;
            if (this.options.edge === 'right') {
                transformX = -transformX;
            }
            // Calculate open/close percentage of sidenav, with open = 1 and close = 0
            this.percentOpen = Math.min(1, 1 - totalDeltaX / this._width);
            // Set transform and opacity styles
            this.el.style.transform = `translateX(${transformX}px)`;
            this._overlay.style.opacity = this.percentOpen.toString();
        };
        _calculateDelta = (e) => {
            // If not being dragged, set initial drag start variables
            if (!this.isDragged) {
                this._startDrag(e);
            }
            // Run touchmove updates
            this._dragMoveUpdate(e);
            // Calculate raw deltaX
            return this._xPos - this._startingXpos;
        };
        _handleCloseRelease = () => {
            if (this.isOpen && this.isDragged) {
                if (this.percentOpen > 0.8) {
                    this._animateIn();
                }
                else {
                    this.close();
                }
                this.isDragged = false;
                this._verticallyScrolling = false;
            }
        };
        // Handles closing of Sidenav when element with class .sidenav-close
        _handleCloseTriggerClick = (e) => {
            const closeTrigger = e.target.closest('.sidenav-close');
            if (closeTrigger && !this._isCurrentlyFixed()) {
                this.close();
            }
        };
        _handleWindowResize = () => {
            // Only handle horizontal resizes
            if (this.lastWindowWidth !== window.innerWidth) {
                if (window.innerWidth > 992) {
                    this.open();
                }
                else {
                    this.close();
                }
            }
            this.lastWindowWidth = window.innerWidth;
            this.lastWindowHeight = window.innerHeight;
        };
        _setupClasses() {
            if (this.options.edge === 'right') {
                this.el.classList.add('right-aligned');
                this.dragTarget.classList.add('right-aligned');
            }
        }
        _removeClasses() {
            this.el.classList.remove('right-aligned');
            this.dragTarget.classList.remove('right-aligned');
        }
        _setupFixed() {
            if (this._isCurrentlyFixed())
                this.open();
        }
        _isDraggable() {
            return this.options.draggable && !this._isCurrentlyFixed() && !this._verticallyScrolling;
        }
        _isCurrentlyFixed() {
            return this.isFixed && window.innerWidth > 992;
        }
        _createDragTarget() {
            const dragTarget = document.createElement('div');
            dragTarget.classList.add('drag-target');
            dragTarget.style.width = this.options.dragTargetWidth;
            document.body.appendChild(dragTarget);
            this.dragTarget = dragTarget;
        }
        _preventBodyScrolling() {
            document.body.style.overflow = 'hidden';
        }
        _enableBodyScrolling() {
            document.body.style.overflow = '';
        }
        /**
         * Opens Sidenav.
         */
        open = () => {
            if (this.isOpen === true)
                return;
            this.isOpen = true;
            // Run onOpenStart callback
            if (typeof this.options.onOpenStart === 'function') {
                this.options.onOpenStart.call(this, this.el);
            }
            // Handle fixed Sidenav
            if (this._isCurrentlyFixed()) {
                // Show if fixed
                this.el.style.transform = 'translateX(0)';
                this._enableBodyScrolling();
                this._overlay.style.display = 'none';
            }
            // Handle non-fixed Sidenav
            else {
                if (this.options.preventScrolling)
                    this._preventBodyScrolling();
                if (!this.isDragged || this.percentOpen != 1)
                    this._animateIn();
                /* Set aria-hidden state */
                this._setAriaHidden();
                this._setTabIndex();
            }
        };
        /**
         * Closes Sidenav.
         */
        close = () => {
            if (this.isOpen === false)
                return;
            this.isOpen = false;
            // Run onCloseStart callback
            if (typeof this.options.onCloseStart === 'function') {
                this.options.onCloseStart.call(this, this.el);
            }
            // Handle fixed Sidenav
            if (this._isCurrentlyFixed()) {
                const transformX = this.options.edge === 'left' ? '-105%' : '105%';
                this.el.style.transform = `translateX(${transformX})`;
            }
            // Handle non-fixed Sidenav
            else {
                this._enableBodyScrolling();
                if (!this.isDragged || this.percentOpen != 0) {
                    this._animateOut();
                }
                else {
                    this._overlay.style.display = 'none';
                }
                /* Set aria-hidden state */
                this._setAriaHidden();
                this._setTabIndex();
            }
        };
        _animateIn() {
            this._animateSidenavIn();
            this._animateOverlayIn();
        }
        _animateOut() {
            this._animateSidenavOut();
            this._animateOverlayOut();
        }
        _animateSidenavIn() {
            let slideOutPercent = this.options.edge === 'left' ? -1 : 1;
            if (this.isDragged) {
                slideOutPercent =
                    this.options.edge === 'left'
                        ? slideOutPercent + this.percentOpen
                        : slideOutPercent - this.percentOpen;
            }
            const duration = this.options.inDuration;
            // from
            this.el.style.transition = 'none';
            this.el.style.transform = 'translateX(' + slideOutPercent * 100 + '%)';
            setTimeout(() => {
                this.el.style.transition = `transform ${duration}ms ease`; // easeOutQuad
                // to
                this.el.style.transform = 'translateX(0)';
            }, 1);
            setTimeout(() => {
                if (typeof this.options.onOpenEnd === 'function')
                    this.options.onOpenEnd.call(this, this.el);
            }, duration);
        }
        _animateSidenavOut() {
            const endPercent = this.options.edge === 'left' ? -1 : 1;
            // let slideOutPercent = 0;
            // if (this.isDragged) {
            //   // @todo unused variable
            //   slideOutPercent =
            //     this.options.edge === 'left'
            //       ? endPercent + this.percentOpen
            //       : endPercent - this.percentOpen;
            // }
            const duration = this.options.outDuration;
            this.el.style.transition = `transform ${duration}ms ease`; // easeOutQuad
            // to
            this.el.style.transform = 'translateX(' + endPercent * 100 + '%)';
            setTimeout(() => {
                if (typeof this.options.onCloseEnd === 'function')
                    this.options.onCloseEnd.call(this, this.el);
            }, duration);
        }
        _animateOverlayIn() {
            let start = 0;
            if (this.isDragged)
                start = this.percentOpen;
            else
                this._overlay.style.display = 'block';
            // Animation
            const duration = this.options.inDuration;
            // from
            this._overlay.style.transition = 'none';
            this._overlay.style.opacity = start.toString();
            // easeOutQuad
            setTimeout(() => {
                this._overlay.style.transition = `opacity ${duration}ms ease`;
                // to
                this._overlay.style.opacity = '1';
            }, 1);
        }
        _animateOverlayOut() {
            const duration = this.options.outDuration;
            // easeOutQuad
            this._overlay.style.transition = `opacity ${duration}ms ease`;
            // to
            this._overlay.style.opacity = '0';
            setTimeout(() => {
                this._overlay.style.display = 'none';
            }, duration);
        }
        _setAriaHidden = () => {
            this.el.ariaHidden = this.isOpen ? 'false' : 'true';
            const navWrapper = document.querySelector('.nav-wrapper ul');
            if (navWrapper)
                navWrapper.ariaHidden = this.isOpen.toString();
        };
        _setTabIndex = () => {
            const navLinks = document.querySelectorAll('.nav-wrapper ul li a');
            const sideNavLinks = document.querySelectorAll('.sidenav li a');
            if (navLinks)
                navLinks.forEach((navLink) => {
                    navLink.tabIndex = this.isOpen ? -1 : 0;
                });
            if (sideNavLinks)
                sideNavLinks.forEach((sideNavLink) => {
                    sideNavLink.tabIndex = this.isOpen ? 0 : -1;
                });
        };
        static {
            Sidenav._sidenavs = [];
        }
    }

    const _defaults$7 = {
        duration: 300,
        onShow: null,
        swipeable: false,
        responsiveThreshold: Infinity // breakpoint for swipeable
    };
    class Tabs extends Component {
        _tabLinks;
        _index;
        _indicator;
        _tabWidth;
        _tabsWidth;
        _tabsCarousel;
        _activeTabLink;
        _content;
        constructor(el, options) {
            super(el, options, Tabs);
            this.el['M_Tabs'] = this;
            this.options = {
                ...Tabs.defaults,
                ...options
            };
            this._tabLinks = this.el.querySelectorAll('li.tab > a');
            this._index = 0;
            this._setupActiveTabLink();
            if (this.options.swipeable) {
                this._setupSwipeableTabs();
            }
            else {
                this._setupNormalTabs();
            }
            // Setup tabs indicator after content to ensure accurate widths
            this._setTabsAndTabWidth();
            this._createIndicator();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$7;
        }
        /**
         * Initializes instances of Tabs.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Tabs);
        }
        static getInstance(el) {
            return el['M_Tabs'];
        }
        destroy() {
            this._removeEventHandlers();
            this._indicator.parentNode.removeChild(this._indicator);
            if (this.options.swipeable) {
                this._teardownSwipeableTabs();
            }
            else {
                this._teardownNormalTabs();
            }
            this.el['M_Tabs'] = undefined;
        }
        /**
         * The index of tab that is currently shown.
         */
        get index() {
            return this._index;
        }
        _setupEventHandlers() {
            window.addEventListener('resize', this._handleWindowResize);
            this.el.addEventListener('click', this._handleTabClick);
        }
        _removeEventHandlers() {
            window.removeEventListener('resize', this._handleWindowResize);
            this.el.removeEventListener('click', this._handleTabClick);
        }
        _handleWindowResize = () => {
            this._setTabsAndTabWidth();
            if (this._tabWidth !== 0 && this._tabsWidth !== 0) {
                this._indicator.style.left = this._calcLeftPos(this._activeTabLink) + 'px';
                this._indicator.style.right = this._calcRightPos(this._activeTabLink) + 'px';
            }
        };
        _handleTabClick = (e) => {
            let tabLink = e.target;
            if (!tabLink)
                return;
            let tab = tabLink.parentElement;
            while (tab && !tab.classList.contains('tab')) {
                tabLink = tabLink.parentElement;
                tab = tab.parentElement;
            }
            // Handle click on tab link only
            if (!tabLink || !tab.classList.contains('tab'))
                return;
            // is disabled?
            if (tab.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            // Act as regular link if target attribute is specified.
            if (tabLink.hasAttribute('target'))
                return;
            // Make the old tab inactive.
            this._activeTabLink.classList.remove('active');
            const _oldContent = this._content;
            // Update the variables with the new link and content
            this._activeTabLink = tabLink;
            if (tabLink.hash)
                this._content = document.querySelector(tabLink.hash);
            this._tabLinks = this.el.querySelectorAll('li.tab > a');
            // Make the tab active
            this._activeTabLink.classList.add('active');
            const prevIndex = this._index;
            this._index = Math.max(Array.from(this._tabLinks).indexOf(tabLink), 0);
            // Swap content
            if (this.options.swipeable) {
                if (this._tabsCarousel) {
                    this._tabsCarousel.set(this._index, () => {
                        if (typeof this.options.onShow === 'function')
                            this.options.onShow.call(this, this._content);
                    });
                }
            }
            else {
                if (this._content) {
                    this._content.style.display = 'block';
                    this._content.classList.add('active');
                    if (typeof this.options.onShow === 'function')
                        this.options.onShow.call(this, this._content);
                    if (_oldContent && _oldContent !== this._content) {
                        _oldContent.style.display = 'none';
                        _oldContent.classList.remove('active');
                    }
                }
            }
            // Update widths after content is swapped (scrollbar bugfix)
            this._setTabsAndTabWidth();
            this._animateIndicator(prevIndex);
            e.preventDefault();
        };
        _createIndicator() {
            const indicator = document.createElement('li');
            indicator.classList.add('indicator');
            this.el.appendChild(indicator);
            this._indicator = indicator;
            this._indicator.style.left = this._calcLeftPos(this._activeTabLink) + 'px';
            this._indicator.style.right = this._calcRightPos(this._activeTabLink) + 'px';
        }
        _setupActiveTabLink() {
            // If the location.hash matches one of the links, use that as the active tab.
            this._activeTabLink = Array.from(this._tabLinks).find((a) => a.getAttribute('href') === location.hash);
            // If no match is found, use the first link or any with class 'active' as the initial active tab.
            if (!this._activeTabLink) {
                let activeTabLink = this.el.querySelector('li.tab a.active');
                if (!activeTabLink) {
                    activeTabLink = this.el.querySelector('li.tab a');
                }
                this._activeTabLink = activeTabLink;
            }
            Array.from(this._tabLinks).forEach((a) => a.classList.remove('active'));
            this._activeTabLink.classList.add('active');
            this._index = Math.max(Array.from(this._tabLinks).indexOf(this._activeTabLink), 0);
            if (this._activeTabLink && this._activeTabLink.hash) {
                this._content = document.querySelector(this._activeTabLink.hash);
                if (this._content)
                    this._content.classList.add('active');
            }
        }
        _setupSwipeableTabs() {
            // Change swipeable according to responsive threshold
            if (window.innerWidth > this.options.responsiveThreshold)
                this.options.swipeable = false;
            const tabsContent = [];
            this._tabLinks.forEach((a) => {
                if (a.hash) {
                    const currContent = document.querySelector(a.hash);
                    currContent.classList.add('carousel-item');
                    tabsContent.push(currContent);
                }
            });
            // Create Carousel-Wrapper around Tab-Contents
            const tabsWrapper = document.createElement('div');
            tabsWrapper.classList.add('tabs-content', 'carousel', 'carousel-slider');
            // Wrap around
            tabsContent[0].parentElement.insertBefore(tabsWrapper, tabsContent[0]);
            tabsContent.forEach((tabContent) => {
                tabsWrapper.appendChild(tabContent);
                tabContent.style.display = '';
            });
            // Keep active tab index to set initial carousel slide
            const tab = this._activeTabLink.parentElement;
            const activeTabIndex = Array.from(tab.parentNode.children).indexOf(tab);
            this._tabsCarousel = Carousel.init(tabsWrapper, {
                fullWidth: true,
                noWrap: true,
                onCycleTo: (item) => {
                    const prevIndex = this._index;
                    this._index = Array.from(item.parentNode.children).indexOf(item);
                    this._activeTabLink.classList.remove('active');
                    this._activeTabLink = Array.from(this._tabLinks)[this._index];
                    this._activeTabLink.classList.add('active');
                    this._animateIndicator(prevIndex);
                    if (typeof this.options.onShow === 'function')
                        this.options.onShow.call(this, this._content);
                }
            });
            // Set initial carousel slide to active tab
            this._tabsCarousel.set(activeTabIndex);
        }
        _teardownSwipeableTabs() {
            const tabsWrapper = this._tabsCarousel.el;
            this._tabsCarousel.destroy();
            // Unwrap
            tabsWrapper.append(tabsWrapper.parentElement);
            tabsWrapper.remove();
        }
        _setupNormalTabs() {
            // Hide Tabs Content
            Array.from(this._tabLinks).forEach((a) => {
                if (a === this._activeTabLink)
                    return;
                if (a.hash) {
                    const currContent = document.querySelector(a.hash);
                    if (currContent)
                        currContent.style.display = 'none';
                }
            });
        }
        _teardownNormalTabs() {
            // show Tabs Content
            this._tabLinks.forEach((a) => {
                if (a.hash) {
                    const currContent = document.querySelector(a.hash);
                    if (currContent)
                        currContent.style.display = '';
                }
            });
        }
        _setTabsAndTabWidth() {
            this._tabsWidth = this.el.getBoundingClientRect().width;
            this._tabWidth = Math.max(this._tabsWidth, this.el.scrollWidth) / this._tabLinks.length;
        }
        _calcRightPos(el) {
            return Math.ceil(this._tabsWidth - el.offsetLeft - el.getBoundingClientRect().width);
        }
        _calcLeftPos(el) {
            return Math.floor(el.offsetLeft);
        }
        /**
         * Recalculate tab indicator position. This is useful when
         * the indicator position is not correct.
         */
        updateTabIndicator() {
            this._setTabsAndTabWidth();
            this._animateIndicator(this._index);
        }
        _animateIndicator(prevIndex) {
            let leftDelay = 0, rightDelay = 0;
            const isMovingLeftOrStaying = this._index - prevIndex >= 0;
            if (isMovingLeftOrStaying)
                leftDelay = 90;
            else
                rightDelay = 90;
            // in v1: easeOutQuad
            this._indicator.style.transition = `
      left ${this.options.duration}ms ease-out ${leftDelay}ms,
      right ${this.options.duration}ms ease-out ${rightDelay}ms`;
            this._indicator.style.left = this._calcLeftPos(this._activeTabLink) + 'px';
            this._indicator.style.right = this._calcRightPos(this._activeTabLink) + 'px';
        }
        /**
         * Show tab content that corresponds to the tab with the id.
         * @param tabId The id of the tab that you want to switch to.
         */
        select(tabId) {
            const tab = Array.from(this._tabLinks).find((a) => a.getAttribute('href') === '#' + tabId);
            if (tab)
                tab.click();
        }
    }

    const _defaults$6 = {
        onOpen: null,
        onClose: null
    };
    class TapTarget extends Component {
        /**
         * If the tap target is open.
         */
        isOpen;
        static _taptargets;
        wrapper;
        // private _origin: HTMLElement;
        originEl;
        waveEl;
        contentEl;
        constructor(el, options) {
            super(el, options, TapTarget);
            this.el['M_TapTarget'] = this;
            this.options = {
                ...TapTarget.defaults,
                ...options
            };
            this.isOpen = false;
            // setup
            this.originEl = document.querySelector(`#${el.dataset.target}`);
            this.originEl.tabIndex = 0;
            this._setup();
            this._calculatePositioning();
            this._setupEventHandlers();
            TapTarget._taptargets.push(this);
        }
        static get defaults() {
            return _defaults$6;
        }
        /**
         * Initializes instances of TapTarget.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, TapTarget);
        }
        static getInstance(el) {
            return el['M_TapTarget'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['M_TapTarget'] = undefined;
            const index = TapTarget._taptargets.indexOf(this);
            if (index >= 0) {
                TapTarget._taptargets.splice(index, 1);
            }
        }
        _setupEventHandlers() {
            this.originEl.addEventListener('click', this._handleTargetToggle);
            this.originEl.addEventListener('keypress', this._handleKeyboardInteraction, true);
            // this.originEl.addEventListener('click', this._handleOriginClick);
            // Resize
            window.addEventListener('resize', this._handleThrottledResize);
        }
        _removeEventHandlers() {
            this.originEl.removeEventListener('click', this._handleTargetToggle);
            this.originEl.removeEventListener('keypress', this._handleKeyboardInteraction, true);
            // this.originEl.removeEventListener('click', this._handleOriginClick);
            window.removeEventListener('resize', this._handleThrottledResize);
        }
        _handleThrottledResize = () => Utils.throttle(this._handleResize, 200).bind(this);
        _handleKeyboardInteraction = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleTargetToggle();
            }
        };
        _handleTargetToggle = () => {
            if (!this.isOpen)
                this.open();
            else
                this.close();
        };
        /*_handleOriginClick = () => {
          this.close();
        }*/
        _handleResize = () => {
            this._calculatePositioning();
        };
        _handleDocumentClick = (e) => {
            if (e.target.closest(`#${this.el.dataset.target}`) !== this.originEl &&
                !e.target.closest('.tap-target-wrapper')) {
                this.close();
                // e.preventDefault();
                // e.stopPropagation();
            }
        };
        _setup() {
            // Creating tap target
            this.wrapper = this.el.parentElement;
            this.waveEl = this.wrapper.querySelector('.tap-target-wave');
            this.el.parentElement.ariaExpanded = 'false';
            this.originEl.style.zIndex = '1002';
            // this.originEl = this.wrapper.querySelector('.tap-target-origin');
            this.contentEl = this.el.querySelector('.tap-target-content');
            // Creating wrapper
            if (!this.wrapper.classList.contains('.tap-target-wrapper')) {
                this.wrapper = document.createElement('div');
                this.wrapper.classList.add('tap-target-wrapper');
                this.el.before(this.wrapper);
                this.wrapper.append(this.el);
            }
            // Creating content
            if (!this.contentEl) {
                this.contentEl = document.createElement('div');
                this.contentEl.classList.add('tap-target-content');
                this.el.append(this.contentEl);
            }
            // Creating foreground wave
            if (!this.waveEl) {
                this.waveEl = document.createElement('div');
                this.waveEl.classList.add('tap-target-wave');
                // Creating origin
                /*if (!this.originEl) {
                  this.originEl = <HTMLElement>this._origin.cloneNode(true); // .clone(true, true);
                  this.originEl.classList.add('tap-target-origin');
                  this.originEl.removeAttribute('id');
                  this.originEl.removeAttribute('style');
                  this.waveEl.append(this.originEl);
                }*/
                this.wrapper.append(this.waveEl);
            }
        }
        _offset(el) {
            const box = el.getBoundingClientRect();
            const docElem = document.documentElement;
            return {
                top: box.top + window.pageYOffset - docElem.clientTop,
                left: box.left + window.pageXOffset - docElem.clientLeft
            };
        }
        _calculatePositioning() {
            // Element or parent is fixed position?
            let isFixed = getComputedStyle(this.originEl).position === 'fixed';
            if (!isFixed) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let currentElem = this.originEl;
                const parents = [];
                while ((currentElem = currentElem.parentNode) && currentElem !== document)
                    parents.push(currentElem);
                for (let i = 0; i < parents.length; i++) {
                    isFixed = getComputedStyle(parents[i]).position === 'fixed';
                    if (isFixed)
                        break;
                }
            }
            // Calculating origin
            const originWidth = this.originEl.offsetWidth;
            const originHeight = this.originEl.offsetHeight;
            const originTop = isFixed
                ? this._offset(this.originEl).top - Utils.getDocumentScrollTop()
                : this._offset(this.originEl).top;
            const originLeft = isFixed
                ? this._offset(this.originEl).left - Utils.getDocumentScrollLeft()
                : this._offset(this.originEl).left;
            // Calculating screen
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const scrollBarWidth = windowWidth - document.documentElement.clientWidth;
            const centerX = windowWidth / 2;
            const centerY = windowHeight / 2;
            const isLeft = originLeft <= centerX;
            const isRight = originLeft > centerX;
            const isTop = originTop <= centerY;
            const isBottom = originTop > centerY;
            const isCenterX = originLeft >= windowWidth * 0.25 && originLeft <= windowWidth * 0.75;
            // Calculating tap target
            const tapTargetWidth = this.el.offsetWidth;
            const tapTargetHeight = this.el.offsetHeight;
            const tapTargetTop = originTop + originHeight / 2 - tapTargetHeight / 2;
            const tapTargetLeft = originLeft + originWidth / 2 - tapTargetWidth / 2;
            const tapTargetPosition = isFixed ? 'fixed' : 'absolute';
            // Calculating content
            const tapTargetTextWidth = isCenterX ? tapTargetWidth : tapTargetWidth / 2 + originWidth;
            const tapTargetTextHeight = tapTargetHeight / 2;
            const tapTargetTextTop = isTop ? tapTargetHeight / 2 : 0;
            const tapTargetTextBottom = 0;
            const tapTargetTextLeft = isLeft && !isCenterX ? tapTargetWidth / 2 - originWidth : 0;
            const tapTargetTextRight = 0;
            const tapTargetTextPadding = originWidth;
            const tapTargetTextAlign = isBottom ? 'bottom' : 'top';
            // Calculating wave
            const tapTargetWaveWidth = originWidth > originHeight ? originWidth * 2 : originWidth * 2;
            const tapTargetWaveHeight = tapTargetWaveWidth;
            const tapTargetWaveTop = tapTargetHeight / 2 - tapTargetWaveHeight / 2;
            const tapTargetWaveLeft = tapTargetWidth / 2 - tapTargetWaveWidth / 2;
            // Setting tap target
            this.wrapper.style.top = isTop ? tapTargetTop + 'px' : '';
            this.wrapper.style.right = isRight
                ? windowWidth - tapTargetLeft - tapTargetWidth - scrollBarWidth + 'px'
                : '';
            this.wrapper.style.bottom = isBottom
                ? windowHeight - tapTargetTop - tapTargetHeight + 'px'
                : '';
            this.wrapper.style.left = isLeft ? tapTargetLeft + 'px' : '';
            this.wrapper.style.position = tapTargetPosition;
            // Setting content
            this.contentEl.style.width = tapTargetTextWidth + 'px';
            this.contentEl.style.height = tapTargetTextHeight + 'px';
            this.contentEl.style.top = tapTargetTextTop + 'px';
            this.contentEl.style.right = tapTargetTextRight + 'px';
            this.contentEl.style.bottom = tapTargetTextBottom + 'px';
            this.contentEl.style.left = tapTargetTextLeft + 'px';
            this.contentEl.style.padding = tapTargetTextPadding + 'px';
            this.contentEl.style.verticalAlign = tapTargetTextAlign;
            // Setting wave
            this.waveEl.style.top = tapTargetWaveTop + 'px';
            this.waveEl.style.left = tapTargetWaveLeft + 'px';
            this.waveEl.style.width = tapTargetWaveWidth + 'px';
            this.waveEl.style.height = tapTargetWaveHeight + 'px';
        }
        /**
         * Open Tap Target.
         */
        open = () => {
            if (this.isOpen)
                return;
            // onOpen callback
            if (typeof this.options.onOpen === 'function') {
                this.options.onOpen.call(this, this.originEl);
            }
            this.isOpen = true;
            this.wrapper.classList.add('open');
            this.wrapper.ariaExpanded = 'true';
            document.body.addEventListener('click', this._handleDocumentClick, true);
            document.body.addEventListener('keypress', this._handleDocumentClick, true);
            document.body.addEventListener('touchend', this._handleDocumentClick);
        };
        /**
         * Close Tap Target.
         */
        close = () => {
            if (!this.isOpen)
                return;
            // onClose callback
            if (typeof this.options.onClose === 'function') {
                this.options.onClose.call(this, this.originEl);
            }
            this.isOpen = false;
            this.wrapper.classList.remove('open');
            this.wrapper.ariaExpanded = 'false';
            document.body.removeEventListener('click', this._handleDocumentClick, true);
            document.body.removeEventListener('keypress', this._handleDocumentClick, true);
            document.body.removeEventListener('touchend', this._handleDocumentClick);
        };
        static {
            TapTarget._taptargets = [];
        }
    }

    const _defaults$5 = {
        dialRadius: 135,
        outerRadius: 105,
        innerRadius: 70,
        tickRadius: 20,
        duration: 350,
        container: null,
        defaultTime: 'now', // default time, 'now' or '13:14' e.g.
        fromNow: 0, // Millisecond offset from the defaultTime
        showClearBtn: false,
        autoSubmit: true,
        // internationalization
        i18n: {
            cancel: 'Cancel',
            clear: 'Clear',
            done: 'Ok'
        },
        twelveHour: true, // change to 12 hour AM/PM clock from 24 hour
        vibrate: true, // vibrate the device when dragging clock hand
        // Callbacks
        onSelect: null,
        onInputInteraction: null,
        onDone: null,
        onCancel: null,
        displayPlugin: null,
        displayPluginOptions: null,
    };
    class Timepicker extends Component {
        id;
        containerEl;
        plate;
        digitalClock;
        inputHours;
        inputMinutes;
        x0;
        y0;
        moved;
        dx;
        dy;
        /**
         * Current view on the timepicker.
         * @default 'hours'
         */
        currentView;
        hand;
        minutesView;
        hours;
        minutes;
        /** The selected time. */
        time;
        /**
         * If the time is AM or PM on twelve-hour clock.
         * @default 'PM'
         */
        amOrPm;
        static _template;
        /** Vibrate device when dragging clock hand. */
        vibrate;
        _canvas;
        hoursView;
        spanAmPm;
        footer;
        _amBtn;
        _pmBtn;
        bg;
        bearing;
        g;
        toggleViewTimer;
        vibrateTimer;
        displayPlugin;
        constructor(el, options) {
            super(el, options, Timepicker);
            this.el['M_Timepicker'] = this;
            this.options = {
                ...Timepicker.defaults,
                ...options
            };
            this.id = Utils.guid();
            this._insertHTMLIntoDOM();
            this._setupVariables();
            this._setupEventHandlers();
            this._clockSetup();
            this._pickerSetup();
            if (this.options.displayPlugin) {
                if (this.options.displayPlugin === 'docked')
                    this.displayPlugin = DockedDisplayPlugin.init(this.el, this.containerEl, this.options.displayPluginOptions);
            }
        }
        static get defaults() {
            return _defaults$5;
        }
        /**
         * Initializes instances of Timepicker.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Timepicker);
        }
        static _addLeadingZero(num) {
            return (num < 10 ? '0' : '') + num;
        }
        static _createSVGEl(name) {
            const svgNS = 'http://www.w3.org/2000/svg';
            return document.createElementNS(svgNS, name);
        }
        static _Pos(e) {
            if (e.type.startsWith('touch') && e.targetTouches.length >= 1) {
                return {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY
                };
            }
            // mouse event
            return { x: e.clientX, y: e.clientY };
        }
        static getInstance(el) {
            return el['M_Timepicker'];
        }
        destroy() {
            this._removeEventHandlers();
            this.containerEl.remove();
            this.el['M_Timepicker'] = undefined;
        }
        _setupEventHandlers() {
            this.el.addEventListener('click', this._handleInputClick);
            this.el.addEventListener('keydown', this._handleInputKeydown);
            this.plate.addEventListener('mousedown', this._handleClockClickStart);
            this.plate.addEventListener('touchstart', this._handleClockClickStart);
            this.digitalClock.addEventListener('keyup', this._inputFromTextField);
            this.inputHours.addEventListener('focus', () => this.showView('hours'));
            this.inputHours.addEventListener('focusout', () => this.formatHours());
            this.inputMinutes.addEventListener('focus', () => this.showView('minutes'));
            this.inputMinutes.addEventListener('focusout', () => this.formatMinutes());
        }
        _removeEventHandlers() {
            this.el.removeEventListener('click', this._handleInputClick);
            this.el.removeEventListener('keydown', this._handleInputKeydown);
        }
        _handleInputClick = () => {
            this.inputHours.focus();
            if (typeof this.options.onInputInteraction === 'function')
                this.options.onInputInteraction.call(this);
            if (this.displayPlugin)
                this.displayPlugin.show();
        };
        _handleInputKeydown = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                e.preventDefault();
                this.inputHours.focus();
                if (typeof this.options.onInputInteraction === 'function')
                    this.options.onInputInteraction.call(this);
                if (this.displayPlugin)
                    this.displayPlugin.show();
            }
        };
        _handleTimeInputEnterKey = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                e.preventDefault();
                this._inputFromTextField();
            }
        };
        _handleClockClickStart = (e) => {
            e.preventDefault();
            const clockPlateBR = this.plate.getBoundingClientRect();
            const offset = { x: clockPlateBR.left, y: clockPlateBR.top };
            this.x0 = offset.x + this.options.dialRadius;
            this.y0 = offset.y + this.options.dialRadius;
            this.moved = false;
            const clickPos = Timepicker._Pos(e);
            this.dx = clickPos.x - this.x0;
            this.dy = clickPos.y - this.y0;
            // Set clock hands
            this.setHand(this.dx, this.dy, false);
            // Mousemove on document
            document.addEventListener('mousemove', this._handleDocumentClickMove);
            document.addEventListener('touchmove', this._handleDocumentClickMove);
            // Mouseup on document
            document.addEventListener('mouseup', this._handleDocumentClickEnd);
            document.addEventListener('touchend', this._handleDocumentClickEnd);
        };
        _handleDocumentClickMove = (e) => {
            e.preventDefault();
            const clickPos = Timepicker._Pos(e);
            const x = clickPos.x - this.x0;
            const y = clickPos.y - this.y0;
            this.moved = true;
            this.setHand(x, y, false);
        };
        _handleDocumentClickEnd = (e) => {
            e.preventDefault();
            document.removeEventListener('mouseup', this._handleDocumentClickEnd);
            document.removeEventListener('touchend', this._handleDocumentClickEnd);
            const clickPos = Timepicker._Pos(e);
            const x = clickPos.x - this.x0;
            const y = clickPos.y - this.y0;
            if (this.moved && x === this.dx && y === this.dy) {
                this.setHand(x, y);
            }
            if (this.currentView === 'hours') {
                this.inputMinutes.focus();
                this.showView('minutes', this.options.duration / 2);
            }
            else {
                // this.minutesView.classList.add('timepicker-dial-out');
                setTimeout(() => {
                    if (this.options.autoSubmit)
                        this.done();
                }, this.options.duration / 2);
            }
            if (typeof this.options.onSelect === 'function') {
                this.options.onSelect.call(this, this.hours, this.minutes);
            }
            // Unbind mousemove event
            document.removeEventListener('mousemove', this._handleDocumentClickMove);
            document.removeEventListener('touchmove', this._handleDocumentClickMove);
        };
        _insertHTMLIntoDOM() {
            const template = document.createElement('template');
            template.innerHTML = Timepicker._template.trim();
            this.containerEl = template.content.firstChild;
            this.containerEl.id = 'container-' + this.id;
            // Append popover to input by default
            const optEl = this.options.container;
            const containerEl = optEl instanceof HTMLElement ? optEl : document.querySelector(optEl);
            if (this.options.container && !!containerEl) {
                containerEl.append(this.containerEl);
            }
            else {
                this.el.parentElement.appendChild(this.containerEl);
            }
        }
        _setupVariables() {
            this.currentView = 'hours';
            this.vibrate = navigator.vibrate
                ? 'vibrate'
                : navigator['webkitVibrate']
                    ? 'webkitVibrate'
                    : null;
            this._canvas = this.containerEl.querySelector('.timepicker-canvas');
            this.plate = this.containerEl.querySelector('.timepicker-plate');
            this.digitalClock = this.containerEl.querySelector('.timepicker-display-column');
            this.hoursView = this.containerEl.querySelector('.timepicker-hours');
            this.minutesView = this.containerEl.querySelector('.timepicker-minutes');
            this.inputHours = this.containerEl.querySelector('.timepicker-input-hours');
            this.inputMinutes = this.containerEl.querySelector('.timepicker-input-minutes');
            this.spanAmPm = this.containerEl.querySelector('.timepicker-span-am-pm');
            this.footer = this.containerEl.querySelector('.timepicker-footer');
            this.amOrPm = 'PM';
        }
        /*private _createButton(text: string, visibility: string): HTMLButtonElement {
          const button = document.createElement('button');
          button.classList.add('btn', 'waves-effect', 'text');
          button.style.visibility = visibility;
          button.type = 'button';
          button.tabIndex = -1;
          button.innerText = text;
          return button;
        }*/
        _pickerSetup() {
            // clearButton.classList.add('timepicker-clear');
            // clearButton.addEventListener('click', this.clear);
            // this.footer.appendChild(clearButton);
            Utils.createButton(this.footer, this.options.i18n.clear, ['timepicker-clear'], this.options.showClearBtn, this.clear);
            if (!this.options.autoSubmit) {
                /*const confirmationBtnsContainer = document.createElement('div');
                confirmationBtnsContainer.classList.add('confirmation-btns');
                this.footer.append(confirmationBtnsContainer);
            
                const cancelButton = this._createButton(this.options.i18n.cancel, '');
                cancelButton.classList.add('timepicker-close');
                cancelButton.addEventListener('click', this.close);
                confirmationBtnsContainer.appendChild(cancelButton);
            
                const doneButton = this._createButton(this.options.i18n.done, '');
                doneButton.classList.add('timepicker-close');
                //doneButton.addEventListener('click', this._finishSelection);
                confirmationBtnsContainer.appendChild(doneButton);*/
                Utils.createConfirmationContainer(this.footer, this.options.i18n.done, this.options.i18n.cancel, this.confirm, this.cancel);
            }
            this._updateTimeFromInput();
            this.showView('hours');
        }
        _clockSetup() {
            if (this.options.twelveHour) {
                // AM Button
                this._amBtn = document.createElement('div');
                this._amBtn.classList.add('am-btn', 'btn');
                this._amBtn.innerText = 'AM';
                this._amBtn.tabIndex = 0;
                this._amBtn.addEventListener('click', this._handleAmPmClick);
                this._amBtn.addEventListener('keypress', this._handleAmPmKeypress);
                this.spanAmPm.appendChild(this._amBtn);
                // PM Button
                this._pmBtn = document.createElement('div');
                this._pmBtn.classList.add('pm-btn', 'btn');
                this._pmBtn.innerText = 'PM';
                this._pmBtn.tabIndex = 0;
                this._pmBtn.addEventListener('click', this._handleAmPmClick);
                this._pmBtn.addEventListener('keypress', this._handleAmPmKeypress);
                this.spanAmPm.appendChild(this._pmBtn);
            }
            this._buildHoursView();
            this._buildMinutesView();
            this._buildSVGClock();
        }
        _buildSVGClock() {
            // Draw clock hands and others
            const dialRadius = this.options.dialRadius;
            const tickRadius = this.options.tickRadius;
            const diameter = dialRadius * 2;
            const svg = Timepicker._createSVGEl('svg');
            svg.setAttribute('class', 'timepicker-svg');
            svg.setAttribute('width', diameter.toString());
            svg.setAttribute('height', diameter.toString());
            const g = Timepicker._createSVGEl('g');
            g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
            const bearing = Timepicker._createSVGEl('circle');
            bearing.setAttribute('class', 'timepicker-canvas-bearing');
            bearing.setAttribute('cx', '0');
            bearing.setAttribute('cy', '0');
            bearing.setAttribute('r', '4');
            const hand = Timepicker._createSVGEl('line');
            hand.setAttribute('x1', '0');
            hand.setAttribute('y1', '0');
            const bg = Timepicker._createSVGEl('circle');
            bg.setAttribute('class', 'timepicker-canvas-bg');
            bg.setAttribute('r', tickRadius.toString());
            g.appendChild(hand);
            g.appendChild(bg);
            g.appendChild(bearing);
            svg.appendChild(g);
            this._canvas.appendChild(svg);
            this.hand = hand;
            this.bg = bg;
            this.bearing = bearing;
            this.g = g;
        }
        _buildHoursView() {
            // const $tick = document.createElement('div');
            // $tick.classList.add('timepicker-tick');
            // Hours view
            if (this.options.twelveHour) {
                for (let i = 1; i < 13; i += 1) {
                    // const tick = <HTMLElement>$tick.cloneNode(true);
                    const radian = (i / 6) * Math.PI;
                    const radius = this.options.outerRadius;
                    this._buildHoursTick(i, radian, radius);
                }
            }
            else {
                for (let i = 0; i < 24; i += 1) {
                    // const tick = <HTMLElement>$tick.cloneNode(true);
                    const radian = (i / 6) * Math.PI;
                    const inner = i > 0 && i < 13;
                    const radius = inner ? this.options.innerRadius : this.options.outerRadius;
                    this._buildHoursTick(i, radian, radius);
                }
            }
        }
        _buildHoursTick(i, radian, radius) {
            const tick = document.createElement('div');
            tick.classList.add('timepicker-tick');
            tick.style.left =
                this.options.dialRadius + Math.sin(radian) * radius - this.options.tickRadius + 'px';
            tick.style.top =
                this.options.dialRadius - Math.cos(radian) * radius - this.options.tickRadius + 'px';
            tick.innerHTML = i === 0 ? '00' : i.toString();
            this.hoursView.appendChild(tick);
        }
        _buildMinutesView() {
            const _tick = document.createElement('div');
            _tick.classList.add('timepicker-tick');
            // Minutes view
            for (let i = 0; i < 60; i += 5) {
                const tick = _tick.cloneNode(true);
                const radian = (i / 30) * Math.PI;
                tick.style.left =
                    this.options.dialRadius +
                        Math.sin(radian) * this.options.outerRadius -
                        this.options.tickRadius +
                        'px';
                tick.style.top =
                    this.options.dialRadius -
                        Math.cos(radian) * this.options.outerRadius -
                        this.options.tickRadius +
                        'px';
                tick.innerHTML = Timepicker._addLeadingZero(i);
                this.minutesView.appendChild(tick);
            }
        }
        _handleAmPmClick = (e) => {
            this._handleAmPmInteraction(e.target);
        };
        _handleAmPmKeypress = (e) => {
            if (Utils.keys.ENTER.includes(e.key)) {
                this._handleAmPmInteraction(e.target);
            }
        };
        _handleAmPmInteraction = (e) => {
            this.amOrPm = e.classList.contains('am-btn') ? 'AM' : 'PM';
            this._updateAmPmView();
        };
        _updateAmPmView() {
            if (this.options.twelveHour) {
                if (this.amOrPm === 'PM') {
                    this._amBtn.classList.remove('filled');
                    this._pmBtn.classList.add('filled');
                }
                else if (this.amOrPm === 'AM') {
                    this._amBtn.classList.add('filled');
                    this._pmBtn.classList.remove('filled');
                }
            }
        }
        _updateTimeFromInput() {
            // Get the time
            let value = ((this.el.value || this.options.defaultTime || '') + '').split(':');
            if (this.options.twelveHour && !(typeof value[1] === 'undefined')) {
                if (value[1].toUpperCase().indexOf('AM') > 0) {
                    this.amOrPm = 'AM';
                }
                else {
                    this.amOrPm = 'PM';
                }
                value[1] = value[1].replace('AM', '').replace('PM', '');
            }
            if (value[0] === 'now') {
                const now = new Date(+new Date() + this.options.fromNow);
                value = [now.getHours().toString(), now.getMinutes().toString()];
                if (this.options.twelveHour) {
                    this.amOrPm = parseInt(value[0]) >= 12 && parseInt(value[0]) < 24 ? 'PM' : 'AM';
                }
            }
            this.hours = +value[0] || 0;
            this.minutes = +value[1] || 0;
            this.inputHours.value = Timepicker._addLeadingZero(this.hours);
            this.inputMinutes.value = Timepicker._addLeadingZero(this.minutes);
            this._updateAmPmView();
        }
        /**
         * Show hours or minutes view on timepicker.
         * @param view The name of the view you want to switch to, 'hours' or 'minutes'.
         * @param delay
         */
        showView = (view, delay = null) => {
            if (view === 'minutes' && getComputedStyle(this.hoursView).visibility === 'visible') ;
            const isHours = view === 'hours', nextView = isHours ? this.hoursView : this.minutesView, hideView = isHours ? this.minutesView : this.hoursView;
            this.currentView = view;
            /*if (isHours) {
              this.inputHours.classList.add('text-primary');
              this.inputMinutes.classList.remove('text-primary');
            } else {
              this.inputHours.classList.remove('text-primary');
              this.inputMinutes.classList.add('text-primary');
            }*/
            // Transition view
            hideView.classList.add('timepicker-dial-out');
            nextView.style.visibility = 'visible';
            nextView.classList.remove('timepicker-dial-out');
            // Reset clock hand
            this.resetClock(delay);
            // After transitions ended
            clearTimeout(this.toggleViewTimer);
            this.toggleViewTimer = setTimeout(() => {
                hideView.style.visibility = 'hidden';
            }, this.options.duration);
        };
        resetClock(delay) {
            const view = this.currentView, value = this[view], isHours = view === 'hours', unit = Math.PI / (isHours ? 6 : 30), radian = value * unit, radius = isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius, x = Math.sin(radian) * radius, y = -Math.cos(radian) * radius;
            if (delay) {
                this._canvas?.classList.add('timepicker-canvas-out');
                setTimeout(() => {
                    this._canvas?.classList.remove('timepicker-canvas-out');
                    this.setHand(x, y);
                }, delay);
            }
            else {
                this.setHand(x, y);
            }
        }
        _inputFromTextField = () => {
            const isHours = this.currentView === 'hours';
            if (isHours && this.inputHours.value !== '') {
                const value = parseInt(this.inputHours.value);
                if (value > 0 && value < (this.options.twelveHour ? 13 : 24)) {
                    this.hours = value;
                }
                else {
                    this.setHoursDefault();
                }
                this.drawClockFromTimeInput(this.hours, isHours);
            }
            else if (!isHours && this.inputMinutes.value !== '') {
                const value = parseInt(this.inputMinutes.value);
                if (value >= 0 && value < 60) {
                    this.minutes = value;
                }
                else {
                    this.minutes = new Date().getMinutes();
                    this.inputMinutes.value = this.minutes.toString();
                }
                this.drawClockFromTimeInput(this.minutes, isHours);
            }
        };
        drawClockFromTimeInput(value, isHours) {
            const unit = Math.PI / (isHours ? 6 : 30);
            const radian = value * unit;
            let radius;
            if (this.options.twelveHour) {
                radius = this.options.outerRadius;
            }
            else {
                radius =
                    isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius;
            }
            this.setClockAttributes(radian, radius);
        }
        setHand(x, y, roundBy5 = false) {
            const isHours = this.currentView === 'hours', unit = Math.PI / (isHours || roundBy5 ? 6 : 30), z = Math.sqrt(x * x + y * y), inner = isHours && z < (this.options.outerRadius + this.options.innerRadius) / 2;
            let radian = Math.atan2(x, -y), radius = inner ? this.options.innerRadius : this.options.outerRadius;
            if (this.options.twelveHour) {
                radius = this.options.outerRadius;
            }
            // Radian should in range [0, 2PI]
            if (radian < 0) {
                radian = Math.PI * 2 + radian;
            }
            // Get the round value
            let value = Math.round(radian / unit);
            // Get the round radian
            radian = value * unit;
            // Correct the hours or minutes
            if (this.options.twelveHour) {
                if (isHours) {
                    if (value === 0)
                        value = 12;
                }
                else {
                    if (roundBy5)
                        value *= 5;
                    if (value === 60)
                        value = 0;
                }
            }
            else {
                if (isHours) {
                    if (value === 12) {
                        value = 0;
                    }
                    value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
                }
                else {
                    if (roundBy5) {
                        value *= 5;
                    }
                    if (value === 60) {
                        value = 0;
                    }
                }
            }
            // Once hours or minutes changed, vibrate the device
            if (this[this.currentView] !== value) {
                if (this.vibrate && this.options.vibrate) {
                    // Do not vibrate too frequently
                    if (!this.vibrateTimer) {
                        navigator[this.vibrate](10);
                        this.vibrateTimer = setTimeout(() => {
                            this.vibrateTimer = null;
                        }, 100);
                    }
                }
            }
            this[this.currentView] = value;
            if (isHours) {
                this.inputHours.value = Timepicker._addLeadingZero(value);
            }
            else {
                this.inputMinutes.value = Timepicker._addLeadingZero(value);
            }
            // Set clock hand and others' position
            this.setClockAttributes(radian, radius);
        }
        setClockAttributes(radian, radius) {
            const cx1 = Math.sin(radian) * (radius - this.options.tickRadius), cy1 = -Math.cos(radian) * (radius - this.options.tickRadius), cx2 = Math.sin(radian) * radius, cy2 = -Math.cos(radian) * radius;
            this.hand.setAttribute('x2', cx1.toString());
            this.hand.setAttribute('y2', cy1.toString());
            this.bg.setAttribute('cx', cx2.toString());
            this.bg.setAttribute('cy', cy2.toString());
        }
        formatHours() {
            if (this.inputHours.value == '')
                this.setHoursDefault();
            this.inputHours.value = Timepicker._addLeadingZero(Number(this.inputHours.value));
        }
        formatMinutes() {
            if (this.inputMinutes.value == '')
                this.minutes = new Date().getMinutes();
            this.inputMinutes.value = Timepicker._addLeadingZero(Number(this.inputMinutes.value));
        }
        setHoursDefault() {
            this.hours = new Date().getHours();
            this.inputHours.value = (this.hours % (this.options.twelveHour ? 12 : 24)).toString();
        }
        done = (clearValue = null) => {
            // Set input value
            const last = this.el.value;
            let value = clearValue
                ? ''
                : Timepicker._addLeadingZero(this.hours) + ':' + Timepicker._addLeadingZero(this.minutes);
            this.time = value;
            if (!clearValue && this.options.twelveHour) {
                value = `${value} ${this.amOrPm}`;
            }
            this.el.value = value;
            // Trigger change event
            if (value !== last) {
                this.el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
            }
        };
        confirm = () => {
            this.done();
            if (typeof this.options.onDone === 'function')
                this.options.onDone.call(this);
        };
        cancel = () => {
            // not logical clearing the input field on cancel, since the end user might want to make use of the previously submitted value
            // this.clear();
            if (typeof this.options.onCancel === 'function')
                this.options.onCancel.call(this);
        };
        clear = () => {
            this.done(true);
        };
        // deprecated
        open() {
            console.warn('Timepicker.close() is deprecated. Remove this method and wrap in modal yourself.');
            return this;
        }
        close() {
            console.warn('Timepicker.close() is deprecated. Remove this method and wrap in modal yourself.');
            return this;
        }
        static {
            Timepicker._template = `<div class="timepicker-container">
          <div class="timepicker-digital-display">
            <div class="timepicker-text-container">
              <div class="timepicker-display-column timepicker-display-digital-clock">
                <div class="timepicker-input-hours-wrapper">
                  <input type="text" maxlength="2" class="timepicker-input-hours text-primary" />
                </div>
                <div class="timepicker-input-divider-wrapper">
                  <span class="timepicker-input-divider">:</span>
                </div>
                <div class="timepicker-input-minutes-wrapper">
                  <input type="text" maxlength="2" class="timepicker-input-minutes" />
                </div>
              </div>
              <div class="timepicker-display-column timepicker-display-am-pm">
                <div class="timepicker-span-am-pm"></div>
              </div>
            </div>
          </div>
          <div class="timepicker-analog-display">
            <div class="timepicker-plate">
              <div class="timepicker-canvas"></div>
              <div class="timepicker-dial timepicker-hours"></div>
              <div class="timepicker-dial timepicker-minutes timepicker-dial-out"></div>
            </div>
            <div class="timepicker-footer"></div>
          </div>
        </div>`;
        }
    }

    const _defaults$4 = {
        exitDelay: 200,
        enterDelay: 0,
        text: '',
        margin: 5,
        inDuration: 250,
        outDuration: 200,
        position: 'bottom',
        transitionMovement: 10,
        opacity: 1
    };
    class Tooltip extends Component {
        /**
         * If tooltip is open.
         */
        isOpen;
        /**
         * If tooltip is hovered.
         */
        isHovered;
        /**
         * If tooltip is focused.
         */
        isFocused;
        tooltipEl;
        _exitDelayTimeout;
        _enterDelayTimeout;
        xMovement;
        yMovement;
        constructor(el, options) {
            super(el, options, Tooltip);
            this.el['M_Tooltip'] = this;
            this.options = {
                ...Tooltip.defaults,
                ...this._getAttributeOptions(),
                ...options
            };
            this.isOpen = false;
            this.isHovered = false;
            this.isFocused = false;
            this._appendTooltipEl();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$4;
        }
        /**
         * Initializes instances of Tooltip.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Tooltip);
        }
        static getInstance(el) {
            return el['M_Tooltip'];
        }
        destroy() {
            this.tooltipEl.remove();
            this._removeEventHandlers();
            this.el['M_Tooltip'] = undefined;
        }
        _appendTooltipEl() {
            this.tooltipEl = document.createElement('div');
            this.tooltipEl.classList.add('material-tooltip');
            const tooltipContentEl = this.options.tooltipId
                ? document.getElementById(this.options.tooltipId)
                : document.createElement('div');
            this.tooltipEl.append(tooltipContentEl);
            tooltipContentEl.style.display = '';
            tooltipContentEl.classList.add('tooltip-content');
            this._setTooltipContent(tooltipContentEl);
            this.tooltipEl.appendChild(tooltipContentEl);
            document.body.appendChild(this.tooltipEl);
        }
        _setTooltipContent(tooltipContentEl) {
            if (this.options.tooltipId)
                return;
            tooltipContentEl.innerText = this.options.text;
        }
        _updateTooltipContent() {
            this._setTooltipContent(this.tooltipEl.querySelector('.tooltip-content'));
        }
        _setupEventHandlers() {
            this.el.addEventListener('mouseenter', this._handleMouseEnter);
            this.el.addEventListener('mouseleave', this._handleMouseLeave);
            this.el.addEventListener('focus', this._handleFocus, true);
            this.el.addEventListener('blur', this._handleBlur, true);
        }
        _removeEventHandlers() {
            this.el.removeEventListener('mouseenter', this._handleMouseEnter);
            this.el.removeEventListener('mouseleave', this._handleMouseLeave);
            this.el.removeEventListener('focus', this._handleFocus, true);
            this.el.removeEventListener('blur', this._handleBlur, true);
        }
        /**
         * Show tooltip.
         */
        open = (isManual) => {
            if (this.isOpen)
                return;
            isManual = isManual === undefined ? true : undefined; // Default value true
            this.isOpen = true;
            // Update tooltip content with HTML attribute options
            this.options = { ...this.options, ...this._getAttributeOptions() };
            this._updateTooltipContent();
            this._setEnterDelayTimeout(isManual);
        };
        /**
         * Hide tooltip.
         */
        close = () => {
            if (!this.isOpen)
                return;
            this.isHovered = false;
            this.isFocused = false;
            this.isOpen = false;
            this._setExitDelayTimeout();
        };
        _setExitDelayTimeout() {
            clearTimeout(this._exitDelayTimeout);
            this._exitDelayTimeout = setTimeout(() => {
                if (this.isHovered || this.isFocused)
                    return;
                this._animateOut();
            }, this.options.exitDelay);
        }
        _setEnterDelayTimeout(isManual) {
            clearTimeout(this._enterDelayTimeout);
            this._enterDelayTimeout = setTimeout(() => {
                if (!this.isHovered && !this.isFocused && !isManual)
                    return;
                this._animateIn();
            }, this.options.enterDelay);
        }
        _positionTooltip() {
            const tooltip = this.tooltipEl;
            const origin = this.el, originHeight = origin.offsetHeight, originWidth = origin.offsetWidth, tooltipHeight = tooltip.offsetHeight, tooltipWidth = tooltip.offsetWidth, margin = this.options.margin;
            this.xMovement = 0;
            this.yMovement = 0;
            let targetTop = origin.getBoundingClientRect().top + Utils.getDocumentScrollTop();
            let targetLeft = origin.getBoundingClientRect().left + Utils.getDocumentScrollLeft();
            if (this.options.position === 'top') {
                targetTop += -tooltipHeight - margin;
                targetLeft += originWidth / 2 - tooltipWidth / 2;
                this.yMovement = -this.options.transitionMovement;
            }
            else if (this.options.position === 'right') {
                targetTop += originHeight / 2 - tooltipHeight / 2;
                targetLeft += originWidth + margin;
                this.xMovement = this.options.transitionMovement;
            }
            else if (this.options.position === 'left') {
                targetTop += originHeight / 2 - tooltipHeight / 2;
                targetLeft += -tooltipWidth - margin;
                this.xMovement = -this.options.transitionMovement;
            }
            else {
                targetTop += originHeight + margin;
                targetLeft += originWidth / 2 - tooltipWidth / 2;
                this.yMovement = this.options.transitionMovement;
            }
            const newCoordinates = this._repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);
            tooltip.style.top = newCoordinates.y + 'px';
            tooltip.style.left = newCoordinates.x + 'px';
        }
        _repositionWithinScreen(x, y, width, height) {
            const scrollLeft = Utils.getDocumentScrollLeft();
            const scrollTop = Utils.getDocumentScrollTop();
            let newX = x - scrollLeft;
            let newY = y - scrollTop;
            const bounding = {
                left: newX,
                top: newY,
                width: width,
                height: height
            };
            const offset = this.options.margin + this.options.transitionMovement;
            const edges = Utils.checkWithinContainer(document.body, bounding, offset);
            if (edges.left) {
                newX = offset;
            }
            else if (edges.right) {
                newX -= newX + width - window.innerWidth;
            }
            if (edges.top) {
                newY = offset;
            }
            else if (edges.bottom) {
                newY -= newY + height - window.innerHeight;
            }
            return {
                x: newX + scrollLeft,
                y: newY + scrollTop
            };
        }
        _animateIn() {
            this._positionTooltip();
            this.tooltipEl.style.visibility = 'visible';
            const duration = this.options.inDuration;
            // easeOutCubic
            this.tooltipEl.style.transition = `
      transform ${duration}ms ease-out,
      opacity ${duration}ms ease-out`;
            setTimeout(() => {
                this.tooltipEl.style.transform = `translateX(${this.xMovement}px) translateY(${this.yMovement}px)`;
                this.tooltipEl.style.opacity = (this.options.opacity || 1).toString();
            }, 1);
        }
        _animateOut() {
            const duration = this.options.outDuration;
            // easeOutCubic
            this.tooltipEl.style.transition = `
      transform ${duration}ms ease-out,
      opacity ${duration}ms ease-out`;
            setTimeout(() => {
                this.tooltipEl.style.transform = `translateX(0px) translateY(0px)`;
                this.tooltipEl.style.opacity = '0';
            }, 1);
            /*
            anim.remove(this.tooltipEl);
            anim({
              targets: this.tooltipEl,
              opacity: 0,
              translateX: 0,
              translateY: 0,
              duration: this.options.outDuration,
              easing: 'easeOutCubic'
            });
            */
        }
        _handleMouseEnter = () => {
            this.isHovered = true;
            this.isFocused = false; // Allows close of tooltip when opened by focus.
            this.open(false);
        };
        _handleMouseLeave = () => {
            this.isHovered = false;
            this.isFocused = false; // Allows close of tooltip when opened by focus.
            this.close();
        };
        _handleFocus = () => {
            if (Utils.tabPressed) {
                this.isFocused = true;
                this.open(false);
            }
        };
        _handleBlur = () => {
            this.isFocused = false;
            this.close();
        };
        _getAttributeOptions() {
            const attributeOptions = {};
            const tooltipTextOption = this.el.getAttribute('data-tooltip');
            const tooltipId = this.el.getAttribute('data-tooltip-id');
            const positionOption = this.el.getAttribute('data-position');
            if (tooltipTextOption) {
                attributeOptions.text = tooltipTextOption;
            }
            if (positionOption) {
                attributeOptions.position = positionOption;
            }
            if (tooltipId) {
                attributeOptions.tooltipId = tooltipId;
            }
            return attributeOptions;
        }
    }

    class Waves {
        static _offset(el) {
            const box = el.getBoundingClientRect();
            const docElem = document.documentElement;
            return {
                top: box.top + window.pageYOffset - docElem.clientTop,
                left: box.left + window.pageXOffset - docElem.clientLeft
            };
        }
        // https://phoenix-dx.com/css-techniques-for-material-ripple-effect/
        static renderWaveEffect(targetElement, position = null, color = null) {
            const isCentered = position === null;
            const duration = 500;
            let animationFrame, animationStart;
            const animationStep = function (timestamp) {
                if (!animationStart) {
                    animationStart = timestamp;
                }
                const frame = timestamp - animationStart;
                if (frame < duration) {
                    const easing = (frame / duration) * (2 - frame / duration);
                    const circle = isCentered
                        ? 'circle at 50% 50%'
                        : `circle at ${position.x}px ${position.y}px`;
                    const waveColor = `rgba(${color?.r || 0}, ${color?.g || 0}, ${color?.b || 0}, ${0.3 * (1 - easing)})`;
                    const stop = 90 * easing + '%';
                    targetElement.style.backgroundImage =
                        'radial-gradient(' +
                            circle +
                            ', ' +
                            waveColor +
                            ' ' +
                            stop +
                            ', transparent ' +
                            stop +
                            ')';
                    animationFrame = window.requestAnimationFrame(animationStep);
                }
                else {
                    targetElement.style.backgroundImage = 'none';
                    window.cancelAnimationFrame(animationFrame);
                }
            };
            animationFrame = window.requestAnimationFrame(animationStep);
        }
        static Init() {
            if (typeof document !== 'undefined')
                document?.addEventListener('DOMContentLoaded', () => {
                    document.body.addEventListener('click', (e) => {
                        const trigger = e.target;
                        const el = trigger.closest('.waves-effect');
                        if (el && el.contains(trigger)) {
                            const isCircular = el.classList.contains('waves-circle');
                            const x = e.pageX - Waves._offset(el).left;
                            const y = e.pageY - Waves._offset(el).top;
                            let color = null;
                            if (el.classList.contains('waves-light'))
                                color = { r: 255, g: 255, b: 255 };
                            Waves.renderWaveEffect(el, isCircular ? null : { x, y }, color);
                        }
                    });
                });
        }
    }

    const _defaults$3 = {};
    // TODO: !!!!!
    class Range extends Component {
        _mousedown;
        value;
        thumb;
        constructor(el, options) {
            super(el, options, Range);
            this.el['M_Range'] = this;
            this.options = {
                ...Range.defaults,
                ...options
            };
            this._mousedown = false;
            this._setupThumb();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$3;
        }
        /**
         * Initializes instances of Range.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Range);
        }
        static getInstance(el) {
            return el['M_Range'];
        }
        destroy() {
            this._removeEventHandlers();
            this._removeThumb();
            this.el['M_Range'] = undefined;
        }
        _setupEventHandlers() {
            this.el.addEventListener('change', this._handleRangeChange);
            this.el.addEventListener('mousedown', this._handleRangeMousedownTouchstart);
            this.el.addEventListener('touchstart', this._handleRangeMousedownTouchstart);
            this.el.addEventListener('input', this._handleRangeInputMousemoveTouchmove);
            this.el.addEventListener('mousemove', this._handleRangeInputMousemoveTouchmove);
            this.el.addEventListener('touchmove', this._handleRangeInputMousemoveTouchmove);
            this.el.addEventListener('mouseup', this._handleRangeMouseupTouchend);
            this.el.addEventListener('touchend', this._handleRangeMouseupTouchend);
            this.el.addEventListener('blur', this._handleRangeBlurMouseoutTouchleave);
            this.el.addEventListener('mouseout', this._handleRangeBlurMouseoutTouchleave);
            this.el.addEventListener('touchleave', this._handleRangeBlurMouseoutTouchleave);
        }
        _removeEventHandlers() {
            this.el.removeEventListener('change', this._handleRangeChange);
            this.el.removeEventListener('mousedown', this._handleRangeMousedownTouchstart);
            this.el.removeEventListener('touchstart', this._handleRangeMousedownTouchstart);
            this.el.removeEventListener('input', this._handleRangeInputMousemoveTouchmove);
            this.el.removeEventListener('mousemove', this._handleRangeInputMousemoveTouchmove);
            this.el.removeEventListener('touchmove', this._handleRangeInputMousemoveTouchmove);
            this.el.removeEventListener('mouseup', this._handleRangeMouseupTouchend);
            this.el.removeEventListener('touchend', this._handleRangeMouseupTouchend);
            this.el.removeEventListener('blur', this._handleRangeBlurMouseoutTouchleave);
            this.el.removeEventListener('mouseout', this._handleRangeBlurMouseoutTouchleave);
            this.el.removeEventListener('touchleave', this._handleRangeBlurMouseoutTouchleave);
        }
        _handleRangeChange = () => {
            this.value.innerHTML = this.el.value;
            if (!this.thumb.classList.contains('active')) {
                this._showRangeBubble();
            }
            const offsetLeft = this._calcRangeOffset();
            this.thumb.classList.add('active');
            this.thumb.style.left = offsetLeft + 'px';
        };
        _handleRangeMousedownTouchstart = (e) => {
            // Set indicator value
            this.value.innerHTML = this.el.value;
            this._mousedown = true;
            this.el.classList.add('active');
            if (!this.thumb.classList.contains('active')) {
                this._showRangeBubble();
            }
            if (e.type !== 'input') {
                const offsetLeft = this._calcRangeOffset();
                this.thumb.classList.add('active');
                this.thumb.style.left = offsetLeft + 'px';
            }
        };
        _handleRangeInputMousemoveTouchmove = () => {
            if (this._mousedown) {
                if (!this.thumb.classList.contains('active')) {
                    this._showRangeBubble();
                }
                const offsetLeft = this._calcRangeOffset();
                this.thumb.classList.add('active');
                this.thumb.style.left = offsetLeft + 'px';
                this.value.innerHTML = this.el.value;
            }
        };
        _handleRangeMouseupTouchend = () => {
            this._mousedown = false;
            this.el.classList.remove('active');
        };
        _handleRangeBlurMouseoutTouchleave = () => {
            if (!this._mousedown) {
                const paddingLeft = parseInt(getComputedStyle(this.el).paddingLeft);
                const marginLeftText = 7 + paddingLeft + 'px';
                if (this.thumb.classList.contains('active')) {
                    const duration = 100;
                    // from
                    this.thumb.style.transition = 'none';
                    setTimeout(() => {
                        this.thumb.style.transition = `
            height ${duration}ms ease,
            width ${duration}ms ease,
            top ${duration}ms ease,
            margin ${duration}ms ease
          `;
                        // to
                        this.thumb.style.height = '0';
                        this.thumb.style.width = '0';
                        this.thumb.style.top = '0';
                        this.thumb.style.marginLeft = marginLeftText;
                    }, 1);
                }
                this.thumb.classList.remove('active');
            }
        };
        _setupThumb() {
            this.thumb = document.createElement('span');
            this.value = document.createElement('span');
            this.thumb.classList.add('thumb');
            this.value.classList.add('value');
            this.thumb.append(this.value);
            this.el.after(this.thumb);
        }
        _removeThumb() {
            this.thumb.remove();
        }
        _showRangeBubble() {
            const paddingLeft = parseInt(getComputedStyle(this.thumb.parentElement).paddingLeft);
            const marginLeftText = -7 + paddingLeft + 'px'; // TODO: fix magic number?
            const duration = 300;
            // easeOutQuint
            this.thumb.style.transition = `
      height ${duration}ms ease,
      width ${duration}ms ease,
      top ${duration}ms ease,
      margin ${duration}ms ease
    `;
            // to
            this.thumb.style.height = '30px';
            this.thumb.style.width = '30px';
            this.thumb.style.top = '-30px';
            this.thumb.style.marginLeft = marginLeftText;
        }
        _calcRangeOffset() {
            const width = this.el.getBoundingClientRect().width - 15;
            const max = parseFloat(this.el.getAttribute('max')) || 100; // Range default max
            const min = parseFloat(this.el.getAttribute('min')) || 0; // Range default min
            const percent = (parseFloat(this.el.value) - min) / (max - min);
            return percent * width;
        }
        /**
         * Initializes every range input in the current document.
         */
        static Init() {
            if (typeof document !== 'undefined')
                Range.init(document?.querySelectorAll('input[type=range]'), {});
        }
    }

    const _defaults$2 = Object.freeze({});
    class CharacterCounter extends Component {
        /** Stores the reference to the counter HTML element. */
        counterEl;
        /** Specifies whether the input is valid or not. */
        isInvalid;
        /** Specifies whether the input text has valid length or not. */
        isValidLength;
        constructor(el, options) {
            super(el, {}, CharacterCounter);
            this.el['M_CharacterCounter'] = this;
            this.options = {
                ...CharacterCounter.defaults,
                ...options
            };
            this.isInvalid = false;
            this.isValidLength = false;
            this._setupCounter();
            this._setupEventHandlers();
        }
        static get defaults() {
            return _defaults$2;
        }
        /**
         * Initializes instances of CharacterCounter.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, CharacterCounter);
        }
        static getInstance(el) {
            return el['M_CharacterCounter'];
        }
        destroy() {
            this._removeEventHandlers();
            this.el['CharacterCounter'] = undefined;
            this._removeCounter();
        }
        _setupEventHandlers() {
            this.el.addEventListener('focus', this.updateCounter, true);
            this.el.addEventListener('input', this.updateCounter, true);
        }
        _removeEventHandlers() {
            this.el.removeEventListener('focus', this.updateCounter, true);
            this.el.removeEventListener('input', this.updateCounter, true);
        }
        _setupCounter() {
            this.counterEl = document.createElement('span');
            this.counterEl.classList.add('character-counter');
            this.counterEl.style.float = 'right';
            this.counterEl.style.fontSize = '12px';
            this.counterEl.style.height = '1';
            this.el.parentElement.appendChild(this.counterEl);
        }
        _removeCounter() {
            this.counterEl.remove();
        }
        updateCounter = () => {
            const maxLength = parseInt(this.el.getAttribute('maxlength')), actualLength = this.el.value.length;
            this.isValidLength = actualLength <= maxLength;
            let counterString = actualLength.toString();
            if (maxLength) {
                counterString += '/' + maxLength;
                this._validateInput();
            }
            this.counterEl.innerHTML = counterString;
        };
        _validateInput() {
            if (this.isValidLength && this.isInvalid) {
                this.isInvalid = false;
                this.el.classList.remove('invalid');
            }
            else if (!this.isValidLength && !this.isInvalid) {
                this.isInvalid = true;
                this.el.classList.remove('valid');
                this.el.classList.add('invalid');
            }
        }
    }

    const _defaults$1 = {
        indicators: true,
        height: 400,
        duration: 500,
        interval: 6000,
        pauseOnFocus: true,
        pauseOnHover: true,
        indicatorLabelFunc: null // Function which will generate a label for the indicators (ARIA)
    };
    class Slider extends Component {
        /** Index of current slide. */
        activeIndex;
        interval;
        eventPause;
        _slider;
        _slides;
        _activeSlide;
        _indicators;
        _hovered;
        _focused;
        _focusCurrent;
        _sliderId;
        constructor(el, options) {
            super(el, options, Slider);
            this.el['M_Slider'] = this;
            this.options = {
                ...Slider.defaults,
                ...options
            };
            // init props
            this.interval = null;
            this.eventPause = false;
            this._hovered = false;
            this._focused = false;
            this._focusCurrent = false;
            // setup
            this._slider = this.el.querySelector('.slides');
            this._slides = Array.from(this._slider.querySelectorAll('li'));
            this.activeIndex = this._slides.findIndex((li) => li.classList.contains('active'));
            if (this.activeIndex !== -1) {
                this._activeSlide = this._slides[this.activeIndex];
            }
            this._setSliderHeight();
            // Sets element id if it does not have one
            if (this._slider.hasAttribute('id'))
                this._sliderId = this._slider.getAttribute('id');
            else {
                this._sliderId = 'slider-' + Utils.guid();
                this._slider.setAttribute('id', this._sliderId);
            }
            const placeholderBase64 = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            // Set initial positions of captions
            this._slides.forEach((slide) => {
                // Caption
                //const caption = <HTMLElement|null>slide.querySelector('.caption');
                //if (caption) this._animateCaptionIn(caption, 0);
                // Set Images as Background Images
                const img = slide.querySelector('img');
                if (img) {
                    if (img.src !== placeholderBase64) {
                        img.style.backgroundImage = 'url(' + img.src + ')';
                        img.src = placeholderBase64;
                    }
                }
                // Sets slide as focusable by code
                if (!slide.hasAttribute('tabindex'))
                    slide.setAttribute('tabindex', '-1');
                // Removes initial visibility from "inactive" slides
                slide.style.visibility = 'hidden';
            });
            this._setupIndicators();
            // Show active slide
            if (this._activeSlide) {
                this._activeSlide.style.display = 'block';
                this._activeSlide.style.visibility = 'visible';
            }
            else {
                this.activeIndex = 0;
                this._slides[0].classList.add('active');
                this._slides[0].style.visibility = 'visible';
                this._activeSlide = this._slides[0];
                this._animateSlide(this._slides[0], true);
                // Update indicators
                if (this.options.indicators) {
                    this._indicators[this.activeIndex].children[0].classList.add('active');
                }
            }
            this._setupEventHandlers();
            // auto scroll
            this.start();
        }
        static get defaults() {
            return _defaults$1;
        }
        /**
         * Initializes instances of Slider.
         * @param els HTML elements.
         * @param options Component options.
         */
        static init(els, options = {}) {
            return super.init(els, options, Slider);
        }
        static getInstance(el) {
            return el['M_Slider'];
        }
        destroy() {
            this.pause();
            this._removeIndicators();
            this._removeEventHandlers();
            this.el['M_Slider'] = undefined;
        }
        _setupEventHandlers() {
            if (this.options.pauseOnFocus) {
                this.el.addEventListener('focusin', this._handleAutoPauseFocus);
                this.el.addEventListener('focusout', this._handleAutoStartFocus);
            }
            if (this.options.pauseOnHover) {
                this.el.addEventListener('mouseenter', this._handleAutoPauseHover);
                this.el.addEventListener('mouseleave', this._handleAutoStartHover);
            }
            if (this.options.indicators) {
                this._indicators.forEach((el) => {
                    el.addEventListener('click', this._handleIndicatorClick);
                });
            }
        }
        _removeEventHandlers() {
            if (this.options.pauseOnFocus) {
                this.el.removeEventListener('focusin', this._handleAutoPauseFocus);
                this.el.removeEventListener('focusout', this._handleAutoStartFocus);
            }
            if (this.options.pauseOnHover) {
                this.el.removeEventListener('mouseenter', this._handleAutoPauseHover);
                this.el.removeEventListener('mouseleave', this._handleAutoStartHover);
            }
            if (this.options.indicators) {
                this._indicators.forEach((el) => {
                    el.removeEventListener('click', this._handleIndicatorClick);
                });
            }
        }
        _handleIndicatorClick = (e) => {
            const el = e.target.parentElement;
            const currIndex = [...el.parentNode.children].indexOf(el);
            this._focusCurrent = true;
            this.set(currIndex);
        };
        _handleAutoPauseHover = () => {
            this._hovered = true;
            if (this.interval != null) {
                this._pause(true);
            }
        };
        _handleAutoPauseFocus = () => {
            this._focused = true;
            if (this.interval != null) {
                this._pause(true);
            }
        };
        _handleAutoStartHover = () => {
            this._hovered = false;
            if (!(this.options.pauseOnFocus && this._focused) && this.eventPause) {
                this.start();
            }
        };
        _handleAutoStartFocus = () => {
            this._focused = false;
            if (!(this.options.pauseOnHover && this._hovered) && this.eventPause) {
                this.start();
            }
        };
        _handleInterval = () => {
            const activeElem = this._slider.querySelector('.active');
            let newActiveIndex = [...activeElem.parentNode.children].indexOf(activeElem);
            if (this._slides.length === newActiveIndex + 1)
                newActiveIndex = 0; // loop to start
            else
                newActiveIndex += 1;
            this.set(newActiveIndex);
        };
        _animateSlide(slide, isDirectionIn) {
            let dx = 0, dy = 0;
            // from
            slide.style.opacity = isDirectionIn ? '0' : '1';
            setTimeout(() => {
                slide.style.transition = `opacity ${this.options.duration}ms ease`;
                // to
                slide.style.opacity = isDirectionIn ? '1' : '0';
            }, 1);
            // Caption
            const caption = slide.querySelector('.caption');
            if (!caption)
                return;
            if (caption.classList.contains('center-align'))
                dy = -100;
            else if (caption.classList.contains('right-align'))
                dx = 100;
            else if (caption.classList.contains('left-align'))
                dx = -100;
            // from
            caption.style.opacity = isDirectionIn ? '0' : '1';
            caption.style.transform = isDirectionIn ? `translate(${dx}px, ${dy}px)` : `translate(0, 0)`;
            setTimeout(() => {
                caption.style.transition = `opacity ${this.options.duration}ms ease, transform ${this.options.duration}ms ease`;
                // to
                caption.style.opacity = isDirectionIn ? '1' : '0';
                caption.style.transform = isDirectionIn ? `translate(0, 0)` : `translate(${dx}px, ${dy}px)`;
            }, this.options.duration); // delay
        }
        _setSliderHeight() {
            // If fullscreen, do nothing
            if (!this.el.classList.contains('fullscreen')) {
                if (this.options.indicators) {
                    // Add height if indicators are present
                    this.el.style.height = this.options.height + 40 + 'px'; //.css('height', this.options.height + 40 + 'px');
                }
                else {
                    this.el.style.height = this.options.height + 'px';
                }
                this._slider.style.height = this.options.height + 'px';
            }
        }
        _setupIndicators() {
            if (this.options.indicators) {
                const ul = document.createElement('ul');
                ul.classList.add('indicators');
                const arrLi = [];
                this._slides.forEach((el, i) => {
                    const label = this.options.indicatorLabelFunc
                        ? this.options.indicatorLabelFunc.call(this, i + 1, i === 0)
                        : `${i + 1}`;
                    const li = document.createElement('li');
                    li.classList.add('indicator-item');
                    li.innerHTML = `<button type="button" class="indicator-item-btn" aria-label="${label}" aria-controls="${this._sliderId}"></button>`;
                    arrLi.push(li);
                    ul.append(li);
                });
                this.el.append(ul);
                this._indicators = arrLi;
            }
        }
        _removeIndicators() {
            this.el.querySelector('ul.indicators').remove(); //find('ul.indicators').remove();
        }
        set(index) {
            // Wrap around indices.
            if (index >= this._slides.length)
                index = 0;
            else if (index < 0)
                index = this._slides.length - 1;
            // Only do if index changes
            if (this.activeIndex === index)
                return;
            this._activeSlide = this._slides[this.activeIndex];
            const _caption = this._activeSlide.querySelector('.caption');
            this._activeSlide.classList.remove('active');
            // Enables every slide
            this._slides.forEach((slide) => (slide.style.visibility = 'visible'));
            //--- Hide active Slide + Caption
            this._activeSlide.style.opacity = '0';
            setTimeout(() => {
                this._slides.forEach((slide) => {
                    if (slide.classList.contains('active'))
                        return;
                    slide.style.opacity = '0';
                    slide.style.transform = 'translate(0, 0)';
                    // Disables invisible slides (for assistive technologies)
                    slide.style.visibility = 'hidden';
                });
            }, this.options.duration);
            // Hide active Caption
            //this._animateCaptionIn(_caption, this.options.duration);
            _caption.style.opacity = '0';
            // Update indicators
            if (this.options.indicators) {
                const activeIndicator = this._indicators[this.activeIndex].children[0];
                const nextIndicator = this._indicators[index].children[0];
                activeIndicator.classList.remove('active');
                nextIndicator.classList.add('active');
                if (typeof this.options.indicatorLabelFunc === 'function') {
                    activeIndicator.ariaLabel = this.options.indicatorLabelFunc.call(this, this.activeIndex, false);
                    nextIndicator.ariaLabel = this.options.indicatorLabelFunc.call(this, index, true);
                }
            }
            //--- Show new Slide + Caption
            this._animateSlide(this._slides[index], true);
            this._slides[index].classList.add('active');
            this.activeIndex = index;
            // Reset interval, if allowed. This check prevents autostart
            // when slider is paused, since it can be changed though indicators.
            if (this.interval != null) {
                this.start();
            }
        }
        _pause(fromEvent) {
            clearInterval(this.interval);
            this.eventPause = fromEvent;
            this.interval = null;
        }
        /**
         * Pause slider autoslide.
         */
        pause = () => {
            this._pause(false);
        };
        /**
         * Start slider autoslide.
         */
        start = () => {
            clearInterval(this.interval);
            this.interval = setInterval(this._handleInterval, this.options.duration + this.options.interval);
            this.eventPause = false;
        };
        /**
         * Move to next slider.
         */
        next = () => {
            let newIndex = this.activeIndex + 1;
            // Wrap around indices.
            if (newIndex >= this._slides.length)
                newIndex = 0;
            else if (newIndex < 0)
                newIndex = this._slides.length - 1;
            this.set(newIndex);
        };
        /**
         * Move to prev slider.
         */
        prev = () => {
            let newIndex = this.activeIndex - 1;
            // Wrap around indices.
            if (newIndex >= this._slides.length)
                newIndex = 0;
            else if (newIndex < 0)
                newIndex = this._slides.length - 1;
            this.set(newIndex);
        };
    }

    const _defaults = {
        text: '',
        displayLength: 4000,
        inDuration: 300,
        outDuration: 375,
        classes: '',
        completeCallback: null,
        activationPercent: 0.8
    };
    class Toast {
        /** The toast element. */
        el;
        /**
         * The remaining amount of time in ms that the toast
         * will stay before dismissal.
         */
        timeRemaining;
        /**
         * Describes the current pan state of the Toast.
         */
        panning;
        options;
        message;
        counterInterval;
        wasSwiped;
        startingXPos;
        xPos;
        time;
        deltaX;
        velocityX;
        static _toasts;
        static _container;
        static _draggedToast;
        constructor(options) {
            this.options = {
                ...Toast.defaults,
                ...options
            };
            this.message = this.options.text;
            this.panning = false;
            this.timeRemaining = this.options.displayLength;
            if (Toast._toasts.length === 0) {
                Toast._createContainer();
            }
            // Create new toast
            Toast._toasts.push(this);
            const toastElement = this._createToast();
            toastElement['M_Toast'] = this;
            this.el = toastElement;
            this._animateIn();
            this._setTimer();
        }
        static get defaults() {
            return _defaults;
        }
        static getInstance(el) {
            return el['M_Toast'];
        }
        static _createContainer() {
            const container = document.createElement('div');
            container.setAttribute('id', 'toast-container');
            // Add event handler
            container.addEventListener('touchstart', Toast._onDragStart);
            container.addEventListener('touchmove', Toast._onDragMove);
            container.addEventListener('touchend', Toast._onDragEnd);
            container.addEventListener('mousedown', Toast._onDragStart);
            document.addEventListener('mousemove', Toast._onDragMove);
            document.addEventListener('mouseup', Toast._onDragEnd);
            document.body.appendChild(container);
            Toast._container = container;
        }
        static _removeContainer() {
            document.removeEventListener('mousemove', Toast._onDragMove);
            document.removeEventListener('mouseup', Toast._onDragEnd);
            Toast._container.remove();
            Toast._container = null;
        }
        static _onDragStart(e) {
            if (e.target && e.target.closest('.toast')) {
                const toastElem = e.target.closest('.toast');
                const toast = toastElem['M_Toast'];
                toast.panning = true;
                Toast._draggedToast = toast;
                toast.el.classList.add('panning');
                toast.el.style.transition = '';
                toast.startingXPos = Toast._xPos(e);
                toast.time = Date.now();
                toast.xPos = Toast._xPos(e);
            }
        }
        static _onDragMove(e) {
            if (!!Toast._draggedToast) {
                e.preventDefault();
                const toast = Toast._draggedToast;
                toast.deltaX = Math.abs(toast.xPos - Toast._xPos(e));
                toast.xPos = Toast._xPos(e);
                toast.velocityX = toast.deltaX / (Date.now() - toast.time);
                toast.time = Date.now();
                const totalDeltaX = toast.xPos - toast.startingXPos;
                const activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
                toast.el.style.transform = `translateX(${totalDeltaX}px)`;
                toast.el.style.opacity = (1 - Math.abs(totalDeltaX / activationDistance)).toString();
            }
        }
        static _onDragEnd() {
            if (!!Toast._draggedToast) {
                const toast = Toast._draggedToast;
                toast.panning = false;
                toast.el.classList.remove('panning');
                const totalDeltaX = toast.xPos - toast.startingXPos;
                const activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
                const shouldBeDismissed = Math.abs(totalDeltaX) > activationDistance || toast.velocityX > 1;
                // Remove toast
                if (shouldBeDismissed) {
                    toast.wasSwiped = true;
                    toast.dismiss();
                    // Animate toast back to original position
                }
                else {
                    toast.el.style.transition = 'transform .2s, opacity .2s';
                    toast.el.style.transform = '';
                    toast.el.style.opacity = '';
                }
                Toast._draggedToast = null;
            }
        }
        static _xPos(e) {
            if (e.type.startsWith('touch') && e.targetTouches.length >= 1) {
                return e.targetTouches[0].clientX;
            }
            // mouse event
            return e.clientX;
        }
        /**
         * dismiss all toasts.
         */
        static dismissAll() {
            for (const toastIndex in Toast._toasts) {
                Toast._toasts[toastIndex].dismiss();
            }
        }
        _createToast() {
            let toast = this.options.toastId
                ? document.getElementById(this.options.toastId)
                : document.createElement('div');
            if (toast instanceof HTMLTemplateElement) {
                const node = toast.content.cloneNode(true);
                toast = node.firstElementChild;
            }
            toast.classList.add('toast');
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');
            // Add custom classes onto toast
            if (this.options.classes.length > 0) {
                toast.classList.add(...this.options.classes.split(' '));
            }
            if (this.message)
                toast.innerText = this.message;
            Toast._container.appendChild(toast);
            return toast;
        }
        _animateIn() {
            // Animate toast in
            this.el.style.display = '';
            this.el.style.opacity = '0';
            // easeOutCubic
            this.el.style.transition = `
      top ${this.options.inDuration}ms ease,
      opacity ${this.options.inDuration}ms ease
    `;
            setTimeout(() => {
                this.el.style.top = '0';
                this.el.style.opacity = '1';
            }, 1);
        }
        /**
         * Create setInterval which automatically removes toast when timeRemaining >= 0
         * has been reached.
         */
        _setTimer() {
            if (this.timeRemaining !== Infinity) {
                this.counterInterval = setInterval(() => {
                    // If toast is not being dragged, decrease its time remaining
                    if (!this.panning) {
                        this.timeRemaining -= 20;
                    }
                    // Animate toast out
                    if (this.timeRemaining <= 0) {
                        this.dismiss();
                    }
                }, 20);
            }
        }
        /**
         * Dismiss toast with animation.
         */
        dismiss() {
            clearInterval(this.counterInterval);
            const activationDistance = this.el.offsetWidth * this.options.activationPercent;
            if (this.wasSwiped) {
                this.el.style.transition = 'transform .05s, opacity .05s';
                this.el.style.transform = `translateX(${activationDistance}px)`;
                this.el.style.opacity = '0';
            }
            // easeOutExpo
            this.el.style.transition = `
      margin ${this.options.outDuration}ms ease,
      opacity ${this.options.outDuration}ms ease`;
            setTimeout(() => {
                this.el.style.opacity = '0';
                this.el.style.marginTop = '-40px';
            }, 1);
            setTimeout(() => {
                // Call the optional callback
                if (typeof this.options.completeCallback === 'function') {
                    this.options.completeCallback();
                }
                // Remove toast from DOM
                if (this.el.id != this.options.toastId) {
                    this.el.remove();
                    Toast._toasts.splice(Toast._toasts.indexOf(this), 1);
                    if (Toast._toasts.length === 0) {
                        Toast._removeContainer();
                    }
                }
            }, this.options.outDuration);
        }
        static {
            Toast._toasts = [];
            Toast._container = null;
            Toast._draggedToast = null;
        }
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const version = '2.2.2';
    /**
     * Automatically initialize components.
     * @param context Root element to initialize. Defaults to `document.body`.
     * @param options Options for each component.
     */
    function AutoInit(context = document.body, options) {
        const registry = {
            Autocomplete: context.querySelectorAll('.autocomplete:not(.no-autoinit)'),
            Cards: context.querySelectorAll('.cards:not(.no-autoinit)'),
            Carousel: context.querySelectorAll('.carousel:not(.no-autoinit)'),
            Chips: context.querySelectorAll('.chips:not(.no-autoinit)'),
            Collapsible: context.querySelectorAll('.collapsible:not(.no-autoinit)'),
            Datepicker: context.querySelectorAll('.datepicker:not(.no-autoinit)'),
            Dropdown: context.querySelectorAll('.dropdown-trigger:not(.no-autoinit)'),
            Materialbox: context.querySelectorAll('.materialboxed:not(.no-autoinit)'),
            Modal: context.querySelectorAll('.modal:not(.no-autoinit)'),
            Parallax: context.querySelectorAll('.parallax:not(.no-autoinit)'),
            Pushpin: context.querySelectorAll('.pushpin:not(.no-autoinit)'),
            ScrollSpy: context.querySelectorAll('.scrollspy:not(.no-autoinit)'),
            FormSelect: context.querySelectorAll('select:not(.no-autoinit)'),
            Sidenav: context.querySelectorAll('.sidenav:not(.no-autoinit)'),
            Tabs: context.querySelectorAll('.tabs:not(.no-autoinit)'),
            TapTarget: context.querySelectorAll('.tap-target:not(.no-autoinit)'),
            Timepicker: context.querySelectorAll('.timepicker:not(.no-autoinit)'),
            Tooltip: context.querySelectorAll('.tooltipped:not(.no-autoinit)'),
            FloatingActionButton: context.querySelectorAll('.fixed-action-btn:not(.no-autoinit)')
        };
        Autocomplete.init(registry.Autocomplete, options?.Autocomplete ?? {});
        Cards.init(registry.Cards, options?.Cards ?? {});
        Carousel.init(registry.Carousel, options?.Carousel ?? {});
        Chips.init(registry.Chips, options?.Chips ?? {});
        Collapsible.init(registry.Collapsible, options?.Collapsible ?? {});
        Datepicker.init(registry.Datepicker, options?.Datepicker ?? {});
        Dropdown.init(registry.Dropdown, options?.Dropdown ?? {});
        Materialbox.init(registry.Materialbox, options?.Materialbox ?? {});
        Modal.init(registry.Modal, options?.Modal ?? {});
        Parallax.init(registry.Parallax, options?.Parallax ?? {});
        Pushpin.init(registry.Pushpin, options?.Pushpin ?? {});
        ScrollSpy.init(registry.ScrollSpy, options?.ScrollSpy ?? {});
        FormSelect.init(registry.FormSelect, options?.FormSelect ?? {});
        Sidenav.init(registry.Sidenav, options?.Sidenav ?? {});
        Tabs.init(registry.Tabs, options?.Tabs ?? {});
        TapTarget.init(registry.TapTarget, options?.TapTarget ?? {});
        Timepicker.init(registry.Timepicker, options?.Timepicker ?? {});
        Tooltip.init(registry.Tooltip, options?.Tooltip ?? {});
        FloatingActionButton.init(registry.FloatingActionButton, options?.FloatingActionButton ?? {});
    }
    // Init
    if (typeof document !== 'undefined') {
        document.addEventListener('keydown', Utils.docHandleKeydown, true);
        document.addEventListener('keyup', Utils.docHandleKeyup, true);
        document.addEventListener('focus', Utils.docHandleFocus, true);
        document.addEventListener('blur', Utils.docHandleBlur, true);
    }
    Forms.Init();
    Chips.Init();
    Waves.Init();
    Range.Init();
    Cards.Init();

    exports.AutoInit = AutoInit;
    exports.Autocomplete = Autocomplete;
    exports.Cards = Cards;
    exports.Carousel = Carousel;
    exports.CharacterCounter = CharacterCounter;
    exports.Chips = Chips;
    exports.Collapsible = Collapsible;
    exports.Datepicker = Datepicker;
    exports.Dropdown = Dropdown;
    exports.FloatingActionButton = FloatingActionButton;
    exports.FormSelect = FormSelect;
    exports.Forms = Forms;
    exports.Materialbox = Materialbox;
    exports.Modal = Modal;
    exports.Parallax = Parallax;
    exports.Pushpin = Pushpin;
    exports.Range = Range;
    exports.ScrollSpy = ScrollSpy;
    exports.Sidenav = Sidenav;
    exports.Slider = Slider;
    exports.Tabs = Tabs;
    exports.TapTarget = TapTarget;
    exports.Timepicker = Timepicker;
    exports.Toast = Toast;
    exports.Tooltip = Tooltip;
    exports.Waves = Waves;
    exports.version = version;

    return exports;

})({});
