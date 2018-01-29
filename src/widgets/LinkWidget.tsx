import {Link} from "react-router-dom";
import * as React from "react";

export class LinkWidget extends Link{
    render(){
        return <Link {...this.props} to={(this.props.to as any).replace(window.location.origin, "")} />
    }
}