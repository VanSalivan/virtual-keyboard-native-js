/* eslint-disable import/extensions */

import * as storage from './storage.js';
import create from './utils/create.js';
import language from './layouts/index.js'; // { en, ru }
import Key from './Key.js';

const main = create("main", "",
  [create("h1", "title", "RSS Virtual Keyboard"),
    create("h3", "subtitle", "Keyboard for Windows"),
    create("p", "hint", "Левый <kbd>Ctrl</kbd> + <kbd>Alt</kbd> Для смены языка. Последний язык храниться в localstorage")]);

export default class Keyboard {
  constructor(keyOrder) {
    this.keyOrder = keyOrder;
    this.keyPress = {};
    this.Caps = false;
  }

  init(langCode) { // ru, en
    this.KeyBase = language[langCode];
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
        const keyObj = this.KeyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.divContainer);
        }
      });
    });
  }
}
