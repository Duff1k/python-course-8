const state = {
    curr: '0',
    prev: '',
    op: null,
    history: [],
    shouldClearCurrent: false 
};

const ui = {
    prev: document.getElementById('prev-operand'),
    curr: document.getElementById('curr-operand'),
    list: document.getElementById('history-list')
};

const app = {
    
    num: (n) => {
        if (state.shouldClearCurrent) {
            state.curr = '0';
            state.shouldClearCurrent = false;
        }
        
        if (n === '.' && state.curr.includes('.')) return;
        if (state.curr === '0' && n !== '.') state.curr = n;
        else state.curr += n;
        
        render();
    },

    op: (operation) => {
        if (state.curr === '' && state.prev === '') return;
        
        if (state.shouldClearCurrent) {
            state.shouldClearCurrent = false;
        } else if (state.prev !== '') {
            app.calc();
        }
        
        state.op = operation;
        state.prev = state.curr;
        state.curr = '';
        render();
    },

    calc: () => {
        if (!state.op || !state.curr) return;
        
        const prev = parseFloat(state.prev);
        const curr = parseFloat(state.curr);
        let res = 0;

        switch(state.op) {
            case '+': res = prev + curr; break;
            case '-': res = prev - curr; break;
            case '*': res = prev * curr; break;
            case '÷': 
                if (curr === 0) { alert('Ошибка'); app.clearAll(); return; }
                res = prev / curr; 
                break;
        }
        
        res = Math.round(res * 10000000) / 10000000;
        
        app.addHistory(state.prev, state.op, state.curr, res);

        state.curr = res.toString();
        state.op = null;
        state.prev = '';
        state.shouldClearCurrent = true; 
        render();
    },

    clearAll: () => {
        state.curr = '0';
        state.prev = '';
        state.op = null;
        state.shouldClearCurrent = false;
        render();
    },

    del: () => {
        if (state.shouldClearCurrent) return;
        state.curr = state.curr.toString().slice(0, -1);
        if (state.curr === '' || state.curr === '-') state.curr = '0';
        render();
    },

    addHistory: (p, o, c, r) => {
        state.history.unshift(`${p} ${o} ${c} = ${r}`);
        renderHistory();
    },

    clearHistory: () => {
        state.history = [];
        renderHistory();
    }
};

function render() {
    ui.curr.innerText = state.curr;
    ui.prev.innerText = state.op ? `${state.prev} ${state.op}` : '';
}

function renderHistory() {
    ui.list.innerHTML = '';
    
    if (state.history.length === 0) {
        const li = document.createElement('li');
        li.innerText = 'История пуста';
        li.setAttribute('data-status', 'empty');
        ui.list.appendChild(li);
        return;
    }

    state.history.forEach(text => {
        const li = document.createElement('li');
        const parts = text.split('='); 
        li.innerHTML = `<span>${parts[0]} =</span> <b>${parts[1]}</b>`;
        ui.list.appendChild(li);
    });
}

render();