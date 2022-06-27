let cats = {
  names: [ 'Butterscotch', 'Pudding', 'Fluffy' ],
  foo() {
    [1, 2, 3].forEach(function(number) {
      console.log(`${number}: ${names[number - 1]}`);
    });
  } 
};

cats.foo();