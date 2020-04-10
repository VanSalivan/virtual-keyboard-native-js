const Keyboard = {
    elements: {
        main: null,
        textarea:null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {  //РАБОТАЕТ КОГДА КЛАВИАТУРА ПОЛУЧАЕТ ВВОД ИЛИ ЗАКРЫВАЕТСЯ
        onInput: null,
        onClose: null,
    },

    properties: {  //СОДЕРЖИТ ЗНАЧЕНИЯ ТЕКУЩИХ СОСТОЯНИЙ
        value: "",
        capsLock: false,
        shift: false,
    },

    init() {
        // СОЗДАЕМ ГЛАВНЫЕ ЭЛЕМЕНТЫ
        this.elements.textarea = document.createElement("textarea")
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        

        // ADD CLASSES
        this.elements.textarea.classList.add("use-keyboard");
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._creatKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        //ADD to DOM
        document.body.appendChild(this.elements.textarea);
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
       

        //AUTO USE KEYBOARD
        document.querySelectorAll(".use-keyboard").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                })
            })
        })
    },

    _creatKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayoutRu = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "TAB", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "DEL",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ENTER",
            "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "↑", "SHIFT",
            "CTRL", "Win", "ALT", "Space", "ALT", "CTRL", "←", "↓", "→"
        ];
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };


        keyLayoutRu.forEach(key => {
            const keyElement = document.createElement("button");
            const insertBR = ["Backspace", "DEL", "ENTER", "SHIFT", "→"].indexOf(key) !== -1;

            //ADD attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide", "action--key");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('onInput');
                    });

                    break;

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "ENTER":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '/n';
                        this._triggerEvent('onInput');
                    });

                    break;

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener('click', () => {
                        this.properties.value += " ";
                        this._triggerEvent('onInput');
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener('click', () => {
                        this.close();
                        this._triggerEvent('onClose');
                    });

                    break;

                case "TAB":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("sync_alt");

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

                    break;

                case "CTRL":
                    keyElement.classList.add("keyboard__key--wide","action--key");
                    keyElement.innerText = "CTRL";

                    break;

                default:
                    keyElement.textContent = key.toLocaleLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.capsLock ? key.toUpperCase() : key.toLocaleLowerCase();
                        this._triggerEvent('onInput');
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertBR) {
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
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            } if (key.classList.value === "keyboard__key keyboard__key--wide action--key") {
                console.log('Сделать буквы все время большими')
            }

        }
    },

    open(initialValue, onInput, onClose) {
        this.properties.value = initialValue || " ";
        this.eventHandlers.onInput = onInput;
        this.eventHandlers.onClose = onClose;
        this.elements.main.classList.remove("keyboard--hidden")

    },

    close() {
        this.properties.value = "";
        this.eventHandlers.onInput = onInput;
        this.eventHandlers.onClose = onClose;
        this.elements.main.classList.add("keyboard--hidden")
    }
};


window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init();
});
