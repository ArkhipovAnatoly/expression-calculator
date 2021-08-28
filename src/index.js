function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let result = 0;
    removeSpaceRedExpr=/\s/g;
    expr = expr.replace(removeSpaceRedExpr, '');
    isValid(expr.split(''));

    var bracketsRegExp = /\([^\)\(]*\)/;

    while (expr.match(bracketsRegExp)) {
      expr = expr.replace(expr.match(bracketsRegExp)[0], calc(expr.match(bracketsRegExp)[0]));
    }
    result = calc(expr);
    return result;
  }


  function calc(s) {
    let total = 0;
    const operatorsPrior = [];
    const operatorsMinor = [];
    let arr = toNumberArray(s.split(''));


    if (arr[0] === '(' && arr[arr.length - 1] === ')') {
      arr.pop();
      arr.shift();
    }
    if (arr[0] === '-') {
      arr[1] = -arr[1];
      arr.shift();
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i - 1] === '-' && arr[i - 2] === '*') {
        arr.splice(i - 1, 2, -arr[i]);
      } else if (arr[i - 1] === '-' && arr[i - 2] === '+') {
        arr.splice(i - 1, 2, -arr[i]);
      } else if (arr[i - 1] === '-' && arr[i - 2] === '/') {
        arr.splice(i - 1, 2, -arr[i]);
      } else if (arr[i - 1] === '-' && arr[i - 2] === '-') {
        arr.splice(i - 1, 2, -arr[i]);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '*' || arr[i] === '/') {
        operatorsPrior.push(arr[i]);
      }
      if (arr[i] === '-' || arr[i] === '+') {
        operatorsMinor.push(arr[i]);
      }
    }
    if (operatorsMinor.length <= 1) {
      operatorsPrior.sort().reverse();
    }

    for (let op = 0; op < operatorsPrior.length; op++) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i - 1] === '/' && arr[i + 1] === '/') {
          total = arr[i - 2] / arr[i] / arr[i + 2];
          arr.splice(i - 2, 4, total);
          break;
        }

        if (arr[i] === operatorsPrior[op]) {
          total = operation(arr[i - 1], arr[i + 1], operatorsPrior[op]);
          arr.splice(i - 1, 3, total);
        }
      }
    }

    for (let op = 0; op < operatorsMinor.length; op++) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i - 1] === '-' && arr[i + 1] === '-') {
          total = arr[i - 2] - arr[i] - arr[i + 2];
          arr.splice(i - 2, 5, total);
          break;
        }

        if (arr[i - 1] === '-' && arr[i + 1] === '+') {
          total = arr[i] - arr[i + 2];
          arr.splice(i, 3, total);
          break;
        }
        if (arr[i] === operatorsMinor[op]) {
          total = operation(arr[i - 1], arr[i + 1], operatorsMinor[op]);
          arr.splice(i - 1, 3, total);
        }
      }
    }

    return total;
  }


  function isValid(input){
    let rBracketCount = 0;
    let lBracketCount = 0;
    input.forEach(el => {
        if(el == '('){
            rBracketCount++;
        } else if(el == ')'){
            lBracketCount++;
        }
         });
    if(rBracketCount != lBracketCount){
        throw new Error("ExpressionError: Brackets must be paired");
    }
}
  function operation(op1, op2, operator) {
    if (operator == '/' && op2 == 0) {
      throw new Error('TypeError: Division by zero.');
    }

    switch (operator) {
      case '+':
        return op1 + op2;
      case '-':
        return op1 - op2;
      case '*':
        return op1 * op2;
      case '/':
        return op1 / op2;

      default:
        break;
    }
  }

  function toNumberArray(inputArray) {
    let element = '';
    let numArr = [];
    inputArray.forEach((el) => {
      if (el.match(/[0-9.]/)) {
        element += el;
      }
      if (el.match(/[\/\*\-\+()]/)) {
        if (element != '') {
          numArr.push(Number(element));
          element = '';
        }
        numArr.push(el);
      }
    });
    if (element != '') {
      numArr.push(Number(element));
    }
    return numArr;
  }


module.exports = {
    expressionCalculator
}