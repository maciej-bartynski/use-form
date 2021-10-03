import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import Form from './form';

const App: React.FC = () => (
    <div className="app">
        <h1>Hello useForm!</h1>
        <Form />
    </div>
)

const rootNode = document.querySelector("#root");
ReactDOM.render(<App />, rootNode);