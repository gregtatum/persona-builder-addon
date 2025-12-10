/**
 * AI-generated types for SingleFile core.
 */

export type SingleFileProgressEventType =
  | "page-loading"
  | "page-loaded"
  | "resource-initializing"
  | "resources-initialized"
  | "resource-loaded"
  | "page-ended"
  | "stage-started"
  | "stage-ended"
  | "stage-task-started"
  | "stage-task-ended";

export interface SingleFileProgressDetail {
  pageURL: string;
  frame?: boolean;
  max?: number;
  step?: number;
  task?: string;
}

export interface SingleFileProgressEvent {
  type: SingleFileProgressEventType;
  detail: SingleFileProgressDetail;
  PAGE_LOADING: "page-loading";
  PAGE_LOADED: "page-loaded";
  RESOURCES_INITIALIZING: "resource-initializing";
  RESOURCES_INITIALIZED: "resources-initialized";
  RESOURCE_LOADED: "resource-loaded";
  PAGE_ENDED: "page-ended";
  STAGE_STARTED: "stage-started";
  STAGE_ENDED: "stage-ended";
  STAGE_TASK_STARTED: "stage-task-started";
  STAGE_TASK_ENDED: "stage-task-ended";
}

export interface PageInfo {
  description: string;
  lang: string;
  author: string;
  creator: string;
  publisher: string;
  heading: string;
}

export interface ResourceSize {
  pxWidth: number;
  pxHeight: number;
  videoWidth?: number;
  videoHeight?: number;
}

export interface CanvasResource {
  dataURI: string;
  backgroundColor?: string;
}

export interface ImageResource {
  currentSrc?: string;
  size?: ResourceSize;
  replaceable?: boolean;
  backgroundColor?: string;
  objectFit?: string;
  boxSizing?: string;
  objectPosition?: string;
  src?: string;
}

export interface VideoResource {
  src?: string;
  size?: ResourceSize;
  positionParent?: string | null;
  currentTime?: number;
}

export interface ShadowRootResource {
  content?: string;
  adoptedStyleSheets?: string[];
  mode?: string;
  delegateFocus?: boolean;
  clonable?: boolean;
  serializable?: boolean;
}

export interface FrameResources {
  windowId?: string;
  url?: string;
  baseURI?: string;
  content?: string;
  title?: string;
  scrollPosition?: { x: number; y: number };
  referrer?: string;
  canvases?: CanvasResource[];
  fonts?: unknown[];
  worklets?: unknown[];
  stylesheets?: string[];
  images?: ImageResource[];
  posters?: string[];
  videos?: VideoResource[];
  usedFonts?: unknown[];
  shadowRoots?: ShadowRootResource[];
  adoptedStyleSheets?: string[];
  runner?: unknown;
}

export interface StatsData {
  discarded: Record<string, number>;
  processed: Record<string, number>;
}

export interface SingleFilePageData {
  title: string;
  filename: string;
  content: string;
  stats?: StatsData;
  hash?: string;
  links?: string[];
}

export type FilenameLengthUnit = "bytes" | "characters";

export interface SingleFileOptions {
  url?: string;
  baseURI?: string;
  content?: string | null;
  doc?: Document | null;
  win?: Window | null;
  frameId?: string | number;
  windowId?: string;
  tabId?: number;
  tabIndex?: number;
  frames?: FrameResources[];
  rootDocument?: boolean;
  backgroundSave?: boolean;
  blockFonts?: boolean;
  blockImages?: boolean;
  blockMixedContent?: boolean;
  blockScripts?: boolean;
  blockStylesheets?: boolean;
  bookmarkFolders?: string[];
  compressCSS?: boolean;
  compressHTML?: boolean;
  displayStats?: boolean;
  enableMaff?: boolean;
  loadDeferredImages?: boolean;
  groupDuplicateImages?: boolean;
  removeFrames?: boolean;
  removeHiddenElements?: boolean;
  resolveFragmentIdentifierURLs?: boolean;
  retrieveLinks?: boolean;
  saveFavicon?: boolean;
  saveOriginalURLs?: boolean;
  saveRawPage?: boolean;
  saveWithCompanion?: boolean;
  saveToGDrive?: boolean;
  saveToGitHub?: boolean;
  addProof?: boolean;
  insertCanonicalLink?: boolean;
  insertMetaCSP?: boolean;
  insertMetaNoIndex?: boolean;
  insertSingleFileComment?: boolean;
  useLegacyCommentHeader?: boolean;
  filenameTemplate?: string;
  filenameMaxLength?: number;
  filenameMaxLengthUnit?: FilenameLengthUnit;
  filenameReplacedCharacters?: string[];
  filenameReplacementCharacter?: string;
  networkTimeout?: number;
  maxResourceSize?: number;
  maxResourceSizeEnabled?: boolean;
  charset?: string;
  acceptHeaders?: Record<string, string>;
  passReferrerOnError?: boolean;
  referrer?: string;
  resourceReferrer?: string;
  saveUrl?: string;
  saveDate?: Date;
  visitDate?: Date;
  title?: string;
  info?: PageInfo;
  infobarTemplate?: string;
  infobarContent?: string;
  profileName?: string;
  updatedResources?: Record<string, unknown>;
  fontTests?: Map<string, unknown>;
  fontDeclarations?: unknown;
  stylesheets?: Map<Element, unknown> | string[];
  images?: ImageResource[];
  posters?: string[];
  videos?: VideoResource[];
  canvases?: CanvasResource[];
  shadowRoots?: ShadowRootResource[];
  fonts?: unknown[];
  onprogress?: (event: SingleFileProgressEvent) => void | Promise<void>;
  userScriptEnabled?: boolean;
}

export declare class SingleFileClass {
  constructor(options: SingleFileOptions);
  run(): Promise<void>;
  cancel(): void;
  getPageData(): SingleFilePageData;
}

export declare function getClass(
  util: unknown,
  cssTree: unknown
): typeof SingleFileClass;
