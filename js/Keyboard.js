/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */

import * as storage from './storage.js';
import create from './utils/create.js';
import language from './layouts/index.js'; // { en, ru }
import Key from './Key.js';

const main = create("main", "",
  [create("h1", "title", "RSS Virtual Keyboard"),
    create("h3", "subtitle", "Keyboard for Windows"),
    create("p", "hint", "Левый <kbd>Shift</kbd> + <kbd>Alt</kbd> Для смены языка. Последний язык храниться в localstorage")]);

export default class Keyboard {
  constructor(keyOrder) {
    this.keyOrder = keyOrder;
    this.keyPress = {};
    this.Caps = false;
  }

  init(langCode) { // ru, en
    this.keyBase = language[langCode];
    this.textArea = create("textarea", "output", null, main,
      ["placeholder", "Start type something..."],
      ["rows", 5],
      ["cols", 50],
      ["spellcheck", false],
      ["autocorrect", "off"]);

    this.container = create("div", "keyboard", null, main, ["language", langCode]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = []; // Key()
    this.keyOrder.forEach((row, index) => {
      const rowElement = create("div", "keyboard__row", null, this.container, ["row", index + 1]);
      row.forEach((code) => { // Каждый объект кнопки
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.divContainer);
        }
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.container.onmousedown = this.preHandleEvent;
    this.container.onmouseup = this.preHandleEvent;
  }

  preHandleEvent = (e) => {
    e.stopPropagation();
    const keyDiv = e.target.closest(".keyboard__key");
    const { dataset: { code } } = keyDiv; // const code = keyDiv.dataset.code;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: e.type });
    // {
    //   code: 'AltRight',
    //   type: 'mousedown'
    //  }
  };

  resetButtonState = ({ target: { dataset: { code } } }) => {
    const keyObj = this.keyButtons.find((key) => key.code === code);
    keyObj.divContainer.classList.remove("active");
    keyObj.divContainer.removeEventListener('mouseleave', this.resetButtonState);
  }

  handleEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const { code, type } = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    this.textArea.focus();

    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) e.preventDefault(); // Отключаем отслеживание системного* языка
      keyObj.divContainer.classList.add("active");

      // CAPS Press
      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.switchUpperCase(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.switchUpperCase(false);
        keyObj.divContainer.classList.remove('active');
      }

      // Смена языка FLAG KEY ON
      if (code.match(/Alt/)) this.altKey = true;
      if (code.match(/Shift/)) this.shiftKey = true;

      if (code.match(/Alt/) && this.shiftKey) this.switchLanguage();
      if (code.match(/Shift/) && this.altKey) this.switchLanguage();

      // Подлючение функции Верхнего регистра для отрисовки SHIFT и проверок для него
      if (this.shiftKey) this.switchUpperCase(true);

      // Определяем, какой символ мы пишем в консоль (спец или основной)
      if (!this.isCaps) { // если не зажат капс, смотрим не зажат ли шифт
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (this.isCaps) { // если зажат капс
        if (this.shiftKey) { // и при этом зажат шифт - то для кнопки со спецсимволом даем верхний регистр
          this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        } else { // и при этом НЕ зажат шифт - то для кнопки без спецсивмола даем верхний регистр
          this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        }
      }

    } else if (type.match(/keyup|mouseup/)) {
      // FLAG KEY OFF
      if (code.match(/Alt/)) this.altKey = false;
      if (code.match(/Shift/)) {
        this.shiftKey = false;
        this.switchUpperCase(false);
      }

      if (!code.match(/Caps/)) keyObj.divContainer.classList.remove("active");
    }
  }

  switchUpperCase(isTrue) {
    if (isTrue) {
      this.keyButtons.forEach((button) => {
        if (button.sub) {
          if (this.shiftKey) {
            button.sub.classList.add("sub-active");
            button.letter.classList.add("sub-inactive");
          }
        }

        if (!button.isFnKey && this.isCaps && !this.shiftKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
          button.letter.innerHTML = button.small;
        } else if (!button.isFnKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        }
      });

    } else {
      this.keyButtons.forEach((button) => {
        if (button.sub.innerHTML && !button.isFnKey) {
          button.sub.classList.remove("sub-active");
          button.letter.classList.remove("sub-inactive");

          if (!this.isCaps) {
            button.letter.innerHTML = button.small;
          } else if (!this.isCaps) { // ??????
            button.letter.innerHTML = button.shift;
          }
        } else if (!button.isFnKey) {
          if (this.isCaps) {
            button.letter.innerHTML = button.shift;
          } else {
            button.letter.innerHTML = button.small;
          }
        }
      });
    }
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language); // [ 'ru', 'en' ]
    let langIndex = langAbbr.indexOf(this.container.dataset.language); // 1
    this.keyBase = langIndex + 1 < langAbbr.length ? language[langAbbr[langIndex += 1]]
      : language[langAbbr[langIndex -= langIndex]];

    this.container.dataset.language = langAbbr[langIndex];
    storage.set('kbLang', langAbbr[langIndex]);

    this.keyButtons.forEach((button) => {
      const keyObj = this.keyBase.find((key) => key.code === button.code); // Запись объекта(кнопки) по совпадению
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;
      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        button.sub.innerHTML = keyObj.shift;
      } else {
        button.sub.innerHTML = '';
      }
      button.letter.innerHTML = keyObj.small;
    });
  }

  printToOutput(keyObj, symbol) {
    let cursorPosition = this.textArea.selectionStart;
    const left = this.textArea.value.slice(0, cursorPosition);
    const right = this.textArea.value.slice(cursorPosition);

    const functionsButtonsHandler = {
      Tab: () => {
        this.textArea.value = `${left}\t${right}`;
        cursorPosition += 1;
      },
      ArrowLeft: () => {
        cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
      },
      ArrowRight: () => {
        cursorPosition += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.textArea.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPosition -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.textArea.value.slice(cursorPosition).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPosition += positionFromLeft[0].length;
      },
      Enter: () => {
        this.textArea.value = `${left}\n${right}`;
        cursorPosition += 1;
      },
      Delete: () => {
        this.textArea.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.textArea.value = `${left.slice(0, -1)}${right}`;
        cursorPosition -= 1;
      },
      Space: () => {
        this.textArea.value = `${left} ${right}`;
        cursorPosition += 1;
      },
    };

    if (functionsButtonsHandler[keyObj.code]) functionsButtonsHandler[keyObj.code]();

    else if (!keyObj.isFnKey) {
      cursorPosition += 1;
      this.textArea.value = `${left}${symbol || ""}${right}`;
    }
    this.textArea.setSelectionRange(cursorPosition, cursorPosition);
  }
}
