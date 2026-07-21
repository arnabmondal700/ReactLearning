import { useState } from 'react'
import './App.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Card from './Cards/Cards';


function App() {
  const [count, setCount] = useState(0);
  let nameString = "Vite + React";
  let CourseNames= [{ name: "Vite + React" , description: "Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects. React is a JavaScript library for building user interfaces."},
  { name: "React + TypeScript" , description: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It offers static typing, classes, and interfaces, which can help catch errors early and improve code quality."},
  { name: "React + Redux" , description: "Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test."},
  { name: "React + React Router" , description: "React Router is a standard library for routing in React. It enables the navigation among views of various components in a React Application, allows changing the browser URL, and keeps the UI in sync with the URL."},
  { name: "React + Jest" , description: "Jest is a delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using Babel, TypeScript, Node.js, React, Angular, Vue.js and Svelte and more!"}];
  let headerLinks: { name: string; href: string }[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];
  return (
    <>
      <Header links={headerLinks} title={nameString} />
      <section id="center">
        
        <div className="hero">
          {CourseNames.map((course, index) => (
            <Card key={index} title={course.name} description={course.description} />
            // index < 5 && (
            //   <div key={index}>
            //     <h1 className="title">{course.name}</h1>
            //     <p>{course.description}</p>
            //   </div>
            // )
          ))}
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
      <Footer />
    </>
  )
}

export default App
