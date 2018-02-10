import WPAPI = require( 'wpapi' );
import {ObservableMap, action, observable} from "mobx";
import {WPCategory, WPMedia, WPPost, WPTag} from "./Common";
import * as _ from "lodash";
import nprogress = require("react-nprogress");

/**
 * @author Dylan Vorster
 */
export class WordpressStore {

    api: any;
    posts: ObservableMap<WPPost>;
    categories: ObservableMap<WPCategory>;
    tags: ObservableMap<WPTag>;
    media: ObservableMap<WPMedia>;
    pages: ObservableMap<WPPost>;

    @observable
    currentPost: WPPost;

    @observable
    loading: boolean;
    loaders: number;

    constructor() {
        this.api = new WPAPI({endpoint: window.location.origin + '/wp-json'});
        this.posts = new ObservableMap();
        this.tags = new ObservableMap();
        this.pages = new ObservableMap();
        this.categories = new ObservableMap();
        this.currentPost = null;
        this.media = new ObservableMap();
        this.loading = false;
        this.loaders = 0;
    }

    start() {
        this.loading = true;
        this.loaders++;
        nprogress.start();
    }

    end() {
        setTimeout(() => {
            this.loaders--;
            if (this.loaders <= 0) {
                this.loaders = 0;
                this.loading = false;
                nprogress.done();
            }
        }, 500);
    }

    getFeatureImage(post): string {
        if (!post) {
            return;
        }

        // always try featured image first
        if (post.featured_media && this.media.has('' + post.featured_media)) {
            if (this.media.get('' + post.featured_media).media_details.sizes['large']) {
                return this.media.get('' + post.featured_media).media_details.sizes['large'].source_url;
            }
        }

        // try linked images
        let media = this.mediaByPost(post);
        if (media.length > 0 && _.first(media).media_details.sizes['large']) {
            return _.first(media).media_details.sizes['large'].source_url;
        }
    }

    setCurrentPost(post: WPPost) {
        this.currentPost = post;
    }

    run() {
        this.loadTags();
        this.loadCategories();
        this.loadPosts(1, 5);
    }

    categoriesByPost(post: WPPost): WPCategory[] {
        return _.filter(this.categories.values(), (cat) => {
            return post.categories.indexOf(cat.id) !== -1;
        });
    }

    categoryBySlug(name: string): WPCategory {
        return _.find(this.categories.values(), {slug: name});
    }

    tagBySlug(name: string): WPTag {
        return _.find(this.tags.values(), {slug: name});
    }

    tagsByPost(post: WPPost): WPTag[] {
        return _.filter(this.tags.values(), (tag) => {
            return post.tags.indexOf(tag.id) !== -1;
        });
    }

    postsByCategory(cat: WPCategory): WPPost[] {
        let posts = this.posts.values();
        if (!cat) {
            return [];
        }
        return _.filter(posts, (post) => {
            return post.categories.indexOf(cat.id) !== -1;
        });
    }

    postsByTag(tag: WPTag): WPPost[] {
        let posts = this.posts.values();
        if (!tag) {
            return [];
        }
        return _.filter(posts, (post) => {
            return post.tags.indexOf(tag.id) !== -1;
        });
    }

    pageBySlug(slug: string): WPPost {
        return _.find(this.pages.values(), {slug: slug});
    }

    postBySlug(slug: string): WPPost {
        return _.find(this.posts.values(), {slug: slug});
    }

    mediaByPost(post: WPPost): WPMedia[] {
        return _.filter(this.media.values(), {post: post.id});
    }

    mergePages(data: WPPost[]) {
        _.forEach(data, (page) => {
            page.tags = page.tags || [];
            page.categories = page.categories || [];
            this.pages.set('' + page.id, page);
        })
    }

    mergeCategories(data: WPCategory[]) {
        _.forEach(data, (cat) => {
            this.categories.set('' + cat.id, cat);
        })
    }

    mergeMedia(data: WPMedia[]) {
        _.forEach(data, (media) => {
            this.media.set('' + media.id, media);
        })
    }

    mergeTags(data: WPTag[]) {
        _.forEach(data, (tag) => {
            this.tags.set('' + tag.id, tag);
        })
    }

