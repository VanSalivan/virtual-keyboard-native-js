const Keyboard = {
    elements: {
        main: null,
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
    },

    init() {
        // СОЗДАЕМ ГЛАВНЫЕ ЭЛЕМЕНТЫ
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // ADD CLASSES
        this.elements.main.classList.add("keyboard", "1keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._creatKeys());

        //ADD to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },

    _creatKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ъ", "DEL",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ENTER",
            "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "SHIFT", "↑",
            "Ctrl", "Win", "Alt", "Space", "Alt", "Ctrl", "←", "↓", "→"
        ];
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertBR = ["Backspace", "DEL", "ENTER", "↑", "→"].indexOf(key) !== -1;

            //ADD attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide");
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
                    keyElement.classList.add("keyboard__key--extra-wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener('click', () => {
                        this.close();
                        this._triggerEvent('onClose');
                    });

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
        console.log(handlerName + 'РАБОТАЕТ!')
    },

    _toggleCapsLock() {
        console.log('CapsLock РАБОТАЕТ!')
    },

    open(initialValue, onInput, onClose) {

    },

    close() {

    }
};


window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init();
});
