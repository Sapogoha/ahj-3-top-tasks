export default class Task {
  constructor(text, pinned = false) {
    this.task = text;
    this.pinned = pinned;

    this.taskElement = document.createElement('li');
    this.taskElement.classList.add('task');
    // const taskClass = this.pinned ? 'pinned' : 'not-pinned';
    // this.taskElement.classList.add(taskClass);
    this.taskElement.textContent = this.task;
  }
}
