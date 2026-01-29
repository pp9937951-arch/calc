// Simple calculator logic
(() => {
  const displayEl = document.getElementById('display');
  let current = '0';
  let previous = null;
  let operation = null;
  let justEvaluated = false;

  function updateDisplay() {
    displayEl.textContent = String(current);
  }

  function clearAll() {
    current = '0';
    previous = null;
    operation = null;
    justEvaluated = false;
    updateDisplay();
  }

  function deleteLast() {
    if (justEvaluated) {
      clearAll();
      return;
    }
    if (current.length <= 1 || current === '-0') {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
    updateDisplay();
  }

  function appendDigit(d) {
    if (justEvaluated) {
      current = (d === '.') ? '0.' : d;
      justEvaluated = false;
      updateDisplay();
      return;
    }
    if (current === '0' && d !== '.') {
      current = d;
    } else if (d === '.' && current.includes('.')) {
      // ignore extra decimal
      return;
    } else {
      current += d;
    }
    updateDisplay();
  }

  function toggleNegate() {
    if (current === '0') return;
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    updateDisplay();
  }

  function applyPercent() {
    const num = parseFloat(current);
    if (isNaN(num)) return;
    current = String(num / 100);
    updateDisplay();
  }

  function chooseOperation(op) {
    if (operation && !justEvaluated) {
      compute();
    }
    previous = current;
    operation = op;
    current = '0';
    justEvaluated = false;
  }

  function compute() {
    if (!operation || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    if (isNaN(a) || isNaN(b)) return;
    let result = 0;
    switch (operation) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? 'Error' : a / b; break;
      default: return;
    }
    current = (result === 'Error') ? 'Error' : String(roundResult(result));
    previous = null;
    operation = null;
    justEvaluated = true;
    updateDisplay();
  }

  function roundResult(n) {
    // Avoid floating-point long tails, keep up to 12 significant digits
    return Math.round((n + Number.EPSILON) * 1e12) / 1e12;
  }

  // Event handling (clicks)
  document.querySelector('.keys').addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'digit': appendDigit(value); break;
      case 'decimal': appendDigit('.'); break;
      case 'operate': chooseOperation(value); break;
      case 'equals': compute(); break;
      case 'clear': clearAll(); break;
      case 'delete': deleteLast(); break;
      case 'negate': toggleNegate(); break;
      case 'percent': applyPercent(); break;
    }
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      appendDigit(e.key);
      e.preventDefault();
      return;
    }
    if (e.key === '.') { appendDigit('.'); e.preventDefault(); return; }
    if (['+', '-', '*', '/'].includes(e.key)) {
      chooseOperation(e.key);
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' || e.key === '=') { compute(); e.preventDefault(); return; }
    if (e.key === 'Backspace') { deleteLast(); e.preventDefault(); return; }
    if (e.key === 'Escape') { clearAll(); e.preventDefault(); return; }
    if (e.key === '%') { applyPercent(); e.preventDefault(); return; }
    // allow other keys to pass
  });

  // Initialize
  clearAll();
})();