import {Link} from "react-router-dom";
import * as React from "react";

export class LinkWidget extends Link{
    render(){
        // internal link
        if((this.props.to as any).indexOf(window.location.origin) !== -1){
            return <Link {...this.props} to={(this.props.to as any).replace(window.location.origin, "")} />
        }

        // anchor link
        return <a {...this.props} href={this.props.to as any} />

    }
}