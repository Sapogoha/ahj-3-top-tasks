export default class Task {
  constructor(text, pinned = false) {
    this.task = text;
    this.pinned = pinned;

    this.taskElement = document.createElement('li');
    this.taskElement.classList.add('task');

    this.taskElement.textContent = this.task;
  }
}
