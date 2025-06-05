const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// localStorageに保存
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// localStorageから読み込み
function loadTasks() {
  const tasksJSON = localStorage.getItem('tasks');
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}

let tasks = [];

// 画面に描画
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('completed');
    }

    // 完了切替をliに
    li.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}


// タスク追加
function addTask(taskText) {
  tasks.push({ text: taskText, completed: false });
  saveTasks(tasks);
  renderTasks();
}

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('タスクを入力してください！');
    return;
  }
  addTask(taskText);
  taskInput.value = '';
  taskInput.focus();
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTaskBtn.click();
  }
});

// 初期化
window.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks();
  renderTasks();
  taskInput.focus();
});

// 既存コードはそのまま、renderTasks関数の中を以下のように編集します

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    if (task.isEditing) {
      // 編集モード用inputを作成
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.style.fontSize = '1rem';
      input.style.padding = '0.3rem';

      // 編集確定（Enter）
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          tasks[index].text = input.value.trim() || task.text; // 空文字なら元に戻す
          tasks[index].isEditing = false;
          saveTasks(tasks);
          renderTasks();
        } else if (e.key === 'Escape') {
          // 編集キャンセル
          tasks[index].isEditing = false;
          renderTasks();
        }
      });

      // フォーカス時全選択
      input.addEventListener('focus', () => {
        input.select();
      });

      li.appendChild(input);
      taskList.appendChild(li);
      input.focus();
      return; // このループはここで終わり
    }

    li.textContent = task.text;

    if (task.completed) {
      li.classList.add('completed');
    }

    // ダブルクリックで編集モードに切り替え
    li.addEventListener('dblclick', () => {
      tasks[index].isEditing = true;
      renderTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    });

    li.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}
