import {Link} from "react-router-dom";
import * as React from "react";
import * as _ from "lodash";
import * as url from "url";

export class LinkWidget extends Link{
    render(){
        let link:string = (this.props.to || "") as any;
        let base = url.parse(link);

        // internal link
        if(_.startsWith(link, "/") || window.location.origin.indexOf(base.host) !== -1){
            return (
                <Link {...this.props} to={(this.props.to as any).replace(window.location.origin, "")}>
                    {this.props.children}
                </Link>
            );
        }

        // anchor link
        return <a {...this.props} href={this.props.to as any} />

    }
}