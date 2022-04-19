import Task from './Task';

export default class Tracker {
  constructor(element) {
    this.input = element.querySelector('.input-form__input');
    this.inputForm = element.querySelector('.input-form');
    this.pinnedList = element.querySelector('.pinned-list');
    this.tasksList = element.querySelector('.all-tasks-list');
    this.tasks = [];

    this.onSubmit = this.onSubmit.bind(this);
    this.pinTask = this.pinTask.bind(this);
    this.unpinTask = this.unpinTask.bind(this);
    this.showAllSuitableTexts = this.showAllSuitableTexts.bind(this);
    this.filterByTask = this.filterByTask.bind(this);
  }

  init() {
    this.addEventListeners();
    this.showEmptyPinnedList();
  }

  addEventListeners() {
    this.input.closest('form').addEventListener('submit', this.onSubmit);
    this.tasksList.addEventListener('click', this.pinTask);
    this.pinnedList.addEventListener('click', this.unpinTask);
    this.input.addEventListener('keyup', this.showAllSuitableTexts);
  }

  showEmptyPinnedList() {
    const emptyList = document.createElement('li');
    emptyList.classList.add('empty');
    this.noPinnedTasks = 'No pinned tasks';
    emptyList.textContent = this.noPinnedTasks;
    this.pinnedList.appendChild(emptyList);
  }

  showEmptyTasksList() {
    const emptyTasksList = document.createElement('li');
    emptyTasksList.classList.add('empty');
    this.noTasks = 'No tasks found';
    emptyTasksList.textContent = this.noTasks;
    this.tasksList.appendChild(emptyTasksList);
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.input.value === '') {
      this.showError('empty');
    } else if (this.taskAlreadyExists(this.input.value)) {
      this.showError('exists');
    } else {
      const newTask = new Task(this.input.value);
      this.tasks.push(newTask);
      this.input.value = '';
      const pinned = this.tasksList.querySelector('.empty');
      if (pinned) {
        this.tasksList.removeChild(pinned);
      }

      this.drawAllUnpined();
    }
  }

  showError(param) {
    const errorEl = document.createElement('div');
    errorEl.classList.add('error');
    errorEl.classList.add(`error-${param}`);
    const errorInput = document.createElement('span');
    if (param === 'empty') {
      errorInput.textContent = 'Please type at least one symbol';
    } else if (param === 'exists') {
      errorInput.textContent = 'This task already exists';
    }
    errorEl.insertAdjacentElement('afterbegin', errorInput);
    if (!this.inputForm.querySelector(`.error-${param}`)) {
      this.inputForm.appendChild(errorEl);
    }
    setTimeout(() => {
      this.inputForm.removeChild(errorEl);
    }, 2500);
  }

  showTaskInAllTasks(task) {
    this.tasksList.appendChild(task.taskElement);
  }

  showTaskInPinnedTasks(task) {
    this.pinnedList.appendChild(task);
  }

  showAllSuitableTexts() {
    this.removeAll();
    this.redrawUnpinned();
  }

  taskAlreadyExists(task) {
    const allTaskTexts = this.tasks.filter((item) => item.task === task);
    return allTaskTexts.length !== 0;
  }

  pinTask(task) {
    const noPinned = this.pinnedList.querySelector('.empty');
    if (noPinned) {
      this.pinnedList.removeChild(noPinned);
    }

    const toChange = this.tasks.find(
      (item) => item.task === task.target.textContent,
    );
    toChange.pinned = true;

    this.showTaskInPinnedTasks(task.target);
    this.input.value = '';
    this.redrawUnpinned();
  }

  unpinTask(task) {
    if (task.target.textContent !== this.noPinnedTasks) {
      const toChange = this.tasks.find(
        (item) => item.task === task.target.textContent,
      );
      toChange.pinned = false;

      this.tasksList.appendChild(task.target);

      const unpinnedTaskItems = this.tasks.filter(
        (item) => item.pinned === false,
      );
      const emptyList = this.tasksList.querySelector('.empty');
      if (unpinnedTaskItems.length > 0 && emptyList) {
        this.tasksList.removeChild(emptyList);
      }

      const pinnedTaskItems = this.tasks.filter((item) => item.pinned === true);
      if (pinnedTaskItems.length === 0) {
        this.showEmptyPinnedList();
      }
    }
  }

  filterByTask(text) {
    const regexp = new RegExp(`^${this.input.value}`, 'i');
    return regexp.test(text.task);
  }

  redrawUnpinned() {
    const noTasks = this.tasksList.querySelector('.empty');
    if (noTasks) {
      this.tasksList.removeChild(noTasks);
    }

    let taskItems = this.tasks.filter((item) => item.pinned === false);
    if (this.input.value !== '') {
      taskItems = taskItems.filter((item) => this.filterByTask(item));
    }

    taskItems.forEach((item) => this.showTaskInAllTasks(item));

    if (taskItems.length === 0) {
      this.showEmptyTasksList();
    }
  }

  drawAllUnpined() {
    const allUnpined = this.tasks.filter((item) => item.pinned === false);
    if (allUnpined.length > 0) {
      allUnpined.forEach((item) => this.showTaskInAllTasks(item));
    }
  }

  removeAll() {
    const toRemove = this.tasksList.querySelectorAll('.task');

    if (toRemove) {
      [...toRemove].forEach((item) => {
        this.tasksList.removeChild(item);
      });
    }
  }
}
