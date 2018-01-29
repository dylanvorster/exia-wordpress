import {WordpressStore} from "./WordpressStore";
import {observable, ObservableMap} from "mobx";
import {WPMedia} from "./Common";

export class Application {

    wpStore: WordpressStore;
    settings: {
        name: string;
        description: string;
        customLogo: string;
        adminBar: boolean;
    };

    @observable
    galleryImages: string[];

    @observable
    gallerySelectedImage: number ;

    constructor() {
        this.wpStore = new WordpressStore();
        this.settings = (window as any).Exia;
        this.galleryImages = [];
        this.gallerySelectedImage = null;
    }

    run() {
        this.wpStore.run();
    }
}