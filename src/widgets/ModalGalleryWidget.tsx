import * as React from "react";
import {Application} from "../core/Application";

import ImageGallery from 'react-image-gallery';
import * as _ from "lodash";
import {observer} from "mobx-react";


export interface ModalGalleryWidgetProps {
    app: Application;
}

export interface ModalGalleryWidgetState {
    fading: boolean;
}

@observer
export class ModalGalleryWidget extends React.Component<ModalGalleryWidgetProps, ModalGalleryWidgetState> {

    listener: any;

    constructor(props) {
        super(props);
        this.state = {
            fading: false
        }
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.listener);
    }

    close(){
        this.setState({fading: false});
        setTimeout(() => {
            this.props.app.galleryImages = []
            this.props.app.gallerySelectedImage = null;
        }, 200)
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fading: true})
        }, 100);
        this.listener = (event: any) => {
            if (event.key === 'Escape') {
                this.close();
            }
        };
        window.addEventListener("keydown", this.listener);
    }

    render() {
        return (
            <div className={"exia-modal-gallery"+(this.state.fading?" exia-modal-gallery--visible":'')}>
                <ImageGallery className="exia-modal-gallery__inner"
                              items={_.map(this.props.app.galleryImages, (image, index) => {
                                  return {
                                      original: image,
                                      thumbnail: image
                                  };
                              })}/>
                <svg onClick={() => {
                    this.close();
                }} viewBox="0 0 12 12" className="exia-modal-gallery__close" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="11"
                          x2="11" y2="1"
                          stroke="white"
                          stroke-width="1"/>
                    <line x1="1" y1="1"
                          x2="11" y2="11"
                          stroke="white"
                          stroke-width="1"/>
                </svg>
            </div>
        );
    }
}