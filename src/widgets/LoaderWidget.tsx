import * as React from "react";

export interface LoaderWidgetProps{
    
}

export class LoaderWidget extends React.Component<LoaderWidgetProps, any>{
    
    render (){
        return (
            <div className="exia-loader">
                <div className="exia-loader__rect1" />
                <div className="exia-loader__rect2" />
                <div className="exia-loader__rect3" />
                <div className="exia-loader__rect4" />
                <div className="exia-loader__rect5" />
            </div>
        );
    }
}