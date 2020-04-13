const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        language: false
    },

    // language: {
    //     ru: [
    //         "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    //         "TAB", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "DEL",
    //         "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ENTER",
    //         "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "↑", "SHIFT",
    //         "CTRL", "Win", "ALT", "Space", "ALT", "CTRL", "←", "↓", "→"
    //     ],
    //     eng:[
    //         '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
    //         'TAB', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'DEL',
    //         'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'ENTER',
    //         'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'SHIFT',
    //         'CTRL', 'Win', 'ALT', 'Space', 'ALT', 'CTRL', '←', '↓', '→'
    //         ]
    // },

    init() {
        this.addToDOMKeyboard();
        // СОЗДАЕМ textarea ЭЛЕМЕНТ
        this.elements.textarea = document.createElement("textarea");
       
        // ADD CLASSES
        this.elements.textarea.classList.add("use-keyboard");
        this.elements.main.classList.add("keyboard--hidden");
    
        //ADD to DOM
        document.body.appendChild(this.elements.textarea);

        this.elements.textarea.addEventListener('keydown', (event) => {
            console.log(event);
            
        });
        

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    addToDOMKeyboard() {
        // СОЗДАЕМ ГЛАВНЫЕ ЭЛЕМЕНТЫ
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        
        // ADD CLASSES
        this.elements.main.classList.add("keyboard");
        this.elements.main.id = "keyboard";
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

         //ADD to DOM
         this.elements.main.appendChild(this.elements.keysContainer);
         document.body.appendChild(this.elements.main);
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = this.properties.language === false ? [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "TAB", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "DEL",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ENTER",
            "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "↑", "SHIFT",
            "CTRL", "Win", "ALT", "Space", "ALT", "CTRL", "←", "↓", "→"
        ] : [
            '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
            'TAB', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'DEL',
            'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'ENTER',
            'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'SHIFT',
            'CTRL', 'Win', 'ALT', 'Space', 'ALT', 'CTRL', '←', '↓', '→'
            ];

        const codes = [
            'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
            'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete',
            'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
            'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight',
            'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'End',
          ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["Backspace", "DEL", "ENTER", "SHIFT", "→"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "ENTER":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "TAB":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("sync_alt");

                    keyElement.addEventListener("click", () => {
                        this.properties.value +=  "\t";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "DEL":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("delete");

                    break;

                case "Shift":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("arrow_upward");

                    break;

                case "Win":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("view_headline");
                    
                    keyElement.addEventListener("click", () => {
                        // console.log(this.properties.language)
                        // this.properties.language = this.properties.language === false ? true : false ;
                        this._toggleLanguage();
                    });

                    break;

                case "CTRL":
                    keyElement.classList.add("keyboard__key--wide", "action--key");
                    keyElement.innerText = "CTRL";

                    break;
                
                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", (event) => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                        console.log(event.target)
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        
        for (const key of this.elements.keys) {
            // console.log(key)
            if (key.textContent.length === 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleLanguage() {
        this.properties.language = !this.properties.language;

        let elem = document.getElementById('keyboard');
        elem.parentNode.removeChild(elem);
        this.elements.main = null;
        this.elements.keysContainer = null;
        this.elements.keys = null;

        this.addToDOMKeyboard();

        // console.log(this.elements.keys)
        
},

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});