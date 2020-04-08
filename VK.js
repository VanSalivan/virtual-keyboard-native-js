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

        //ADD to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },
    
    _creatKeys() {
        //"ПРИВАТНЫЙ" МЕТОД СОЗДАНИЯ HTML СТРУКТУРЫ
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ъ", " \ ", "DEL",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ENTER",
            "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "↑", "Shift",
            "Ctrl", "Win", "Alt", "Space" , "Alt", "Ctrl", "←", "↓", "→"
        ];
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
