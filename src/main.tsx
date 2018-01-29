import * as React from "react";
import * as ReactDOM from "react-dom";
import {Application} from "./core/Application";
import BodyWidget from "./widgets/BodyWidget";
import {BrowserRouter} from 'react-router-dom';

// tell webpack to build the styles
require("./sass/main.scss");
require("typeface-open-sans");

/**
 * @author Dylan Vorster
 */
document.addEventListener("DOMContentLoaded", (event) => {
    let app = new Application();
    app.run();

    ReactDOM.render(
        <BrowserRouter>
            <BodyWidget app={app} />
        </BrowserRouter>,
        document.querySelector("#application")
    )
});