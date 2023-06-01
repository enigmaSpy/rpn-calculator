const display = document.querySelector('.calc__display');
const calc = {
  stack: [],
  clearStack: () => {
    calc.stack = [];
    display.innerText = "";
  },
  add: (item) => {
    calc.stack.push(item);
  },
  showDisplay: () => {
    display.innerText = calc.stack.join("");
  },
  removeLast: () => {
    calc.stack.pop();
  }
};

const keys = [
    '1', '2', '3', '+',

    '4', '5', '6', '-',

    '7', '8', '9', '*',

    '0', '.', '=', '/',

    'C', '(', ')', 'del'
];


const renderKeys = () => {
  const keyboard = document.querySelector('.calc__keys');

  let keyboardKeys = '';
  keys.forEach(key => {
    keyboardKeys += `
      <button class="calc_key">${key}</button>
    `;
  });
  keyboard.innerHTML = keyboardKeys;
};

const rpn = (inp) => {
  let stack = [];
  let out = [];

  let num = '';

  const priority = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '(': 0,
    ')': 0
  };

  for (let i = 0; i < inp.length; i++) {
    if (!isNaN(Number(inp[i])) || inp[i] === '.') {
      num += inp[i];
      if (isNaN(Number(inp[i + 1])) && inp[i + 1] !== '.') {
        out.push(num);
        num = '';
      }
    } else {
      if (stack.length === 0 || inp[i] === '(') {
        stack.push(inp[i]);
      } else {
        if (inp[i] === ')') {
          while (stack.length > 0 && stack[stack.length - 1] !== '(') {
            out.push(stack.pop());
          }
          if (stack.length === 0) {
            throw new Error('Niezgodność nawiasów');
          }
          stack.pop(); //? Usunięcie '(' ze stosu
        } else if (priority[inp[i]] > priority[stack[stack.length - 1]]) {
          stack.push(inp[i]);
        } else {
          while (
            stack.length > 0 &&
            priority[inp[i]] <= priority[stack[stack.length - 1]]
          ) {
            out.push(stack.pop());
          }
          stack.push(inp[i]);
        }
      }
    }
  }

  while (stack.length > 0) {
    if (stack[stack.length - 1] === '(' || stack[stack.length - 1] === ')') {
      throw new Error('Niezgodność nawiasów');
    }
    out.push(stack.pop());
  }

  return out;
};

const calculateRPN=(expression)=> {
  const stack = [];

  const tokens = expression.split(' ');

  for (const token of tokens) {
    if (isNumber(token)) {

      stack.push(parseFloat(token));
    } else {
     
      const b = stack.pop();
      const a = stack.pop();

      let result;
      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = a / b;
          break;

        default:
          throw new Error('Invalid operator: ' + token);
      }

      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression: ' + expression);
  }

  return stack[0];
}


function isNumber(token) {
  return !isNaN(parseFloat(token)) && isFinite(token);
}

const showDisplay = () => {
  const calcKeys = document.querySelectorAll('.calc_key');

  console.log(calcKeys);
  calcKeys.forEach(key => {
    key.addEventListener("click", () => {
      if (key.innerText === "=") {
        if (calc.stack.length > 0) {
          const expression = rpn(calc.stack).join(" ");
          const result = calculateRPN(expression);
          calc.stack = [result];
          display.innerText = result;
        }
      } else if (key.innerText === "C") {
        calc.clearStack();
      } else if (key.innerText === "del") {
        calc.removeLast();
        calc.showDisplay();
      } else {
        calc.add(key.innerText);
        console.log(calc.stack);
        calc.showDisplay();
      }
    })
  });
};

const init = () => {
  renderKeys();
  showDisplay();
};

init();
