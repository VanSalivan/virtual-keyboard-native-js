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

      // Смена языка FLAG KEY ON
      if (code.match(/Shift/)) this.shiftKey = true;
      if (code.match(/Alt/)) this.altKey = true;

      if (code.match(/Shift/) && this.altKey) this.switchLanguage();
      if (code.match(/Alt/) && this.shiftKey) this.switchLanguage();


      // Верхний регистр CAPS & SHIFT
      if (!this.isCaps) {
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (this.isCaps) {
        this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
      } else {
        this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
      }

    } else if (type.match(/keyup|mouseup/)) {
      keyObj.divContainer.classList.remove("active");
      // FLAG KEY OFF
      if (code.match(/Shift/)) this.shiftKey = false;
      if (code.match(/Alt/)) this.altKey = false;
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
