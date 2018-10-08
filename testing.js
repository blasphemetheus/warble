sessionStorage.setItem('test', 'breh');

// deal with sessionStorage (test)
if (sessionStorage.getItem('test') == null) { // no test in storage
  console.log('there is no sessionStorage with key: test');
  console.log('sessionStorage(test)', sessionStorage.getItem('test'));
} else { // there's test in storage
  console.log('sessionStorage with key : test : exists');
  console.log('sessionStorage(test):', sessionStorage.getItem('test'));
}
