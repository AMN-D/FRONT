function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );    
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </div>
  );
}