    mergePosts(data: WPPost[]) {
        _.forEach(data, (post) => {
            if (post._embedded) {
                this.mergeMedia(post._embedded['wp:featuredmedia']);
                this.mergeCategories(post._embedded['wp:term'][0]);
                this.mergeTags(post._embedded['wp:term'][1]);
            }
            this.posts.set('' + post.id, post);
        })
    }

    loadFeatureImage(post: WPPost) {
        if (post.featured_media && !this.media.has('' + post.featured_media)) {
            this.start();
            return this.api.media().id(post.featured_media)
                .then((data: WPMedia) => {
                    this.media.set('' + data.id, data);
                    this.end();
                })
                .catch(() => {
                    this.end()
                })
        }
    }

    loadCategoryPosts(catSlug: string, page: number = 1, limit = 10) { // rainworld :P
        let cat = this.categoryBySlug(catSlug);
        let promise = Promise.resolve(cat);
        if (!cat) {
            promise = this.loadCategory(catSlug)
        }
        this.start();
        promise.then((tag: WPTag) => {
            this.api
                .posts()
                .order('desc')
                .orderby('date').param('categories', cat.id)
                .perPage(limit)
                .page(page)
                .then((posts) => {
                    this.mergePosts(posts);
                    this.end();
                })
                .catch(() => {
                    this.end()
                })
        })
    }

    loadPage(pageSlug: string) {
        this.start();
        return this.api.pages().slug(pageSlug).embed()
            .then(action((data: WPPost[]) => {
                this.end();
                this.mergePages(data);
                if (data.length > 0) {
                    return data[0];
                }
                return null;
            }))
            .catch(() => {
                this.end()
            })
    }

    loadTagPosts(tagSlug: string, page: number = 1, limit = 10) {
        let tag = this.tagBySlug(tagSlug);
        let promise = Promise.resolve(tag);
        if (!tag) {
            promise = this.loadTag(tagSlug)
        }
        this.start();
        promise.then((tag: WPTag) => {
            this.api
                .posts()
                .order('desc')
                .orderby('date').param('tags', tag.id)
                .perPage(limit)
                .page(page)
                .then((posts) => {
                    this.end();
                    this.mergePosts(posts);
                })
                .catch(() => {
                    this.end()
                })
        })

    }

    loadMedia(post: WPPost) {
        this.start();
        this.api.media().parent(post.id).then(action((media: WPMedia[]) => {
            this.end();
            this.mergeMedia(media);
            this.loadFeatureImage(post);
        }))
            .catch(() => {
                this.end()
            })
    }

    loadPost(slug: string): Promise<WPPost> {
        this.start();
        return this.api.posts().slug(slug).embed()
            .then(action((data: WPPost[]) => {
                this.end();
                this.mergePosts(data);
                if (data.length > 0) {
                    return data[0];
                }
                return null;
            }))
            .catch((ex) => {
                this.end();
                throw ex;
            })
    }

    loadPosts(page = 1, limit = 10) {
        this.start();
        return this.api
            .posts()
            .perPage(limit)
            .page(page)
            .order('desc')
            .orderby('date')
            .then(action((data: WPPost[]) => {
                this.end();
                this.mergePosts(data);
            }))
            .catch((ex) => {
                this.end();
                throw ex;
            })
    }

    loadTag(slug: string): Promise<WPTag> {
        this.start();
        return this.api.tags().slug(slug).then((tags: WPTag[]) => {
            this.end();
            this.mergeTags(tags);
            return _.first(tags);
        })
            .catch(() => {
                this.end()
            })
    }

    loadTags() {
        this.start();
        this.api.tags()
            .then(action((data: WPTag[]) => {
                this.end();
                this.mergeTags(data);
            }))
            .catch(() => {
                this.end()
            })

    }

    loadCategories() {
        this.start();
        this.api.categories()
            .then(action((data: WPCategory[]) => {
                this.end();
                this.mergeCategories(data);
            }))
            .catch(() => {
                this.end()
            })
    }

    loadCategory(slug: string): Promise<WPCategory> {
        this.start();
        return this.api.categories().slug(slug).then((cats: WPCategory[]) => {
            this.end();
            this.mergeCategories(cats);
            return _.first(cats);
        })
            .catch(() => {
                this.end()
            })
    }

}