const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// Registration JS start
const formRegister = document.getElementById('create');
formRegister.addEventListener('submit', registerUser);
async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const result = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/JSON',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  }).then((res) => res.json());

  if (result.status === 'ok') {
    console.log('created');

    alert('User Created Successfully');
    container.classList.remove('right-panel-active');
  } else {
    alert(result.error);
    console.log(name, email, password);
  }
}

// Registration JS END

// LOGIN JS START

const formLogin = document.getElementById('login');
formLogin.addEventListener('submit', login);
async function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const result = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/JSON',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());

  if (result.status === 'ok') {
    console.log('Got the token: ', result.data);
    window.location.replace('home.html');
  } else {
    alert(result.error);
  }
}
