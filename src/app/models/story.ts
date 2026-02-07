import { BaseClass } from "./base-class";

// Story and related object reference
export class Story extends BaseClass {
  public title: string;
  public author: string;
  public copyright?: string;
  public draft: boolean;
  public pages: Page[];
}

export class Page extends BaseClass {
  public id: number;
  public title: string; // (html allowed)
  public pageText: string;
  public paths?: Path[];
  public start?: boolean; // (only 1 per story)
  public end?: boolean;
}

export class Text extends BaseClass {
  public order: number;
  public text: string; // (html allowed)
}

export class Path extends BaseClass {
  public id: number;
  public text: string; // (html allowed)
  public goToPage: number; // (Page.id)
}

/**
 * A CustomStory is a way to mark a specific path through a story.  public
 * e.g. This can be used as a way to mark the "true" path.
 * symbol - what appears on the gotoPage button to mark this custom story's path
 */
export class CustomStory {
  public name: string;
  public description: string; // (html allowed)
  public symbol: any; // char, img, or icon
  public pages: Page[];
}
