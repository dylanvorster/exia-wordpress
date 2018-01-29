import {Application} from "../core/Application";
import * as React from "react";

export interface PagePageProps{
    app: Application;
}

export class PagePage extends React.Component<PagePageProps>{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>

            </div>
        );
    }

}