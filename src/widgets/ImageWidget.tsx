import * as React from "react";

export class ImageWidgetState{
    loaded: boolean;
}

export class ImageWidget extends React.Component<any, ImageWidgetState>{

    constructor(props){
        super(props);

        // image might already be loaded
        let objImg = new Image();
        objImg.src = props.src;
        this.state ={
            loaded: objImg.complete
        };
    }

    render(){
        return (
            <img {...this.props as any} className={"exia-image"+(this.state.loaded?' exia-image--loader':'')} onLoad={() => {
                this.setState({loaded: true});
            }} />
        );
    }
}