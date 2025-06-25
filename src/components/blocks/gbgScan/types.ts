/* eslint-disable sonar/no-duplicate-in-composite */
/**
 * GBG ID Scan
 *
 * @packageDocumentation
 */

/**
 * @public
 */
declare enum BoolAsString {
  False = 'false',
  True = 'true',
}

/**
 * General interface for the callback functions
 *
 * @public
 */
export declare type Callback = (param: string | boolean) => void;

/**
 * @public
 */
export declare enum CapturingMedia {
  Scanner = 1,
  FileUpload = 2,
  WebCamera = 3,
  Camera = 4,
}

/**
 * The mode to use when changing input providers
 *
 * @public
 */
export declare enum ChangeMode {
  /**
   * The default behaviour which is to reject when the specified provider
   * doesn't exist.
   */
  DEFAULT = 'DEFAULT',
  /**
   * Force the input provider to the specified provider even if the device
   * doesn't support it or it's been removed from the allowed providers list.
   */
  FORCE = 'FORCE',
  /**
   * Use the specified behaviour, but fall back to the first available
   * provider if it is not available.
   */
  FALLBACK = 'FALLBACK',
}

/**
 * @public
 */
export declare enum ChannelType {
  CaptureStudio = 1,
  Web = 2,
  Mobile = 3,
}

/**
 * The current result state of the journey.
 *
 * @public
 */
export declare enum CurrentResult {
  /**
   * TODO: This needs some proper documentation
   */
  CaseUpdateFailed = 'CaseUpdateFailed',
  /**
   * TODO: This needs some proper documentation
   */
  CommunicationError = 'CommunicationError',
  /**
   * TODO: This needs some proper documentation
   */
  ErrorSavingData = 'ErrorSavingData',
  /**
   * The current journey has failed verification.
   */
  Failed = 'Failed',
  /**
   * The current journey has passed verification to a satisfactory level.
   */
  Pass = 'Pass',
  /**
   * TODO: This needs some proper documentation
   */
  ProcessingError = 'ProcessingError',
  /**
   * TODO: This needs some proper documentation
   */
  ScannerError = 'ScannerError',
  /**
   * TODO: This needs some proper documentation
   */
  SpecifiedEntryNotFound = 'SpecifiedEntryNotFound',
}

/**
 * Type for DocumentRole
 *
 * @public
 */
export declare enum DocumentRole {
  A4Paper = 'A4 Paper',
  IdDocumentBack = 'Id Document Back',
  IdDocumentFront = 'Id Document Front',
}

/**
 * Type for DocumentSide
 *
 * @public
 */
export declare enum DocumentSide {
  BACK = 'BACK',
  FRONT = 'FRONT',
}

/**
 * Enum for user Document Source which is used in upload
 *
 * @public
 */
export declare enum DocumentSource {
  IDENTITY = 2,
  ADDRESS = 3,
}

/**
 * The current capture state of the journey. The value of this is dictated by
 * the server. These values are usually used alongside the `RequiredAction` enum
 * values returned with events.
 *
 * @public
 */
export declare enum FlowState {
  /**
   * Supported proof of address document.
   */
  ADDRESS = 'ADDRESS',
  /**
   * Rear of supported identity document.
   */
  IDENTITY_BACK = 'IDENTITY:BACK',
  /**
   * Front of supported identity document.
   */
  IDENTITY_FRONT = 'IDENTITY:FRONT',
  /**
   * Nothing required at this time.
   */
  NONE = 'NONE',
  /**
   * Self portrait photograph.
   */
  SELFIE = 'SELFIE',
  /**
   * Liveness capturing.
   */
  LIVENESS = 'LIVENESS',
  /**
   * Passive Liveness capturing.
   */
  PASSIVE_LIVENESS = 'PASSIVE_LIVENESS',
  /**
   * Passive Liveness capturing.
   */
  COVIDPASS = 'COVIDPASS',
}

/**
 * The current result of the journey. This will change as the journey progresses
 * and will only be finalised at the end of the journey process.
 *
 * @public
 */
export declare enum HighLevelResult {
  /**
   * The journey was aborted before it was completed.
   */
  Aborted = 'Aborted',
  /**
   * The identity documents provided has expired and the process has
   * failed. In the event this state is returned by the system, it is
   * suggested the user should retry with different documents if possible.
   */
  Expired = 'Expired',
  /**
   * The identity documents provided are known, but not accepted by the
   * system. It is suggested that the user should retry with different
   * documents if this state is returned by the system.
   */
  NotAccepted = 'NotAccepted',
  /**
   * The identity documents provided are not known by the system. This could
   * be caused due to a poor capture, severe tampering, or specimens used for
   * checking could be out of date.
   */
  NotSupported = 'NotSupported',
  /**
   * The identity documents provided are satisfactory and the user's identity
   * has been confirmed to a suitable level as defined by the configuration
   * provided.
   */
  Passed = 'Passed',
  /**
   * The identity documents provided do not match each other to a suitable
   * level and the system has recommended that a human manually review the
   * application
   */
  Refer = 'Refer',
  /**
   * There has either been a fatal error in the application or the process has
   * not been started at this time. Please review other values accompanying
   * `HighLevelResult` when this value is seen for more details.
   */
  Undefined = 'Undefined',
}

/**
 * @public
 */
export declare enum HighLevelResultDetails {
  ACCUMULATIVE_LIVENESS_RESULT = 'ACCUMULATIVELIVENESSRESULT',
  DOCUMENT_BACK_SIDE_CHECK = 'DOCUMENTBACKSIDECHECK',
  DOCUMENT_BLOCKING_POLICY = 'DOCUMENTBLOCKINGPOLICY',
  DOCUMENT_EXPIRY = 'DOCUMENTEXPIRY',
  DOCUMENT_SUPPORT = 'DOCUMENTSUPPORT',
  DOCUMENT_VALIDATION = 'DOCUMENTVALIDATION',
  DOCUMENT_PROOF_POLICY = 'DOCUMENTPROOFPOLICY',
  FACEMATCH_VALIDATION = 'FACEMATCHVALIDATION',
  UNDERAGE_RULE = 'UNDERAGERULE',
}

/**
 * @public
 */
export declare enum HighLevelResultDetailValues {
  FAILED = 'FAILED',
  NOTNEEDED = 'NOTNEEDED',
  PASSED = 'PASSED',
  SKIPPED = 'SKIPPED',
}

/**
 * @public
 */
export declare enum HintType {
  NONE = 'NONE',
  AUTOCAPTUREON = 'AUTOCAPTURE_ON',
  AUTOCAPTUREOFF = 'AUTOCAPTURE_OFF',
}

/**
 * @public
 */
export declare interface IAuthSettings {
  readonly persistence: IPersistenceSettings;
}

/**
 * @public
 */
export declare interface IBase64Components {
  type: ImageFormat;
  data: string;
}

/**
 * @public
 */
export declare interface ICamera {
  aspectRatio: IRange<number>;
  deviceName: string;
  deviceId: string;
  resolutions: IRange<IResolution>;
  facingMode: VideoFacingModeEnum;
  frameRate: IRange<number>;
  groupId: string;
}

/**
 * Options for the camera
 *
 * @public
 */
export declare interface ICameraOptions {
  /**
   * @public
   */
  resolutions: {
    minimum: IResolution;
    ideal: IResolution;
  };
}

/**
 * ContainerConfiguration object interface for JourneyContainer.
 *
 * @public
 */
export declare interface IContainerConfiguration {
  /**
   * Authorisation settings for this instance of the SDK.
   *
   * @public
   */
  readonly auth: boolean | IAuthSettings;
  /**
   * The URL which this instance of the SDK should use to communicate with
   * the accompanying services.
   *
   * @public
   */
  readonly backendUrl: string;
  /**
   * The templates to use for this instance of the SDK. Any template values
   * which are not overridden in this object will revert to the defaults.
   *
   * @public
   */
  readonly templates?: TemplateDictionary;
  /**
   * The identifier for the container, or a reference to the container, which
   * should be used to house this instance of the SDK UI. Once specified, the
   * element which is referenced should not be tampered with outside of the
   * SDK as it can cause inconsistencies in the journey.
   *
   * @public
   */
  readonly container: HTMLElement | string;
  /**
   * indicates the configuration of preview pages, which should be shown and
   * for what step.
   *
   * @public
   */
  readonly previewPages?: IPreviewPagesConfiguration;
  /**
   * Triple scan guidance page setting which if enabled will display a guidance page for triple scan reasons.
   *
   * @public
   */
  readonly tripleScanGuidancePage?: boolean;
  /**
   * File upload on camera capture journeys if enabled will display a button Upload a photo instead.
   *
   * @public
   */
  readonly fileUploadOnCameraCaptureJourneys?: boolean;
  /**
   * indicates the configuration of manual capture toggle and timeout
   *
   * @public
   */
  readonly manualCapture?: IManualCaptureConfiguration;
  /**
   * The endpoints to use for this instance of the SDK. In most cases, these
   * can be left with the default settings.
   *
   * @public
   */
  readonly endpoints?: IEndpoints;
  /**
   * The token which should be used to authenticate with the server for this
   * instance of the SDK. Leave blank to show the login screen when
   * initialising the UI.
   *
   * @defaultValue undefined
   *
   * @public
   */
  readonly token?: string;
  /**
   * The translation function to use to acquire the strings to display to
   * customers.
   *
   * @public
   */
  readonly translator?: Translator;
  /**
   * The set of keys to use to generate the translations with.
   *
   * @public
   */
  readonly dictionary?: Partial<TranslationDictionary>;
  /**
   * Configuration for the Smart Capture component.
   *
   * @public
   */
  readonly smartCapture?: Partial<ISmartCaptureConfiguration>;
  /**
   * Route to access the resources of the animations and other assets needed for the application.
   *
   * @public
   */
  readonly assetsDirectory?: string;
  /**
   * Options for the camera overlay
   *
   * @public
   */
  readonly overlay?: IOverlayConfiguration;
  /**
   * Options for the camera
   *
   * @public
   */
  readonly cameraOptions?: ICameraOptions;
  /**
   * Control which input providers will be offered to the customer providing
   * there is support and they are enabled in the back office configuration.
   *
   * @remarks Any providers not in this list will never be presented to the
   * customer. Leave this property undefined for the default values.
   *
   * @defaultValue [
   *     InputProviders.CAMERA,
   *     InputProviders.FILESYSTEM,
   *     InputProviders.SCANNER,
   *     InputProviders.SMART_CAPTURE
   * ]
   *
   * @public
   */
  readonly allowedInputProviders?: Array<InputProvider>;
  /**
   * Control which input provider is default when changing between steps in
   * the journey and when beginning a new journey.
   *
   * @remarks Any provider specified here will be used as the default assuming
   * it exists and is available for the device. If the specified provider
   * isn't available, the first available provider will be used instead.
   *
   * @public
   */
  readonly defaultInputProvider?: InputProvider;
  /**
   * Add in additional data to be passed through to the services
   *
   * @public
   */
  readonly additionalData?: Array<IMetaData>;
  /**
   * The journey definition id to use for this instance of the SDK
   *
   * @public
   */
  journeyDefinitionId?: string;
  /**
   * Mode is used for selecting channel of sdk - WEB or CAPTURESTUDIO
   *
   * @public
   */
  readonly mode?: Mode;
  /**
   * The function to call when there is an event in a Journey. The function
   * will be passed the name of the event which has occurred, the meta data
   * for the event, and the current state of the Journey at the time the event
   * occurred.
   *
   * @param event - The name of the event which occurred
   * @param meta - The meta data for the event
   * @param state - The current state of the Journey
   */
  onJourneyEvent?(event: JourneyEvent, meta: IJourneyEventMetaData, state: IJourneyState): void;
  /**
   * Enables verbose logging to console
   *
   * @public
   */
  readonly isVerboseLogEnabled?: boolean;
  /**
   * Hiding GBG Watermark
   *
   * @public
   */
  readonly hideLogo?: boolean;
  /**
   * Hiding Smart Capture Hints
   *
   * @public
   */
  readonly hideAutoCaptureHints?: boolean;
}

/**
 * The data stored in the DataStore. This can be extended by other entities, so
 * be sure to check the documentation for those too.
 *
 * @public
 */
export declare interface IDataStoreFormat {
  /**
   * The time of the last change to the data store. This is automatically
   * updated when new data is placed into the store.
   */
  lastUpdate: Date;
  /**
   * The current result state of the journey.
   */
  currentResult: CurrentResult;
  /**
   * The documents which have been uploaded and processed
   */
  documents: Array<IExtendedDocument>;
  /**
   * The data about the person which has been extrapolated from the provided
   * identity documents.
   */
  person: IPerson;
  /**
   * The identification number for the current journey
   */
  journeyId: string;
  /**
   * The reference assigned by the services for this journey
   */
  journeyReference: string;
  /**
   * Does the current journey have any errors?
   */
  hasError: boolean;
  /**
   * The current result of the journey. This will change as the journey
   * progresses and will only be finalised at the end of the journey process.
   */
  highLevelResult?: HighLevelResult;
  /**
   * Has the current journey finished?
   */
  isFinished: boolean;
  /**
   * Has the current triple scan reason?
   */
  tripleScanReason?: string;
  /**
   * Has the document passed the glare check?
   */
  glareCheck?: string;
  /**
   * Has the document passed the blur check?
   */
  blurCheck?: string;
  /**
   * Has the document passed the low resolution check?
   */
  lowResolutionCheck?: string;
  /**
   * Has the document passed the full document in view check?
   */
  fullDocumentInViewCheck?: string;
}

/**
 * List of supported ID document types
 *
 * @public
 */
declare enum IdDocuments {
  AgentsLicence = 'Agents License',
  DrivingLicence = 'Driving License',
  ElectoralCard = 'Electoral Card',
  ForeignerIdentificationCard = 'Foreigner Identification Card',
  HealthCard = 'Health Card',
  JobLicence = 'Job License ',
  MembershipIdentificationCard = 'Membership Identification Card',
  MilitaryIdentificationCard = 'Military Identification Card',
  NationalIdentificationCard = 'National Identification Card',
  Passport = 'Passport',
  TravelPermit = 'Travel Permit',
  Visa = 'Visa',
  WeaponsLicence = 'Weapons Licence',
}

/**
 * @public
 */
export declare enum IdesMicroWorkerMessages {
  CheckComplete = 'CheckComplete',
  CheckFailed = 'CheckFailed',
  Initialise = 'Initialise',
  Terminate = 'Terminate',
  LoadingResources = 'LoadingResources',
  PerformQualityCheck = 'PerformQualityCheck',
  ReadyToProcess = 'ReadyToProcess',
  Error = 'Error',
}

/**
 * @public
 */
export declare interface IDeviceCapabilities {
  cameras: Record<string, ICamera>;
}

/**
 * A document description returned from the services
 *
 * @public
 */
export declare interface IDocument {
  /**
   * The category of the document
   */
  readonly category?: string;
  /**
   * The expiration data of the document
   */
  readonly expirationDate?: string;
  /**
   * The images contained within the document
   */
  readonly images?: IDocumentImage[];
  /**
   * Has the document been recognised as valid by the services?
   */
  readonly isRecognised?: boolean;
  /**
   * The issue date of the document
   */
  readonly issueDate?: string;
  /**
   * The issue number of the document
   */
  readonly issueNumber?: string;
  /**
   * The name on the document
   */
  readonly name?: string;
  /**
   * The number on the document
   */
  readonly number?: string;
  /**
   * The side of the document
   */
  readonly side?: string;
  /**
   * The type of the document as determined by the services
   */
  readonly type?: IdDocuments | NonIdDocuments;
}

/**
 * Configuration object interface for DocumentImage
 *
 * @public
 */
export declare interface IDocumentImage {
  /**
   * The type of the imag
   */
  readonly type: string;
  readonly role: string;
  /**
   * The location to retrieve the image from or the DataURI containing it
   */
  readonly url: string;
}

/**
 * Endpoints used to retrieve data from the services.
 *
 * NOTE: You should not need to alter any of these settings under normal
 * circumstances. Please refer to the integration guide before making changes.
 *
 * @public
 */
export declare interface IEndpoints {
  /**
   * The endpoint used for getting image boundaries for the cropping
   * functionality.
   */
  readonly crop: string;
  /**
   * The endpoint used for getting the current API version from the services
   * as well as getting the configuration parameters for the input provider to
   * use.
   */
  readonly getVersion: string;
  /**
   * The endpoint used for retrieving information about past journeys
   */
  readonly getJourney: string;
  /**
   * The endpoint used for authenticating with the services and obtaining an
   * API token providing a username and password combination.
   */
  readonly login: string;
  /**
   * The endpoint used for terminating a session given the specified token.
   */
  readonly logout: string;
  /**
   * The endpoint used for negotiating a socket connection with the services
   */
  readonly socket: string;
  /**
   * The endpoint used for uploading images to when using the more traditional
   * providers.
   */
  readonly upload: string;
  /**
   * The endpoint used for requesting the available journey definitions
   */
  readonly journeyDefinitions: string;
  /**
   * The endpoint used for getting capturing media
   */
  readonly getCapturingMedia: string;
  /**
   * The endpoint used for posting token information to the services
   */
  readonly postToken: string;
  /**
   * The endpoint used for posting passive liveness images so it can be validated.
   */
  readonly passiveLiveness: string;
  readonly covidpass: string;
}

/**
 * An extended document description returned from the services
 *
 * @public
 */
export declare interface IExtendedDocument extends IDocument {
  /**
   * The Date and Time of the capture
   */
  readonly dateTime?: Date;
  /**
   * Has the document passed the blurriness check?
   */
  readonly blurCheck?: boolean;
  /**
   * Has the document passed the glare check?
   */
  readonly glareCheck?: boolean;
  /**
   * Has the document passed the low resolution check?
   */
  readonly lowResolutionCheck?: boolean;
  /**
   * Has the document passed the low full document in view check?
   */
  readonly fullDocumentInViewCheck?: boolean;
  /**
   * The reference assigned by the services for this journey
   */
  readonly scanReference?: string;
  /**
   * The address of the scanner which captured the document
   */
  readonly scannerIp?: string;
  /**
   * The reason of the triple scan for this journey
   */
  readonly tripleScanReason?: string;
}

/**
 * Configuration object interface for ExtractedField
 *
 * @public
 */
export declare interface IExtractedField {
  readonly boundsOfInterest: string;
  readonly documentSide: DocumentSide;
  readonly name: string;
  readonly value: string;
}

/**
 * Configuration object interface for FinalResult
 *
 * @public
 */
export declare interface IFinalResult {
  readonly additionalData: string[];
  readonly entryDateTime: Date;
  readonly evaluatedPersonEntryId: string;
  readonly firstName: string;
  readonly fullName: string;
  readonly gender: string;
  readonly highLevelResult: string;
  readonly lastName: string;
  readonly middleName: string;
  readonly processedDocuments: IProcessedDocument[];
  readonly referenceNumber: string;
}

/**
 * Configuration type which uses a synchronous function to retrieve the template
 * string.
 *
 * @public
 */
export declare interface IFunctionTemplateConfiguration {
  /**
   * The type of the template.
   */
  readonly type: TemplateType.Function;
  /**
   * The `PreProcessor` which the resolved template should be passed through.
   */
  readonly processor: PreProcessor;
  /**
   * A function which will return the correct template string.
   */
  readonly provider: TemplateFunction;
}

/**
 * Interface for configuring the HttpService
 *
 * @public
 */
export declare interface IHttpServiceConfiguration {
  authSettings: false | IAuthSettings;
  backendUrl: string;
  endpoints: IEndpoints;
  responseType: ResponseType;
}

/**
 * The data stored in the DataStore.
 *
 * @public
 */
export declare interface IIdScanData extends IDataStoreFormat {
  /**
   * The currently required action
   */
  requiredAction: RequiredAction;
}

/**
 * @public
 */
export declare interface IImageCoordinates {
  xBL: number;
  xBR: number;
  xTL: number;
  xTR: number;
  yBL: number;
  yBR: number;
  yTL: number;
  yTR: number;
}

/**
 * @public
 */
export declare interface IImageCounter {
  /**
   * @public
   */
  Blur: number;
  /**
   * @public
   */
  Glare: number;
  /**
   * @public
   */
  Resolution: number;
  /**
   * @public
   */
  Alignment: number;
}

/**
 * @public
 */
export declare interface IImageResult {
  /**
   * @public
   */
  quality: {
    blurCheck: boolean;
    glareCheck: boolean;
    resolutionCheck: boolean;
    coordinateCheck: boolean;
  };
  /**
   * @public
   */
  image: Uint8Array;
  /**
   * @public
   */
  coords: [[number, number], [number, number], [number, number], [number, number]];
}

/**
 * Interface for JourneyDefinitions
 *
 * @public
 */
export declare interface IJourneyDefinition {
  JourneyDefinitionId: string;
  Name: string;
  ChannelType: ChannelType;
  CapturingMedia: CapturingMedia;
  LastUpdatedDateTime: string;
  IsActive: boolean;
  EntryDefinitions: IJourneyEntryDefinition[];
}

/**
 * Interface for IJourneyEntryDefinition
 *
 * @public
 */
export declare interface IJourneyEntryDefinition {
  IsOptional: boolean;
  JourneyDefinitionId: string;
  JourneyEntryDefinitionId: string;
  Order: number;
  Type: number;
}

/**
 * This meta data will be emitted alongside a `JourneyEvent`. For more detailed
 * information about what to expect with each event, please consult the
 * integration documentation.
 *
 * @public
 */
export declare interface IJourneyEventMetaData {
  /**
   * The time the event occurred
   */
  readonly timestamp: number;
  /**
   * Additional information about the event
   */
  readonly [key: string]: any;
}

/**
 * Data structure for Journey
 *
 * @public
 */
export declare interface IJourneyInformation {
  /**
   * Any additional information about the journey
   */
  additionalData?: any;
  /**
   * The documents associated with this journey
   */
  documents: IDocument[];
  /**
   * The holder of the documents associated with the journey
   */
  holder: IPerson;
  /**
   * The address of the scanner which captured the documents
   */
  scannerIp?: string;
  /**
   * The reference number for the documents assigned by the scanner
   */
  scanReference?: string;
  /**
   * Has the document passed the low resolution check?
   */
  glareCheck?: any;
  /**
   * Has the document passed the blurriness check?
   */
  blurCheck?: any;
  /**
   * The reference number for the document assigned by the scanner
   */
  lowResolutionCheck?: any;
  /**
   * Has the document passed the full document full check?
   */
  fullDocumentInViewCheck?: any;
  /**
   * The reference number for the document assigned by the scanner
   */
  tripleScanReason?: string;
}

/**
 * The current state of the journey.
 *
 * @public
 */
export declare interface IJourneyState {
  /**
   * The current capture state of the journey. The value of this is dictated by the server.
   */
  readonly action: FlowState;
  /**
   * The number of times the request has been attempted
   */
  readonly actionAttempt: number;
  /**
   * The current input provider in use
   */
  readonly inputProvider: InputProvider;
  /**
   * The current page/step of the journey being shown to the user
   */
  readonly page: Templates;
  /**
   * The current state of the DataStore for this journey
   */
  readonly journey: IIdScanData;
}

/**
 * Type for ImageFormat
 *
 * @public
 */
export declare enum ImageFormat {
  Bmp = 'bmp',
  Jpeg = 'jpeg',
  Jpg = 'jpg',
  Png = 'png',
  Pdf = 'pdf',
}

/**
 * Contains the manual capture configuration for document step.
 *
 * @public
 */
export declare interface IManualCaptureConfiguration {
  /**
   * Indicates wether manual capture is enabled or not.
   *
   * @public
   */
  enabled: boolean;
  /**
   * How long should the smart-capture run (in seconds) before the
   * user is allowed to enable manual capture. Range is between 0-60.
   * Any value outside of this range will automatically disable the setting.
   *
   * @public
   */
  timeout: number;
}

/**
 * Configuration object interface for MetaData
 *
 * @public
 */
export declare interface IMetaData {
  /**
   * The key to send to the services
   */
  name: string;
  /**
   * The value to assign to the aforementioned key
   */
  value: string;
  /**
   * The step to assign to the required action key
   */
  step: string;
  /**
   * The type to assign to the value complex or simple key
   */
  type: string;
}

/**
 * The available input providers for the system. Which input provider should be
 * used is dictated by the services and should not be overridden unless
 * absolutely necessary.
 *
 * @public
 */
export declare enum InputProvider {
  /**
   * No input provider specified at this time. This could be because
   * authentication is required or the results overview is being shown.
   */
  NONE = 'NONE',
  /**
   * The customer will be presented with a viewfinder showing a camera preview
   * with the option to manually capture a frame. Options should be provided
   * to allow the user to control which camera to capture from based on their
   * hardware's capabilities.
   *
   * NOTE: This will require the user to allow access to the camera first
   * using the browser's default permissions process.
   */
  CAMERA = 'CAMERA',
  /**
   * The customer will be presented with an input box to either select a file
   * or drag a file into.
   */
  FILESYSTEM = 'FILESYSTEM',
  /**
   * The customer will be presented with the current scanner status and
   * instructions to allow to complete the capture process.
   *
   * NOTE: This will require the scanner to be set up and enabled in the
   * configuration before it will be made available for use.
   */
  SCANNER = 'SCANNER',
  /**
   * The customer will be presented with a viewfinder showing a camera preview
   * with the option to begin the automatic capture. They will then be guided
   * with on-screen instructions to indicate which pose should be performed.
   *
   * NOTE: This will require the user to allow access to the camera first
   * using the browser's default permissions dialog.
   */
  LIVENESS = 'LIVENESS',
  /**
   * The customer will be presented with a viewfinder showing a camera preview
   * with the option to begin the automatic capture.
   *
   * NOTE: This will require the user to allow access to the camera first
   * using the browser's default permissions dialog.
   */
  SMART_CAPTURE = 'SMART_CAPTURE',
}

/**
 * An empty template provider.
 *
 * NOTE: This will throw an intentional exception when passed into configuration.
 *
 * @public
 */
export declare interface INullTemplateConfiguration {
  /**
   * The type of the template.
   */
  readonly type: TemplateType.Null;
}

/**
 * Options for the camera overlay
 *
 * @public
 */
export declare interface IOverlayConfiguration {
  /**
   * Configuration options for the reticle displayed when capturing a document
   */
  documentReticle: IReticleConfiguration;
  /**
   * Configuration options for the reticle displayed when capturing a portrait
   */
  portraitReticle: IReticleConfiguration;
}

/**
 * Persistence settings for the instance of the SDK
 *
 * @public
 */
export declare interface IPersistenceSettings {
  /**
   * When the token should expire
   */
  readonly expire: number;
  /**
   * The name of the token
   */
  readonly tokenName?: string;
}

/**
 * The data about the person which has been extrapolated from the provided
 * identity documents.
 *
 * @public
 */
export declare interface IPerson {
  /**
   * The person's address
   */
  address: IPersonAddress;
  /**
   * The person's Date of Birth
   */
  birthDate?: string;
  /**
   * The person's place of birth
   */
  birthPlace?: string;
  /**
   * The person's first name
   */
  firstName?: string;
  /**
   * The person's full name
   */
  fullName?: string;
  /**
   * The person's middle name(s)
   */
  middleName?: string;
  /**
   * The person's last name
   */
  lastName?: string;
  /**
   * The person's sex/gender
   */
  gender?: string;
}

/**
 * Address for the Person
 *
 * @public
 */
export declare interface IPersonAddress {
  /**
   * The city the address resides in
   */
  city?: string;
  /**
   * The full address
   */
  full?: string;
  /**
   * The postal code of the address
   */
  postCode?: string;
}

/**
 * Contains the preview page configuration for each step in the journey.
 *
 * @public
 */
export declare interface IPreviewPagesConfiguration {
  documentStep: IPreviewProviderConfiguration;
  facematchStep: IPreviewProviderConfiguration;
  poaStep: IPreviewProviderConfiguration;
  passiveLivenessStep: IPreviewProviderConfiguration;
  covidStep: IPreviewProviderConfiguration;
}

/**
 * Provides information for specific providers preview pages.
 *
 * @public
 */
export declare interface IPreviewProviderConfiguration {
  smartCapture?: boolean;
  manualCapture: boolean;
}

/**
 * Configuration object interface for ProcessedDocument
 *
 * @public
 */
export declare interface IProcessedDocument {
  readonly countryCode: string;
  readonly countryName: string;
  readonly documentCategory: string;
  readonly documentImages: IDocumentImage[];
  readonly documentName: string;
  readonly documentNumber: string;
  readonly documentSide: string;
  readonly documentType: string;
  readonly documentSource: string;
  readonly expiryDate: Date;
  readonly extractedFields: IExtractedField[];
  readonly highLevelResult: HighLevelResult;
  readonly isRecognised: BoolAsString;
  readonly issueDate: Date;
  readonly page: string;
  readonly processFinishDate: Date;
  readonly processStartDate: Date;
  readonly side: string;
  readonly workflowAttempt: string;
  readonly COVIDPASSCROSSCHECKRESULT: string;
}

/**
 * Configuration type which uses a promise function to retrieve the template
 * string.
 *
 * @public
 */
export declare interface IPromiseTemplateConfiguration {
  /**
   * The type of the template.
   */
  readonly type: TemplateType.Promise;
  /**
   * The `PreProcessor` which the resolved template should be passed through.
   */
  readonly processor: PreProcessor;
  /**
   * A promise which will resolve with the correct template string.
   */
  readonly provider: Promise<string>;
}

/**
 * @public
 */
export declare interface IRange<T = any> {
  minimum: T;
  maximum: T;
}

/**
 * @public
 */
export declare interface IResolution {
  horizontal: number;
  vertical: number;
}

/**
 * Configuration options for a reticle
 *
 * @public
 */
export declare interface IReticleConfiguration {
  /**
   * A function which will generate an SVG path used to draw the reticles over
   * the top of the canvas before it's displayed to the user.
   */
  path: (width: number, height: number) => string;
}

/**
 * @public
 */
export declare interface IScannerState {
  connected: boolean;
  error?: ScannerError;
  state?: ScannerState;
  scanProcess: ScanProcess;
}

/**
 * Configuration for the Smart Capture component.
 *
 * @public
 */
export declare interface ISmartCaptureConfiguration {
  /**
   * How long to wait (in ms) before capturing another image if the previous
   * one failed validation checks.
   *
   * @defaultValue 5
   *
   * @public
   */
  recaptureDelay?: number;
  /**
   * Where the worker process script should be downloaded from.
   *
   * @defaultValue ./ides-micro.js
   *
   * @public
   */
  workerScriptUrl?: string;
  /**
   * Where the asm process script should be downloaded from.
   *
   * @defaultValue ./idesmicro_asm.js
   *
   * @public
   */
  asmScriptUrl?: string;
  /**
   * How long should the worker wait for the WASM to finish loading before
   * aborting and falling back to camera input. This is necessary as it's not
   * possible to work out if the WASM has failed at this time, so it has to be
   * assumed that if it hasn't loaded in the given time, we shouldn't wait any
   * longer and move on as it's likely failed.
   *
   * @defaultValue 60000
   *
   * @public
   */
  timeout?: number;
  /**
   * Execution timings to console logs if this parametre is enabled
   *
   * @defaultValue true
   *
   * @public
   */
  timeLogsEnabled?: boolean;
}

/**
 * @public
 */
export declare interface IStorageItem {
  key: string;
  value: string;
  expiration: number;
  timestamp: number;
}

/**
 * Configuration type which returns a static string as the template string.
 *
 * @public
 */
export declare interface IStringTemplateConfiguration {
  /**
   * The type of the template.
   */
  readonly type: TemplateType.String;
  /**
   * The `PreProcessor` which the resolved template should be passed through.
   */
  readonly processor: PreProcessor;
  /**
   * The string to use for the template.
   */
  readonly provider: string;
}

/**
 * Combined type for template configuration blocks. Please refer to the union
 * types within for further documentation.
 *
 * @public
 */
export declare type ITemplateConfiguration =
  | IPromiseTemplateConfiguration
  | IFunctionTemplateConfiguration
  | INullTemplateConfiguration
  | IStringTemplateConfiguration
  | IUrlTemplateConfiguration;

/**
 * Configuration type which provides a URL to retrieve the template string from.
 *
 * NOTE: Nothing is prepended to the URL string before the request is made, so
 *       it is possible to use either fully qualified addresses or relative
 *       addresses for the provider configuration.
 *
 * @public
 */
export declare interface IUrlTemplateConfiguration {
  /**
   * The type of the template.
   */
  readonly type: TemplateType.Url;
  /**
   * The `PreProcessor` which the resolved template should be passed through.
   */
  readonly processor: PreProcessor;
  /**
   * The URL to retrieve the template string from.
   */
  readonly provider: string;
}

/**
 * @public
 */
export declare interface IWorkerMessage<T = any> {
  id: string;
  message: IdesMicroWorkerMessages;
  data: T;
  timeLogsEnabled: boolean;
}

/**
 * @public
 */
export declare interface IWorkerMessageEvent<T = any> extends MessageEvent {
  data: IWorkerMessage<T>;
}

/**
 * Primary container for the IDScan Journey
 *
 * @public
 */
export declare class JourneyContainer {
  protected _previewPages: IPreviewPagesConfiguration;
  protected _manualCapture: IManualCaptureConfiguration;
  protected assetsFolder: string;
  /**
   * Primary container for the IDScan Journey
   */
  constructor(config: IContainerConfiguration);
  /**
   * Initialise this instance of the `JourneyContainer` and begin the journey
   * process for the user.
   *
   * @returns The instance of the `JourneyContainer` to chain from
   */
  initialize: () => Promise<this>;
  getJourneyDefinitions: () => Promise<IJourneyDefinition[]>;
  setJourneyDefinitonId: (id: string) => Promise<void>;
  /**
   * Terminate this instance of the `JourneyContainer`. This un-subscribes all
   * event handlers throughout the system then terminates the journey.
   *
   * NOTE: To terminate the journey, the `terminateJourney` function is
   *       automatically called and should not be called beforehand. If you
   *       only want to terminate the journey, call this method instead.
   *
   * @returns Promise to chain from
   */
  terminate: () => void;
  /**
   * Terminate the current journey and halt the retina service currently
   * associated with it.
   *
   * @returns Promise to chain from
   */
  terminateJourney: () => Promise<void>;
  /**
   * Get the current state of the journey
   *
   * @returns The current state of the journey as an `IJourneyState`
   */
  getJourneyState: () => IJourneyState;
  /**
   * Does the current journey configuration require the use of a camera?
   *
   * @remarks This will only review the requirement of a camera for normal
   * 			document upload, not the use of liveness as it's not always
   * 			possible to assert this.
   *
   * @public
   */
  requiresCamera: () => boolean;
  /**
   * Get a list of the currently available providers
   */
  getAvailableProviders: () => InputProvider[];
  /**
   * Freezes the image in the canvas, stopping the streaming.
   */
  protected freezeCameraStream: () => Promise<void>;
}

/**
 * An event which can occur during the lifetime of the Journey.
 *
 * @public
 */
export declare enum JourneyEvent {
  /**
   * Triggered when the authentication state in the SDK has changed.
   */
  AUTH_CHANGE = 'AUTH:CHANGE',
  /**
   * Triggered when there is a camera change, and due to this change the canvas displaying the image is resized.
   */
  CAMERA_CANVAS_RESIZE = 'CAMERA:CANVAS_RESIZE',
  /**
   * Triggered when the camera choice has been changed by the user.
   */
  CAMERA_CHANGE = 'CAMERA:CHANGE',
  /**
   * Triggered when the camera action has finished and has been closed.
   */
  CAMERA_DONE = 'CAMERA:DONE',
  /**
   * Triggered when the camera action has been paused remotely.
   */
  CAMERA_PAUSE = 'CAMERA:PAUSE',
  /**
   * Triggered when the service requires the user to pose for the camera. This
   * will usually trigger several times in succession with different poses for
   * the user to act upon.
   */
  CAMERA_POSE = 'CAMERA:POSE',
  /**
   * Triggered when the camera and service are ready to begin. Clicking the
   * `retina__start` button will begin the next section of the journey.
   */
  CAMERA_READY = 'CAMERA:READY',
  /**
   * Triggered when the user clicks the `retina__start` button and
   * transmission of frames to the remote server has begun.
   */
  CAMERA_START = 'CAMERA:START',
  /**
   * Triggered when the camera session has stopped.
   */
  CAMERA_STOP = 'CAMERA:STOP',
  /**
   * Triggered when the camera session has feedback to provide such as an
   * image being captured, or the service rejecting an image.
   */
  CAMERA_FEEDBACK = 'CAMERA:FEEDBACK',
  /**
   * Triggered when the observed capabilities of the devices found on this
   * system have been updated. Note that they may not have changed, the data
   * has just been refreshed when this has been triggered.
   */
  CAMERA_CAPABILITIES_UPDATED = 'CAMERA:CAPABILITIES_UPDATED',
  /**
   * Triggered when the input provider has been changed and the new UI has
   * been rendered to the specified container.
   */
  DISPLAY_PROVIDER = 'DISPLAY:PROVIDER',
  /**
   * Triggered when the input provider has been changed and the new UI has
   * been rendered to the specified container.
   */
  DISPLAY_INFO = 'DISPLAY:INFO',
  /**
   * Triggered when the current step in the journey has changed and the new UI
   * has been rendered to the specified container.
   */
  DISPLAY_STEP = 'DISPLAY:STEP',
  /**
   * Triggered when an error has occurred in the SDK. This can be triggered
   * for both fatal and recoverable exceptions.
   */
  ERROR = 'ERROR',
  /**
   * Triggered when the current journey has been cancelled.
   */
  JOURNEY_CANCEL = 'JOURNEY:CANCEL',
  /**
   * Triggered when the state of the current journey has been cleared/reset.
   */
  JOURNEY_CLEAR = 'JOURNEY:CLEAR',
  /**
   * Triggered when the journey has ended naturally.
   */
  JOURNEY_END = 'JOURNEY:END',
  /**
   * Triggered when the journey has progressed.
   */
  JOURNEY_PROGRESS = 'JOURNEY:PROGRESS',
  /**
   * Triggered when the journey has started.
   */
  JOURNEY_START = 'JOURNEY:START',
  /**
   * Triggered when the scanner has a result. It is accompanied with the
   * results of the scan in the event.
   */
  SCANNER_RESULT = 'SCANNER:RESULT',
  /**
   * Triggered when the scanner has an update such as a scan beginning, or
   * processing beginning on a captured image.
   */
  SCANNER_UPDATE = 'SCANNER:UPDATE',
  /**
   * Triggered when a file transfer has completed successfully. This can
   * trigger for any file transfer including templates requested over the
   * network and file uploads. The name specified when the request was made
   * will be specified.
   */
  TRANSFER_COMPLETE = 'TRANSFER:COMPLETE',
  /**
   * Triggered when a file transfer has failed during transit. This can
   * trigger for any file transfer including templates requested over the
   * network and file uploads. The name specified when the request was made
   * will be specified.
   */
  TRANSFER_FAILED = 'TRANSFER:FAILED',
  /**
   * Triggered when there has been progress in a file transfer. The values
   * will be from 0-50 during the upload phase, and 50-100 during the download
   * phase. This can trigger for any file transfer including templates
   * requested over the network and file uploads. The name specified when the
   * request was made will be specified.
   */
  TRANSFER_PROGRESS = 'TRANSFER:PROGRESS',
  /**
   * Triggered when a file transfer has started. This can trigger for any file
   * transfer including templates requested over the network and file uploads.
   * The name specified when the request was made will be specified.
   */
  TRANSFER_STARTED = 'TRANSFER:STARTED',
  /**
   * Triggered when the liveness is processing.
   */
  LIVENESS_PROCESSING = 'LIVENESS:PROCESSING',
  /**
   * Triggered when Passive Liveness response has been received.
   */
  PASSIVE_LIVENESS_FINISHED = 'PASSIVE_LIVENESS:FINISHED',
  /**
   * Triggered when the liveness processing has finished.
   */
  LIVENESS_FINISHED = 'LIVENESS:FINISHED',
  /**
   * Triggered when the covid processing has finished.
   */
  COVID_FINISHED = 'COVID:FINISHED',
}

/**
 * The current state of the Journey
 *
 * @public
 */
export declare enum JourneyState {
  /**
   * The journey has ended.
   */
  ENDED = 'ENDED',
  /**
   * The journey is currently in progress.
   */
  INPROGRESS = 'INPROGRESS',
  /**
   * The journey has started but there has been no data submitted.
   */
  STARTED = 'STARTED',
}

/**
 * @public
 */
export declare class LanguageService {
  private _language;
  private _dictionary;
  private _translator;
  readonly dictionary: TranslationDictionary;
  setLanguage: (language?: string | undefined) => string;
  setTranslator: (translator?: Translator | undefined) => Translator;
  setDictionary: (dictionary?: Partial<Record<TranslationKey, string>> | undefined) =>
    | {
        REQUIRED_ACTION_KeepCapturing: string;
        REQUIRED_ACTION_StopCapturing: string;
        REQUIRED_ACTION_PauseCapturing: string;
        REQUIRED_ACTION_Close: string;
        REQUIRED_ACTION_Error: string;
        LIVENESS_ACTION_Smile: string;
        LIVENESS_ACTION_Frown: string;
        'LIVENESS_ACTION_Tilt Left': string;
        'LIVENESS_ACTION_Tilt Right': string;
        'LIVENESS_ACTION_Tilt Up': string;
        'LIVENESS_ACTION_Tilt Down': string;
        'LIVENESS_ACTION_Look Straight': string;
        'LIVENESS_ACTION_No Action': string;
        'LIVENESS_ACTION_Processing Liveness': string;
        'LIVENESS_RESULT_Thank you!.Failed': string;
        'LIVENESS_RESULT_Thank you!.Passed': string;
        'LIVENESS_RESULT_Thank you!.ActionTimedOut': string;
        'LIVENESS_RESULT_Thank you!.Interrupted': string;
        'LIVENESS_RESULT_Thank you!.Undefined': string;
        LIVENESS_ACTION_LOOK_STRAIGHT_TITLE: string;
        LIVENESS_ACTION_LOOK_STRAIGHT_TEXT: string;
        LIVENESS_ACTION_LOOK_LEFT_TITLE: string;
        LIVENESS_ACTION_LOOK_LEFT_TEXT: string;
        LIVENESS_ACTION_LOOK_RIGHT_TITLE: string;
        LIVENESS_ACTION_LOOK_RIGHT_TEXT: string;
        LIVENESS_ACTION_LOOK_UP_TITLE: string;
        LIVENESS_ACTION_LOOK_UP_TEXT: string;
        LIVENESS_ACTION_LOOK_DOWN_TITLE: string;
        LIVENESS_ACTION_LOOK_DOWN_TEXT: string;
        LIVENESS_ACTION_SMILE_TITLE: string;
        LIVENESS_ACTION_SMILE_TEXT: string;
        LIVENESS_ACTION_FROWN_TITLE: string;
        LIVENESS_ACTION_FROWN_TEXT: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CROPPED_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE_TITLE: string;
        PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED_TITLE: string;
        PASSIVE_LIVENESS_ERROR_UNKNOWN_TITLE: string;
        PASSIVE_LIVENESS_ERROR_INTERNAL_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER: string;
        PASSIVE_LIVENESS_ERROR_FACE_CROPPED: string;
        PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL: string;
        PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE: string;
        PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES: string;
        PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED: string;
        PASSIVE_LIVENESS_ERROR_UNKNOWN: string;
        PASSIVE_LIVENESS_ERROR_INTERNAL: string;
        INITIALIZING_TITLE: string;
        INITIALIZING_DESCRIPTION: string;
        JOURNEY_STATE_STARTED: string;
        JOURNEY_STATE_INPROGRESS: string;
        JOURNEY_STATE_ENDED: string;
        INFO_JOURNEY_STATE: string;
        INFO_JOURNEY_ACTION: string;
        INFO_JOURNEY_ACTION_ATTEMPT: string;
        INFO_JOURNEY_ID: string;
        INFO_JOURNEY_RESULT: string;
        INFO_JOURNEY_REFERENCE: string;
        FLOW_STATE_NONE: string;
        'FLOW_STATE_IDENTITY:FRONT': string;
        'FLOW_STATE_IDENTITY:BACK': string;
        FLOW_STATE_ADDRESS: string;
        FLOW_STATE_SELFIE: string;
        FLOW_STATE_LIVENESS: string;
        FLOW_STATE_COVID: string;
        PROVIDER_TITLE_CAMERA: string;
        PROVIDER_TITLE_CROPPER: string;
        PROVIDER_TITLE_FILESYSTEM_ID: string;
        PROVIDER_TITLE_FILESYSTEM_FACEMATCH: string;
        PROVIDER_TITLE_FILESYSTEM_ADDRESS: string;
        PROVIDER_TITLE_FILESYSTEM_COVID: string;
        PROVIDER_TITLE_GATEWAY: string;
        PROVIDER_TITLE_LIVENESS: string;
        PROVIDER_TITLE_PASSIVE_LIVENESS: string;
        PROVIDER_TITLE_LOGIN: string;
        PROVIDER_TITLE_RESULTS: string;
        PROVIDER_TITLE_SCANNER: string;
        PROVIDER_TITLE_VIEW_ID: string;
        PROVIDER_TITLE_VIEW_FACEMATCH: string;
        PROVIDER_TITLE_VIEW_ADDRESS: string;
        PROVIDER_TITLE_VIEW_COVID: string;
        PROVIDER_SUBTITLE_FILESYSTEM_ID: string;
        PROVIDER_SUBTITLE_FILESYSTEM_FACEMATCH: string;
        PROVIDER_SUBTITLE_FILESYSTEM_ADDRESS: string;
        PROVIDER_SUBTITLE_FILESYSTEM_COVID: string;
        PROVIDER_SUBTITLE_SCANNER_ID: string;
        PROVIDER_SUBTITLE_VIEW_ID: string;
        PROVIDER_SUBTITLE_VIEW_FACEMATCH: string;
        PROVIDER_SUBTITLE_VIEW_ADDRESS: string;
        PROVIDER_SUBTITLE_VIEW_COVID: string;
        PROVIDER_TITLE_SMART_CAPTURE: string;
        PROVIDER_TITLE_JOURNEY_SELECT: string;
        FILESYSTEM_SUPPORTED_TYPES_START: string;
        FILESYSTEM_SUPPORTED_TYPES_END: string;
        FILESYSTEM_SUPPORTED_TYPES_START_SELFIE: string;
        FILESYSTEM_MAX_FILE_SIZE: string;
        FILESYSTEM_CHECK_FILE_TOO_BIG: string;
        FILESYSTEM_CHECK_FILE_INCORRECT_FORMAT: string;
        FILESYSTEM_IDENTITY_DOCUMENT: string;
        FILESYSTEM_FACEMATCH: string;
        FILESYSTEM_ADDRESS: string;
        FILESYSTEM_COVID: string;
        FILESYSTEM_DRAG_DROP: string;
        FILESYSTEM_OR: string;
        FILESYSTEM_CHOOSE: string;
        FILESYSTEM_UPLOADING: string;
        TRIPLESCAN_GUIDANCE_TRYAGAIN: string;
        FAILURE_REASON_NOT_SUPPORTED: string;
        FAILURE_REASON_REFER: string;
        FAILURE_REASON_EXPIRED: string;
        FAILURE_REASON_NOT_ACCEPTED: string;
        PLEASE_TRY_AGAIN_REFER: string;
        PLEASE_TRY_AGAIN_EXPIRED: string;
        PLEASE_TRY_AGAIN_NOT_ACCEPTED: string;
        PLEASE_TRY_AGAIN_NOT_SUPPORTED: string;
        BLUR_CHECK_REASON: string;
        GLARE_CHECK_REASON: string;
        RESOLUTION_CHECK_REASON: string;
        EDGES_CHECK_REASON: string;
        VALIDATION_FAILED: string;
        VALIDATION_FAILED_REASON_DOC_UNKNOWN: string;
        VALIDATION_FAILED_REASON_DOC_NOT_ACCEPTED: string;
        VALIDATION_FAILED_REASON_DOC_EXPIRED: string;
        PREVIEW_INFO_TITLE_ID: string;
        PREVIEW_INFO_GOOD: string;
        PREVIEW_INFO_BAD: string;
        PREVIEW_INFO_GOOD_EXAMPLE_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_ID: string;
        PREVIEW_INFO_TITLE_FACEMATCH: string;
        PREVIEW_INFO_GOOD_EXAMPLE_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_FACEMATCH: string;
        PREVIEW_INFO_TITLE_ADDRESS: string;
        PREVIEW_INFO_GOOD_EXAMPLE_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_ADDRESS: string;
        PREVIEW_INFO_TITLE_COVID: string;
        PREVIEW_INFO_GOOD_EXAMPLE_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_COVID: string;
        PREVIEW_ATTEMPT_NUMBER_START: string;
        PREVIEW_ATTEMPT_NUMBER_END: string;
        CAMERA_CAPTURE: string;
        CAMERA_CAPTURE_START_BUTTON: string;
        CAMERA_CAPTURE_CAPTION: string;
        CAMERA_PREVIEW_START: string;
        CAMERA_CONDITION_BLUR: string;
        CAMERA_CONDITION_CAPTURING: string;
        CAMERA_CONDITION_UPLOADING: string;
        CAMERA_CONDITION_ALIGNMENT: string;
        CAMERA_CONDITION_GLARE: string;
        VERIFYING_TITLE: string;
        PREPARING_PREVIEW_TITLE: string;
        CAMERA_CONDITION_LOW_RESOLUTION: string;
        CAMERA_PREVENT_GLARE_HINT: string;
        CAMERA_PREVENT_BLUR_HINT: string;
        CAMERA_PREVENT_LOW_RES_HINT: string;
        CAMERA_SMARTCAPTURE_ON: string;
        CAMERA_SMARTCAPTURE_OFF: string;
        CAMERA_CAPTURE_FRONT: string;
        CAMERA_MANUAL_CAPTURE_FRONT: string;
        CAMERA_CAPTURE_BACK: string;
        CAMERA_CAPTURE_SELFIE_CAPTION: string;
        CAMERA_CAPTURE_ADDRESS_CAPTION: string;
        CAMERA_CAPTURE_COVID_CAPTION: string;
        CAMERA_LOADING: string;
        CROPPER_RETRY: string;
        CROPPER_UPLOAD: string;
        CROPPER_UPLOADING: string;
        FILESYSTEM_SELECT: string;
        FILESYSTEM_DROP_IMAGE: string;
        GATEWAY_CAMERA: string;
        GATEWAY_CANCEL: string;
        LIVENESS_START: string;
        PASSIVE_LIVENESS_START: string;
        LOGIN_USERNAME: string;
        LOGIN_PASSWORD: string;
        LOGIN_SUBMIT: string;
        RESULTS_DOCUMENTS: string;
        RESULTS_DOCUMENTS_NONE: string;
        RESULTS_DOCUMENT_TYPE: string;
        RESULTS_DOCUMENT_RESULT: string;
        RESULTS_EXTRACTED_FIELDS_NONE: string;
        RESULTS_DETAILS: string;
        RESULTS_DETAILS_NONE: string;
        RESULTS_NEW_JOURNEY: string;
        RESULTS_NO_INFORMATION: string;
        RESULTS_LOGOUT: string;
        RESULTS_HIGH_LEVEL_Aborted: string;
        RESULTS_HIGH_LEVEL_Expired: string;
        RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE: string;
        RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE_VALUE: string;
        RESULTS_HIGH_LEVEL_NotAccepted: string;
        RESULTS_HIGH_LEVEL_NotSupported: string;
        RESULTS_HIGH_LEVEL_Notsupported: string;
        RESULTS_HIGH_LEVEL_Passed: string;
        RESULTS_HIGH_LEVEL_Refer: string;
        RESULTS_HIGH_LEVEL_Undefined: string;
        RESULTS_HIGH_LEVEL_DETAIL_ACCUMULATIVELIVENESSRESULT: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTFRONTSIDETYPECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDETYPECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBLOCKINGPOLICY: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTOVERALLVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTEXPIRY: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTSUPPORT: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTPROOFPOLICY: string;
        RESULTS_HIGH_LEVEL_DETAIL_FACEMATCHVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_UNDERAGERULE: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_SUCCESSNEEDED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_FAILED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_NOTNEEDED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_PASSED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_SKIPPED: string;
        RESULTS_HIGH_LEVEL_DETAIL_COVIDPASSCROSSCHECKRESULT: string;
        VIEW_RETRY: string;
        VIEW_CROP: string;
        VIEW_CROPPING: string;
        VIEW_UPLOAD: string;
        VIEW_UPLOADING: string;
        SMART_CAPTURE_INITIALIZING: string;
        SMART_CAPTURE_START: string;
        SCANNER_DESC_AVAILABLE: string;
        SCANNER_DESC_PROCESSING: string;
        SCANNER_DESC_SCANNING: string;
        SCANNER_DESC_DISCONNECTED: string;
        SCANNER_DESC_NOT_CONNECTED: string;
        SCANNER_DESC_OFFLINE: string;
        SCANNER_DESC_BUSY: string;
        SCANNER_DESC_WAITING: string;
        SCANNER_DESC_LOADING: string;
        SCANNER_TITLE_AVAILABLE: string;
        SCANNER_TITLE_PROCESSING: string;
        SCANNER_TITLE_SCANNING: string;
        SCANNER_TITLE_DISCONNECTED: string;
        SCANNER_TITLE_NOT_CONNECTED: string;
        SCANNER_TITLE_OFFLINE: string;
        SCANNER_TITLE_BUSY: string;
        SCANNER_TITLE_WAITING: string;
        SCANNER_ACTION_REGISTER: string;
        SCANNER_ACTION_RELEASE: string;
        CANCEL_JOURNEY: string;
        MANUAL_PHOTO_UPLOAD_TOGGLE_FALSE: string;
        MANUAL_PHOTO_UPLOAD_TOGGLE_TRUE: string;
        JOURNEY_SELECT_CONTINUE: string;
        HELP_MODAL_AUTOCAPTURE_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_TIPS: string;
        HELP_MODAL_AUTOCAPTURE_GLARE_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_GLARE_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_FAR_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_FAR_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_BLUR_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_BLUR_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_MANUAL_CAPTURE: string;
        HELP_MODAL_AUTOCAPTURE_TURN_MANUAL_CAPTURE: string;
        HELP_MODAL_SELFIE_TITLE: string;
        HELP_MODAL_SELFIE_SUBTITLE: string;
        HELP_MODAL_POA_TITLE: string;
        HELP_MODAL_POA_SUBTITLE: string;
        HELP_MODAL_POA_TIPS: string;
        HELP_MODAL_POA_GLARE_TITLE: string;
        HELP_MODAL_POA_GLARE_SUBTITLE: string;
        HELP_MODAL_POA_FAR_TITLE: string;
        HELP_MODAL_POA_FAR_SUBTITLE: string;
        HELP_MODAL_POA_BLUR_TITLE: string;
        HELP_MODAL_POA_BLUR_SUBTITLE: string;
        HELP_MODAL_POA_MANUAL_CAPTURE: string;
        HELP_MODAL_POA_TURN_MANUAL_CAPTURE: string;
        HELP_MODAL_NEED_HELP: string;
        EXCEPTION: string;
        EXCEPTION_AUTHORIZATION: string;
        EXCEPTION_AUTHORIZATION_ACCOUNT_NOT_AUTHORIZED: string;
        EXCEPTION_AUTHORIZATION_AUTH_DETAILS_INVALID: string;
        EXCEPTION_AUTHORIZATION_AUTH_NOT_ENABLED: string;
        EXCEPTION_AUTHORIZATION_PROCESS_NOT_AUTHORIZED: string;
        EXCEPTION_BAD_REQUEST: string;
        EXCEPTION_BAD_REQUEST_INVALID_IMAGE: string;
        EXCEPTION_BAD_REQUEST_WAITING_FOR_RESPONSE: string;
        EXCEPTION_FLOW_STATE_JOURNEY_ENDED: string;
        EXCEPTION_FLOW_STATE_MISSING: string;
        EXCEPTION_INVALID_PARAMETER_CALLBACK_MUST_BE_FUNCTION: string;
        EXCEPTION_INVALID_PARAMETER_NAME_MUST_BE_STRING: string;
        EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_NUMBER: string;
        EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_POSITIVE_NUMBER: string;
        EXCEPTION_INVALID_PARAMETER_SHOULD_BE_ELEMENT_OR_SELECTOR: string;
        EXCEPTION_INVALID_PARAMETER_VALUE_NOT_VALID: string;
        EXCEPTION_INVALID_PARAMETER_VALUE_DAMAGED: string;
        EXCEPTION_MISSING_PARAMETER_BACKEND_URL_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_COORDINATES_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_IMAGES_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_PASSWORD_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_USERNAME_MISSING: string;
        EXCEPTION_JOURNEY_DEFINITIONS_MISSING: string;
        EXCEPTION_NETWORK: string;
        EXCEPTION_PLATFORM_BROWSER_ONLY: string;
        EXCEPTION_PLATFORM_UNSUPPORTED: string;
        EXCEPTION_PLATFORM_CAMERA_PERMISSION_DENIED: string;
        EXCEPTION_PLATFORM_CAMERA_PERMISSION_UNAVAILABLE: string;
        EXCEPTION_PLATFORM_CAMERA_NOT_READABLE: string;
        EXCEPTION_PLATFORM_CAMERA_NONE_SUITABLE: string;
        EXCEPTION_SERVER: string;
        EXCEPTION_SERVER_UNREACHABLE: string;
        EXCEPTION_SERVER_DATA_NOT_PERSISTED: string;
        EXCEPTION_SERVER_RESULT_NOT_PASSING: string;
        EXCEPTION_TEMPLATE_CANVAS_CONTEXT_UNAVAILABLE: string;
        EXCEPTION_TEMPLATE_CONTAINER_MISSING: string;
        EXCEPTION_TEMPLATE_ELEMENTS_MISSING: string;
        EXCEPTION_TEMPLATE_MISSING: string;
        EXCEPTION_TEMPLATE_SOURCE_ELEMENT_MISSING: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_CANNOT_RETRIEVE: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NONE_SPECIFIED: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NOT_AVAILABLE: string;
        'SUPPORTED_DOCUMENT_Account Statement': string;
        'SUPPORTED_DOCUMENT_Agreement (Tenancy)': string;
        'SUPPORTED_DOCUMENT_Bank Document': string;
        'SUPPORTED_DOCUMENT_Bank Letter': string;
        'SUPPORTED_DOCUMENT_Bank Statement': string;
        'SUPPORTED_DOCUMENT_Benefit Letter': string;
        'SUPPORTED_DOCUMENT_Certificate (Birth, Marriage, Civil partnership)': string;
        'SUPPORTED_DOCUMENT_Council Document': string;
        'SUPPORTED_DOCUMENT_Council Letter': string;
        'SUPPORTED_DOCUMENT_Council Tax': string;
        'SUPPORTED_DOCUMENT_Driving License': string;
        'SUPPORTED_DOCUMENT_Driving Licence': string;
        'SUPPORTED_DOCUMENT_DWP Document': string;
        'SUPPORTED_DOCUMENT_HMRC Document': string;
        'SUPPORTED_DOCUMENT_Information Sheet': string;
        'SUPPORTED_DOCUMENT_Insurance Document': string;
        'SUPPORTED_DOCUMENT_Insurance Letter': string;
        SUPPORTED_DOCUMENT_Invoice: string;
        'SUPPORTED_DOCUMENT_NIC Letter': string;
        'SUPPORTED_DOCUMENT_NINO Letter': string;
        'SUPPORTED_DOCUMENT_Official Document': string;
        'SUPPORTED_DOCUMENT_Official Letter': string;
        'SUPPORTED_DOCUMENT_Repayment Letter (related to Tax or Social support)': string;
        'SUPPORTED_DOCUMENT_Tax Letter': string;
        'SUPPORTED_DOCUMENT_Tax Statement': string;
        'SUPPORTED_DOCUMENT_Tel Bill': string;
        'SUPPORTED_DOCUMENT_Tel Letter': string;
        'SUPPORTED_DOCUMENT_Telecommunication Document': string;
        'SUPPORTED_DOCUMENT_TV Licence': string;
        'SUPPORTED_DOCUMENT_University Letter': string;
        'SUPPORTED_DOCUMENT_Utility Bill': string;
        'SUPPORTED_DOCUMENT_Utility Document': string;
        'SUPPORTED_DOCUMENT_Utility Letter': string;
        'SUPPORTED_DOCUMENT_Water Bil': string;
        'SUPPORTED_DOCUMENT_Water Document': string;
        'SUPPORTED_DOCUMENT_Agents License': string;
        'SUPPORTED_DOCUMENT_Electoral Card': string;
        'SUPPORTED_DOCUMENT_Foreigner Identification Card': string;
        'SUPPORTED_DOCUMENT_Health Card': string;
        'SUPPORTED_DOCUMENT_Job License ': string;
        'SUPPORTED_DOCUMENT_Membership Identification Card': string;
        'SUPPORTED_DOCUMENT_Military Identification Card': string;
        'SUPPORTED_DOCUMENT_National Identification Card': string;
        SUPPORTED_DOCUMENT_Passport: string;
        'SUPPORTED_DOCUMENT_Travel Permit': string;
        SUPPORTED_DOCUMENT_Visa: string;
        'SUPPORTED_DOCUMENT_Weapons Licence': string;
        'SUPPORTED_DOCUMENT_Selfie Photo': string;
        SUPPORTED_DOCUMENT_Unknown: string;
        SUPPORTED_DOCUMENT_CovidPass: string;
        EXTRACTED_FIELDS_AddressFull: string;
        EXTRACTED_FIELDS_AddressCity: string;
        EXTRACTED_FIELDS_AddressPostCode: string;
        EXTRACTED_FIELDS_LastNameFirstPart: string;
        EXTRACTED_FIELDS_Sex: string;
        EXTRACTED_FIELDS_BirthPlace: string;
        EXTRACTED_FIELDS_IssueNumber: string;
        EXTRACTED_FIELDS_DocumentNumberCheckDigit: string;
        EXTRACTED_FIELDS_BirthDate: string;
        EXTRACTED_FIELDS_DocumentNumber: string;
        EXTRACTED_FIELDS_COVIDPASSCROSSCHECKRESULT: string;
        EXTRACTED_FIELDS_FirstName: string;
        EXTRACTED_FIELDS_ArbitraryDigit: string;
        EXTRACTED_FIELDS_FirstNameInitial: string;
        EXTRACTED_FIELDS_ExpiryDate: string;
        EXTRACTED_FIELDS_IssueDate: string;
        EXTRACTED_FIELDS_LastName: string;
        EXTRACTED_FIELDS_LicenseCategory: string;
        EXTRACTED_FIELDS_DocumentCategory: string;
        EXTRACTED_FIELDS_DocumentType: string;
        EXTRACTED_FIELDS_NationalityCode: string;
        EXTRACTED_FIELDS_MiddleName: string;
        EXTRACTED_FIELDS_FirstIssuanceDate: string;
        EXTRACTED_FIELDS_SecondLastName: string;
        EXTRACTED_FIELDS_FullName: string;
        EXTRACTED_FIELDS_PersonalNumber: string;
        EXTRACTED_FIELDS_NationalityName: string;
        EXTRACTED_FIELDS_BarcodeItems: string;
        EXTRACTED_FIELDS_BirthPlaceCity: string;
        EXTRACTED_FIELDS_BirthPlaceState: string;
        EXTRACTED_FIELDS_BirthPlaceCountry: string;
        EXTRACTED_FIELDS_MRZFull: string;
        EXTRACTED_FIELDS_MRZLine1: string;
        EXTRACTED_FIELDS_MRZLine2: string;
        EXTRACTED_FIELDS_MRZLine3: string;
        EXTRACTED_FIELDS_ObservationPage: string;
        EXTRACTED_FIELDS_IssuingAuthority: string;
        EXTRACTED_FIELDS_IssuingLocation: string;
        EXTRACTED_FIELDS_MaritalStatus: string;
        EXTRACTED_FIELDS_Occupation: string;
        EXTRACTED_FIELDS_AlienNumber: string;
        EXTRACTED_FIELDS_Employer: string;
        EXTRACTED_FIELDS_AddressLine1: string;
        EXTRACTED_FIELDS_AddressLine2: string;
        EXTRACTED_FIELDS_AddressLine3: string;
        EXTRACTED_FIELDS_AddressLine4: string;
        EXTRACTED_FIELDS_AddressState: string;
        EXTRACTED_FIELDS_AddressDistrict: string;
        EXTRACTED_FIELDS_AddressBuildingNumber: string;
        EXTRACTED_FIELDS_AddressBuildingName: string;
        EXTRACTED_FIELDS_AddressStreet: string;
        EXTRACTED_FIELDS_AddressCountry: string;
        EXTRACTED_FIELDS_RefAddressFull: string;
        EXTRACTED_FIELDS_RefAddressLine1: string;
        EXTRACTED_FIELDS_RefAddressLine2: string;
        EXTRACTED_FIELDS_RefAddressLine3: string;
        EXTRACTED_FIELDS_RefAddressLine4: string;
        EXTRACTED_FIELDS_RefAddressCity: string;
        EXTRACTED_FIELDS_RefAddressState: string;
        EXTRACTED_FIELDS_RefAddressDistrict: string;
        EXTRACTED_FIELDS_RefAddressBuildingNumber: string;
        EXTRACTED_FIELDS_RefAddressBuildingName: string;
        EXTRACTED_FIELDS_RefAddressSubBuildingName: string;
        EXTRACTED_FIELDS_RefAddressStreet: string;
        EXTRACTED_FIELDS_RefAddressCountry: string;
        EXTRACTED_FIELDS_RefAddressPostCode: string;
        EXTRACTED_FIELDS_HealthNumber: string;
        EXTRACTED_FIELDS_Endorsements: string;
        EXTRACTED_FIELDS_Constraints: string;
        EXTRACTED_FIELDS_LicenseMarine: string;
        EXTRACTED_FIELDS_Height: string;
        EXTRACTED_FIELDS_Weight: string;
        EXTRACTED_FIELDS_HairColor: string;
        EXTRACTED_FIELDS_EyeColor: string;
        EXTRACTED_FIELDS_LensData: string;
        EXTRACTED_FIELDS_SocialSecurityNumber: string;
        EXTRACTED_FIELDS_NationalInsuranceNumber: string;
        EXTRACTED_FIELDS_Race: string;
        EXTRACTED_FIELDS_MotherName: string;
        EXTRACTED_FIELDS_FatherName: string;
        EXTRACTED_FIELDS_Parents: string;
        EXTRACTED_FIELDS_Remarks: string;
        EXTRACTED_FIELDS_DistinguishingMarks: string;
        EXTRACTED_FIELDS_PeriodOfStay: string;
        EXTRACTED_FIELDS_TaxNumber: string;
        EXTRACTED_FIELDS_Donor: string;
        EXTRACTED_FIELDS_RFIDG1: string;
        EXTRACTED_FIELDS_RFIDG2: string;
        EXTRACTED_FIELDS_RFIDG3: string;
        EXTRACTED_FIELDS_RFIDG15: string;
        EXTRACTED_FIELDS_RFIDSOD: string;
        EXTRACTED_FIELDS_PortraitPhoto: string;
        EXTRACTED_FIELDS_Title: string;
        EXTRACTED_FIELDS_IssueDate2: string;
        EXTRACTED_FIELDS_ExpiryDate2: string;
        EXTRACTED_FIELDS_LicenseCategory2: string;
        EXTRACTED_FIELDS_IssueDate3: string;
        EXTRACTED_FIELDS_ExpiryDate3: string;
        EXTRACTED_FIELDS_LicenseCategory3: string;
        EXTRACTED_FIELDS_IssueDate4: string;
        EXTRACTED_FIELDS_ExpiryDate4: string;
        EXTRACTED_FIELDS_LicenseCategory4: string;
        EXTRACTED_FIELDS_MRZCode1: string;
        EXTRACTED_FIELDS_MRZCode2: string;
        EXTRACTED_FIELDS_MRZStandardType: string;
        EXTRACTED_FIELDS_AddressStreetSuffix: string;
        EXTRACTED_FIELDS_AddressStreetType: string;
        EXTRACTED_FIELDS_AddressUnitNumber: string;
        EXTRACTED_FIELDS_LicenseNumber: string;
        EXTRACTED_FIELDS_AddressStateCode: string;
        EXTRACTED_FIELDS_AddressStreetTypeAbbreviation: string;
        EXTRACTED_FIELDS_AddressUnitType: string;
        EXTRACTED_FIELDS_AddressDeliveryPointIdentifier: string;
        EXTRACTED_FIELDS_AgeCategory: string;
        EXTRACTED_FIELDS_ChildernCount: string;
        EXTRACTED_FIELDS_EntryMode: string;
        EXTRACTED_FIELDS_VAFNumber: string;
        EXTRACTED_FIELDS_AddressLine5: string;
        EXTRACTED_FIELDS_RFIDPortraitPhoto: string;
        EXTRACTED_FIELDS_RefAddressLine5: string;
        EXTRACTED_FIELDS_RefAddressStateCode: string;
        EXTRACTED_FIELDS_RefAddressStreetType: string;
        EXTRACTED_FIELDS_RefAddressStreetTypeAbbreviation: string;
        EXTRACTED_FIELDS_RefAddressStreetSuffix: string;
        EXTRACTED_FIELDS_RefAddressUnitNumber: string;
        EXTRACTED_FIELDS_RefAddressUnitType: string;
        EXTRACTED_FIELDS_RefAddressPostcodeType: string;
        EXTRACTED_FIELDS_RefAddressDeliveryPointIdentifier: string;
        EXTRACTED_FIELDS_RefAddressPOBoxNumber: string;
        EXTRACTED_FIELDS_RefAddressDependentLocality: string;
        EXTRACTED_FIELDS_RefAddressDoubleDependentLocality: string;
        EXTRACTED_FIELDS_RefAddressThoroughfare: string;
        EXTRACTED_FIELDS_RefAddressThoroughfareDesc: string;
        EXTRACTED_FIELDS_RefAddressDependentThoroughfare: string;
        EXTRACTED_FIELDS_RefAddressDependentThoroughfareDesc: string;
        EXTRACTED_FIELDS_RefAddressSubBuildingNumber: string;
        EXTRACTED_FIELDS_AddressSubBuildingNumber: string;
        EXTRACTED_FIELDS_AddressSubBuildingName: string;
        EXTRACTED_FIELDS_AddressPostCodeType: string;
        EXTRACTED_FIELDS_IssuingAuthorityType: string;
        EXTRACTED_FIELDS_Signature: string;
        EXTRACTED_FIELDS_Hologram: string;
        EXTRACTED_FIELDS_CardNumber: string;
        EXTRACTED_FIELDS_MiddleNameInitial: string;
        EXTRACTED_FIELDS_PermitNumber: string;
        EXTRACTED_FIELDS_ReferenceNumber: string;
        EXTRACTED_FIELDS_CustomerNumber: string;
        EXTRACTED_FIELDS_BOSNumber: string;
        EXTRACTED_FIELDS_StudentID: string;
        EXTRACTED_FIELDS_MembershipNumber: string;
        EXTRACTED_FIELDS_LicenseType: string;
        EXTRACTED_FIELDS_LicenseType2: string;
        EXTRACTED_FIELDS_LicenseType3: string;
        EXTRACTED_FIELDS_LicenseType4: string;
        EXTRACTED_FIELDS_DocumentTypeCode: string;
        EXTRACTED_FIELDS_MRZDocumentNumberCheckDigit: string;
        EXTRACTED_FIELDS_MRZBirthDateCheckDigit: string;
        EXTRACTED_FIELDS_MRZExpiryDateCheckDigit: string;
        EXTRACTED_FIELDS_MRZPersonalNumberCheckDigit: string;
        EXTRACTED_FIELDS_MRZCompositeCheckDigit: string;
        EXTRACTED_FIELDS_SecondaryPortraitPhoto: string;
        EXTRACTED_FIELDS_Fingerprint: string;
        EXTRACTED_FIELDS_VersionNumber: string;
        EXTRACTED_FIELDS_Conditions: string;
        EXTRACTED_FIELDS_NickName: string;
        EXTRACTED_FIELDS_AddressApartmentNumber: string;
        EXTRACTED_FIELDS_AddressFloorNumber: string;
        EXTRACTED_FIELDS_FirstNameLocal: string;
        EXTRACTED_FIELDS_LastNameLocal: string;
        EXTRACTED_FIELDS_FullNameLocal: string;
        EXTRACTED_FIELDS_BirthPlaceLocal: string;
        EXTRACTED_FIELDS_IssuingAuthorityLocal: string;
        EXTRACTED_FIELDS_MotherNameLocal: string;
        EXTRACTED_FIELDS_FatherNameLocal: string;
        EXTRACTED_FIELDS_AddressFullLocal: string;
        EXTRACTED_FIELDS_MiddleNameLocal: string;
        EXTRACTED_FIELDS_AddressLine1Local: string;
        EXTRACTED_FIELDS_AddressLine2Local: string;
        EXTRACTED_FIELDS_AddressLine3Local: string;
        EXTRACTED_FIELDS_IndRefNumber1: string;
        EXTRACTED_FIELDS_IndRefNumber2: string;
        EXTRACTED_FIELDS_IndRefNumber3: string;
        EXTRACTED_FIELDS_IndRefNumber4: string;
        EXTRACTED_FIELDS_IndRefNumber5: string;
        EXTRACTED_FIELDS_Name1: string;
        EXTRACTED_FIELDS_Name2: string;
        EXTRACTED_FIELDS_Name3: string;
        EXTRACTED_FIELDS_Name4: string;
        EXTRACTED_FIELDS_Name5: string;
        EXTRACTED_FIELDS_RecipientName: string;
        EXTRACTED_FIELDS_RecipientName1: string;
        EXTRACTED_FIELDS_RecipientName2: string;
        EXTRACTED_FIELDS_RecipientName3: string;
        EXTRACTED_FIELDS_RecipientName4: string;
        EXTRACTED_FIELDS_RecipientAddressFull: string;
        EXTRACTED_FIELDS_Iban: string;
        EXTRACTED_FIELDS_AccountNumber: string;
        EXTRACTED_FIELDS_Issuer: string;
        EXTRACTED_FIELDS_RecipientAddressCity: string;
        EXTRACTED_FIELDS_RecipientAddressPostCode: string;
        EXTRACTED_FIELDS_Day: string;
        EXTRACTED_FIELDS_Month: string;
        EXTRACTED_FIELDS_Year: string;
        EXTRACTED_FIELDS_OptionalValue1: string;
        EXTRACTED_FIELDS_OptionalValue2: string;
        EXTRACTED_FIELDS_OptionalValue3: string;
        EXTRACTED_FIELDS_OptionalValue4: string;
        EXTRACTED_FIELDS_IssuingStateName: string;
        'EXTRACTED_FIELDS_Front Document Type ID': string;
        'EXTRACTED_FIELDS_Back Document Type ID': string;
        HASNOCAMERA_TITLE: string;
        HASNOCAMERA_DESCRIPTION: string;
      }
    | {
        REQUIRED_ACTION_KeepCapturing: string;
        REQUIRED_ACTION_StopCapturing: string;
        REQUIRED_ACTION_PauseCapturing: string;
        REQUIRED_ACTION_Close: string;
        REQUIRED_ACTION_Error: string;
        LIVENESS_ACTION_Smile: string;
        LIVENESS_ACTION_Frown: string;
        'LIVENESS_ACTION_Tilt Left': string;
        'LIVENESS_ACTION_Tilt Right': string;
        'LIVENESS_ACTION_Tilt Up': string;
        'LIVENESS_ACTION_Tilt Down': string;
        'LIVENESS_ACTION_Look Straight': string;
        'LIVENESS_ACTION_No Action': string;
        'LIVENESS_ACTION_Processing Liveness': string;
        'LIVENESS_RESULT_Thank you!.Failed': string;
        'LIVENESS_RESULT_Thank you!.Passed': string;
        'LIVENESS_RESULT_Thank you!.ActionTimedOut': string;
        'LIVENESS_RESULT_Thank you!.Interrupted': string;
        'LIVENESS_RESULT_Thank you!.Undefined': string;
        LIVENESS_ACTION_LOOK_STRAIGHT_TITLE: string;
        LIVENESS_ACTION_LOOK_STRAIGHT_TEXT: string;
        LIVENESS_ACTION_LOOK_LEFT_TITLE: string;
        LIVENESS_ACTION_LOOK_LEFT_TEXT: string;
        LIVENESS_ACTION_LOOK_RIGHT_TITLE: string;
        LIVENESS_ACTION_LOOK_RIGHT_TEXT: string;
        LIVENESS_ACTION_LOOK_UP_TITLE: string;
        LIVENESS_ACTION_LOOK_UP_TEXT: string;
        LIVENESS_ACTION_LOOK_DOWN_TITLE: string;
        LIVENESS_ACTION_LOOK_DOWN_TEXT: string;
        LIVENESS_ACTION_SMILE_TITLE: string;
        LIVENESS_ACTION_SMILE_TEXT: string;
        LIVENESS_ACTION_FROWN_TITLE: string;
        LIVENESS_ACTION_FROWN_TEXT: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CROPPED_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE_TITLE: string;
        PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED_TITLE: string;
        PASSIVE_LIVENESS_ERROR_UNKNOWN_TITLE: string;
        PASSIVE_LIVENESS_ERROR_INTERNAL_TITLE: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE: string;
        PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER: string;
        PASSIVE_LIVENESS_ERROR_FACE_CROPPED: string;
        PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND: string;
        PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL: string;
        PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE: string;
        PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES: string;
        PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED: string;
        PASSIVE_LIVENESS_ERROR_UNKNOWN: string;
        PASSIVE_LIVENESS_ERROR_INTERNAL: string;
        INITIALIZING_TITLE: string;
        INITIALIZING_DESCRIPTION: string;
        JOURNEY_STATE_STARTED: string;
        JOURNEY_STATE_INPROGRESS: string;
        JOURNEY_STATE_ENDED: string;
        INFO_JOURNEY_STATE: string;
        INFO_JOURNEY_ACTION: string;
        INFO_JOURNEY_ACTION_ATTEMPT: string;
        INFO_JOURNEY_ID: string;
        INFO_JOURNEY_RESULT: string;
        INFO_JOURNEY_REFERENCE: string;
        FLOW_STATE_NONE: string;
        'FLOW_STATE_IDENTITY:FRONT': string;
        'FLOW_STATE_IDENTITY:BACK': string;
        FLOW_STATE_ADDRESS: string;
        FLOW_STATE_SELFIE: string;
        FLOW_STATE_LIVENESS: string;
        FLOW_STATE_COVID: string;
        PROVIDER_TITLE_CAMERA: string;
        PROVIDER_TITLE_CROPPER: string;
        PROVIDER_TITLE_FILESYSTEM_ID: string;
        PROVIDER_TITLE_FILESYSTEM_FACEMATCH: string;
        PROVIDER_TITLE_FILESYSTEM_ADDRESS: string;
        PROVIDER_TITLE_FILESYSTEM_COVID: string;
        PROVIDER_TITLE_GATEWAY: string;
        PROVIDER_TITLE_LIVENESS: string;
        PROVIDER_TITLE_PASSIVE_LIVENESS: string;
        PROVIDER_TITLE_LOGIN: string;
        PROVIDER_TITLE_RESULTS: string;
        PROVIDER_TITLE_SCANNER: string;
        PROVIDER_TITLE_VIEW_ID: string;
        PROVIDER_TITLE_VIEW_FACEMATCH: string;
        PROVIDER_TITLE_VIEW_ADDRESS: string;
        PROVIDER_TITLE_VIEW_COVID: string;
        PROVIDER_SUBTITLE_FILESYSTEM_ID: string;
        PROVIDER_SUBTITLE_FILESYSTEM_FACEMATCH: string;
        PROVIDER_SUBTITLE_FILESYSTEM_ADDRESS: string;
        PROVIDER_SUBTITLE_FILESYSTEM_COVID: string;
        PROVIDER_SUBTITLE_SCANNER_ID: string;
        PROVIDER_SUBTITLE_VIEW_ID: string;
        PROVIDER_SUBTITLE_VIEW_FACEMATCH: string;
        PROVIDER_SUBTITLE_VIEW_ADDRESS: string;
        PROVIDER_SUBTITLE_VIEW_COVID: string;
        PROVIDER_TITLE_SMART_CAPTURE: string;
        PROVIDER_TITLE_JOURNEY_SELECT: string;
        FILESYSTEM_SUPPORTED_TYPES_START: string;
        FILESYSTEM_SUPPORTED_TYPES_END: string;
        FILESYSTEM_SUPPORTED_TYPES_START_SELFIE: string;
        FILESYSTEM_MAX_FILE_SIZE: string;
        FILESYSTEM_CHECK_FILE_TOO_BIG: string;
        FILESYSTEM_CHECK_FILE_INCORRECT_FORMAT: string;
        FILESYSTEM_IDENTITY_DOCUMENT: string;
        FILESYSTEM_FACEMATCH: string;
        FILESYSTEM_ADDRESS: string;
        FILESYSTEM_COVID: string;
        FILESYSTEM_DRAG_DROP: string;
        FILESYSTEM_OR: string;
        FILESYSTEM_CHOOSE: string;
        FILESYSTEM_UPLOADING: string;
        TRIPLESCAN_GUIDANCE_TRYAGAIN: string;
        FAILURE_REASON_NOT_SUPPORTED: string;
        FAILURE_REASON_REFER: string;
        FAILURE_REASON_EXPIRED: string;
        FAILURE_REASON_NOT_ACCEPTED: string;
        PLEASE_TRY_AGAIN_REFER: string;
        PLEASE_TRY_AGAIN_EXPIRED: string;
        PLEASE_TRY_AGAIN_NOT_ACCEPTED: string;
        PLEASE_TRY_AGAIN_NOT_SUPPORTED: string;
        BLUR_CHECK_REASON: string;
        GLARE_CHECK_REASON: string;
        RESOLUTION_CHECK_REASON: string;
        EDGES_CHECK_REASON: string;
        VALIDATION_FAILED: string;
        VALIDATION_FAILED_REASON_DOC_UNKNOWN: string;
        VALIDATION_FAILED_REASON_DOC_NOT_ACCEPTED: string;
        VALIDATION_FAILED_REASON_DOC_EXPIRED: string;
        PREVIEW_INFO_TITLE_ID: string;
        PREVIEW_INFO_GOOD: string;
        PREVIEW_INFO_BAD: string;
        PREVIEW_INFO_GOOD_EXAMPLE_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_ID: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_ID: string;
        PREVIEW_INFO_TITLE_FACEMATCH: string;
        PREVIEW_INFO_GOOD_EXAMPLE_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_FACEMATCH: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_FACEMATCH: string;
        PREVIEW_INFO_TITLE_ADDRESS: string;
        PREVIEW_INFO_GOOD_EXAMPLE_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_ADDRESS: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_ADDRESS: string;
        PREVIEW_INFO_TITLE_COVID: string;
        PREVIEW_INFO_GOOD_EXAMPLE_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_ANGLE_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_COVER_COVID: string;
        PREVIEW_INFO_BAD_EXAMPLE_BLUR_COVID: string;
        PREVIEW_ATTEMPT_NUMBER_START: string;
        PREVIEW_ATTEMPT_NUMBER_END: string;
        CAMERA_CAPTURE: string;
        CAMERA_CAPTURE_START_BUTTON: string;
        CAMERA_CAPTURE_CAPTION: string;
        CAMERA_PREVIEW_START: string;
        CAMERA_CONDITION_BLUR: string;
        CAMERA_CONDITION_CAPTURING: string;
        CAMERA_CONDITION_UPLOADING: string;
        CAMERA_CONDITION_ALIGNMENT: string;
        CAMERA_CONDITION_GLARE: string;
        VERIFYING_TITLE: string;
        PREPARING_PREVIEW_TITLE: string;
        CAMERA_CONDITION_LOW_RESOLUTION: string;
        CAMERA_PREVENT_GLARE_HINT: string;
        CAMERA_PREVENT_BLUR_HINT: string;
        CAMERA_PREVENT_LOW_RES_HINT: string;
        CAMERA_SMARTCAPTURE_ON: string;
        CAMERA_SMARTCAPTURE_OFF: string;
        CAMERA_CAPTURE_FRONT: string;
        CAMERA_MANUAL_CAPTURE_FRONT: string;
        CAMERA_CAPTURE_BACK: string;
        CAMERA_CAPTURE_SELFIE_CAPTION: string;
        CAMERA_CAPTURE_ADDRESS_CAPTION: string;
        CAMERA_CAPTURE_COVID_CAPTION: string;
        CAMERA_LOADING: string;
        CROPPER_RETRY: string;
        CROPPER_UPLOAD: string;
        CROPPER_UPLOADING: string;
        FILESYSTEM_SELECT: string;
        FILESYSTEM_DROP_IMAGE: string;
        GATEWAY_CAMERA: string;
        GATEWAY_CANCEL: string;
        LIVENESS_START: string;
        PASSIVE_LIVENESS_START: string;
        LOGIN_USERNAME: string;
        LOGIN_PASSWORD: string;
        LOGIN_SUBMIT: string;
        RESULTS_DOCUMENTS: string;
        RESULTS_DOCUMENTS_NONE: string;
        RESULTS_DOCUMENT_TYPE: string;
        RESULTS_DOCUMENT_RESULT: string;
        RESULTS_EXTRACTED_FIELDS_NONE: string;
        RESULTS_DETAILS: string;
        RESULTS_DETAILS_NONE: string;
        RESULTS_NEW_JOURNEY: string;
        RESULTS_NO_INFORMATION: string;
        RESULTS_LOGOUT: string;
        RESULTS_HIGH_LEVEL_Aborted: string;
        RESULTS_HIGH_LEVEL_Expired: string;
        RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE: string;
        RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE_VALUE: string;
        RESULTS_HIGH_LEVEL_NotAccepted: string;
        RESULTS_HIGH_LEVEL_NotSupported: string;
        RESULTS_HIGH_LEVEL_Notsupported: string;
        RESULTS_HIGH_LEVEL_Passed: string;
        RESULTS_HIGH_LEVEL_Refer: string;
        RESULTS_HIGH_LEVEL_Undefined: string;
        RESULTS_HIGH_LEVEL_DETAIL_ACCUMULATIVELIVENESSRESULT: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTFRONTSIDETYPECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDETYPECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDECHECK: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBLOCKINGPOLICY: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTOVERALLVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTEXPIRY: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTSUPPORT: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTPROOFPOLICY: string;
        RESULTS_HIGH_LEVEL_DETAIL_FACEMATCHVALIDATION: string;
        RESULTS_HIGH_LEVEL_DETAIL_UNDERAGERULE: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_SUCCESSNEEDED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_FAILED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_NOTNEEDED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_PASSED: string;
        RESULTS_HIGH_LEVEL_DETAIL_VALUE_SKIPPED: string;
        RESULTS_HIGH_LEVEL_DETAIL_COVIDPASSCROSSCHECKRESULT: string;
        VIEW_RETRY: string;
        VIEW_CROP: string;
        VIEW_CROPPING: string;
        VIEW_UPLOAD: string;
        VIEW_UPLOADING: string;
        SMART_CAPTURE_INITIALIZING: string;
        SMART_CAPTURE_START: string;
        SCANNER_DESC_AVAILABLE: string;
        SCANNER_DESC_PROCESSING: string;
        SCANNER_DESC_SCANNING: string;
        SCANNER_DESC_DISCONNECTED: string;
        SCANNER_DESC_NOT_CONNECTED: string;
        SCANNER_DESC_OFFLINE: string;
        SCANNER_DESC_BUSY: string;
        SCANNER_DESC_WAITING: string;
        SCANNER_DESC_LOADING: string;
        SCANNER_TITLE_AVAILABLE: string;
        SCANNER_TITLE_PROCESSING: string;
        SCANNER_TITLE_SCANNING: string;
        SCANNER_TITLE_DISCONNECTED: string;
        SCANNER_TITLE_NOT_CONNECTED: string;
        SCANNER_TITLE_OFFLINE: string;
        SCANNER_TITLE_BUSY: string;
        SCANNER_TITLE_WAITING: string;
        SCANNER_ACTION_REGISTER: string;
        SCANNER_ACTION_RELEASE: string;
        CANCEL_JOURNEY: string;
        MANUAL_PHOTO_UPLOAD_TOGGLE_FALSE: string;
        MANUAL_PHOTO_UPLOAD_TOGGLE_TRUE: string;
        JOURNEY_SELECT_CONTINUE: string;
        HELP_MODAL_AUTOCAPTURE_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_TIPS: string;
        HELP_MODAL_AUTOCAPTURE_GLARE_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_GLARE_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_FAR_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_FAR_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_BLUR_TITLE: string;
        HELP_MODAL_AUTOCAPTURE_BLUR_SUBTITLE: string;
        HELP_MODAL_AUTOCAPTURE_MANUAL_CAPTURE: string;
        HELP_MODAL_AUTOCAPTURE_TURN_MANUAL_CAPTURE: string;
        HELP_MODAL_SELFIE_TITLE: string;
        HELP_MODAL_SELFIE_SUBTITLE: string;
        HELP_MODAL_POA_TITLE: string;
        HELP_MODAL_POA_SUBTITLE: string;
        HELP_MODAL_POA_TIPS: string;
        HELP_MODAL_POA_GLARE_TITLE: string;
        HELP_MODAL_POA_GLARE_SUBTITLE: string;
        HELP_MODAL_POA_FAR_TITLE: string;
        HELP_MODAL_POA_FAR_SUBTITLE: string;
        HELP_MODAL_POA_BLUR_TITLE: string;
        HELP_MODAL_POA_BLUR_SUBTITLE: string;
        HELP_MODAL_POA_MANUAL_CAPTURE: string;
        HELP_MODAL_POA_TURN_MANUAL_CAPTURE: string;
        HELP_MODAL_NEED_HELP: string;
        EXCEPTION: string;
        EXCEPTION_AUTHORIZATION: string;
        EXCEPTION_AUTHORIZATION_ACCOUNT_NOT_AUTHORIZED: string;
        EXCEPTION_AUTHORIZATION_AUTH_DETAILS_INVALID: string;
        EXCEPTION_AUTHORIZATION_AUTH_NOT_ENABLED: string;
        EXCEPTION_AUTHORIZATION_PROCESS_NOT_AUTHORIZED: string;
        EXCEPTION_BAD_REQUEST: string;
        EXCEPTION_BAD_REQUEST_INVALID_IMAGE: string;
        EXCEPTION_BAD_REQUEST_WAITING_FOR_RESPONSE: string;
        EXCEPTION_FLOW_STATE_JOURNEY_ENDED: string;
        EXCEPTION_FLOW_STATE_MISSING: string;
        EXCEPTION_INVALID_PARAMETER_CALLBACK_MUST_BE_FUNCTION: string;
        EXCEPTION_INVALID_PARAMETER_NAME_MUST_BE_STRING: string;
        EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_NUMBER: string;
        EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_POSITIVE_NUMBER: string;
        EXCEPTION_INVALID_PARAMETER_SHOULD_BE_ELEMENT_OR_SELECTOR: string;
        EXCEPTION_INVALID_PARAMETER_VALUE_NOT_VALID: string;
        EXCEPTION_INVALID_PARAMETER_VALUE_DAMAGED: string;
        EXCEPTION_MISSING_PARAMETER_BACKEND_URL_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_COORDINATES_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_IMAGES_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_PASSWORD_MISSING: string;
        EXCEPTION_MISSING_PARAMETER_USERNAME_MISSING: string;
        EXCEPTION_JOURNEY_DEFINITIONS_MISSING: string;
        EXCEPTION_NETWORK: string;
        EXCEPTION_PLATFORM_BROWSER_ONLY: string;
        EXCEPTION_PLATFORM_UNSUPPORTED: string;
        EXCEPTION_PLATFORM_CAMERA_PERMISSION_DENIED: string;
        EXCEPTION_PLATFORM_CAMERA_PERMISSION_UNAVAILABLE: string;
        EXCEPTION_PLATFORM_CAMERA_NOT_READABLE: string;
        EXCEPTION_PLATFORM_CAMERA_NONE_SUITABLE: string;
        EXCEPTION_SERVER: string;
        EXCEPTION_SERVER_UNREACHABLE: string;
        EXCEPTION_SERVER_DATA_NOT_PERSISTED: string;
        EXCEPTION_SERVER_RESULT_NOT_PASSING: string;
        EXCEPTION_TEMPLATE_CANVAS_CONTEXT_UNAVAILABLE: string;
        EXCEPTION_TEMPLATE_CONTAINER_MISSING: string;
        EXCEPTION_TEMPLATE_ELEMENTS_MISSING: string;
        EXCEPTION_TEMPLATE_MISSING: string;
        EXCEPTION_TEMPLATE_SOURCE_ELEMENT_MISSING: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_CANNOT_RETRIEVE: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NONE_SPECIFIED: string;
        EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NOT_AVAILABLE: string;
        'SUPPORTED_DOCUMENT_Account Statement': string;
        'SUPPORTED_DOCUMENT_Agreement (Tenancy)': string;
        'SUPPORTED_DOCUMENT_Bank Document': string;
        'SUPPORTED_DOCUMENT_Bank Letter': string;
        'SUPPORTED_DOCUMENT_Bank Statement': string;
        'SUPPORTED_DOCUMENT_Benefit Letter': string;
        'SUPPORTED_DOCUMENT_Certificate (Birth, Marriage, Civil partnership)': string;
        'SUPPORTED_DOCUMENT_Council Document': string;
        'SUPPORTED_DOCUMENT_Council Letter': string;
        'SUPPORTED_DOCUMENT_Council Tax': string;
        'SUPPORTED_DOCUMENT_Driving License': string;
        'SUPPORTED_DOCUMENT_Driving Licence': string;
        'SUPPORTED_DOCUMENT_DWP Document': string;
        'SUPPORTED_DOCUMENT_HMRC Document': string;
        'SUPPORTED_DOCUMENT_Information Sheet': string;
        'SUPPORTED_DOCUMENT_Insurance Document': string;
        'SUPPORTED_DOCUMENT_Insurance Letter': string;
        SUPPORTED_DOCUMENT_Invoice: string;
        'SUPPORTED_DOCUMENT_NIC Letter': string;
        'SUPPORTED_DOCUMENT_NINO Letter': string;
        'SUPPORTED_DOCUMENT_Official Document': string;
        'SUPPORTED_DOCUMENT_Official Letter': string;
        'SUPPORTED_DOCUMENT_Repayment Letter (related to Tax or Social support)': string;
        'SUPPORTED_DOCUMENT_Tax Letter': string;
        'SUPPORTED_DOCUMENT_Tax Statement': string;
        'SUPPORTED_DOCUMENT_Tel Bill': string;
        'SUPPORTED_DOCUMENT_Tel Letter': string;
        'SUPPORTED_DOCUMENT_Telecommunication Document': string;
        'SUPPORTED_DOCUMENT_TV Licence': string;
        'SUPPORTED_DOCUMENT_University Letter': string;
        'SUPPORTED_DOCUMENT_Utility Bill': string;
        'SUPPORTED_DOCUMENT_Utility Document': string;
        'SUPPORTED_DOCUMENT_Utility Letter': string;
        'SUPPORTED_DOCUMENT_Water Bil': string;
        'SUPPORTED_DOCUMENT_Water Document': string;
        'SUPPORTED_DOCUMENT_Agents License': string;
        'SUPPORTED_DOCUMENT_Electoral Card': string;
        'SUPPORTED_DOCUMENT_Foreigner Identification Card': string;
        'SUPPORTED_DOCUMENT_Health Card': string;
        'SUPPORTED_DOCUMENT_Job License ': string;
        'SUPPORTED_DOCUMENT_Membership Identification Card': string;
        'SUPPORTED_DOCUMENT_Military Identification Card': string;
        'SUPPORTED_DOCUMENT_National Identification Card': string;
        SUPPORTED_DOCUMENT_Passport: string;
        'SUPPORTED_DOCUMENT_Travel Permit': string;
        SUPPORTED_DOCUMENT_Visa: string;
        'SUPPORTED_DOCUMENT_Weapons Licence': string;
        'SUPPORTED_DOCUMENT_Selfie Photo': string;
        SUPPORTED_DOCUMENT_Unknown: string;
        SUPPORTED_DOCUMENT_CovidPass: string;
        EXTRACTED_FIELDS_AddressFull: string;
        EXTRACTED_FIELDS_AddressCity: string;
        EXTRACTED_FIELDS_AddressPostCode: string;
        EXTRACTED_FIELDS_LastNameFirstPart: string;
        EXTRACTED_FIELDS_Sex: string;
        EXTRACTED_FIELDS_BirthPlace: string;
        EXTRACTED_FIELDS_IssueNumber: string;
        EXTRACTED_FIELDS_DocumentNumberCheckDigit: string;
        EXTRACTED_FIELDS_BirthDate: string;
        EXTRACTED_FIELDS_DocumentNumber: string;
        EXTRACTED_FIELDS_COVIDPASSCROSSCHECKRESULT: string;
        EXTRACTED_FIELDS_FirstName: string;
        EXTRACTED_FIELDS_ArbitraryDigit: string;
        EXTRACTED_FIELDS_FirstNameInitial: string;
        EXTRACTED_FIELDS_ExpiryDate: string;
        EXTRACTED_FIELDS_IssueDate: string;
        EXTRACTED_FIELDS_LastName: string;
        EXTRACTED_FIELDS_LicenseCategory: string;
        EXTRACTED_FIELDS_DocumentCategory: string;
        EXTRACTED_FIELDS_DocumentType: string;
        EXTRACTED_FIELDS_NationalityCode: string;
        EXTRACTED_FIELDS_MiddleName: string;
        EXTRACTED_FIELDS_FirstIssuanceDate: string;
        EXTRACTED_FIELDS_SecondLastName: string;
        EXTRACTED_FIELDS_FullName: string;
        EXTRACTED_FIELDS_PersonalNumber: string;
        EXTRACTED_FIELDS_NationalityName: string;
        EXTRACTED_FIELDS_BarcodeItems: string;
        EXTRACTED_FIELDS_BirthPlaceCity: string;
        EXTRACTED_FIELDS_BirthPlaceState: string;
        EXTRACTED_FIELDS_BirthPlaceCountry: string;
        EXTRACTED_FIELDS_MRZFull: string;
        EXTRACTED_FIELDS_MRZLine1: string;
        EXTRACTED_FIELDS_MRZLine2: string;
        EXTRACTED_FIELDS_MRZLine3: string;
        EXTRACTED_FIELDS_ObservationPage: string;
        EXTRACTED_FIELDS_IssuingAuthority: string;
        EXTRACTED_FIELDS_IssuingLocation: string;
        EXTRACTED_FIELDS_MaritalStatus: string;
        EXTRACTED_FIELDS_Occupation: string;
        EXTRACTED_FIELDS_AlienNumber: string;
        EXTRACTED_FIELDS_Employer: string;
        EXTRACTED_FIELDS_AddressLine1: string;
        EXTRACTED_FIELDS_AddressLine2: string;
        EXTRACTED_FIELDS_AddressLine3: string;
        EXTRACTED_FIELDS_AddressLine4: string;
        EXTRACTED_FIELDS_AddressState: string;
        EXTRACTED_FIELDS_AddressDistrict: string;
        EXTRACTED_FIELDS_AddressBuildingNumber: string;
        EXTRACTED_FIELDS_AddressBuildingName: string;
        EXTRACTED_FIELDS_AddressStreet: string;
        EXTRACTED_FIELDS_AddressCountry: string;
        EXTRACTED_FIELDS_RefAddressFull: string;
        EXTRACTED_FIELDS_RefAddressLine1: string;
        EXTRACTED_FIELDS_RefAddressLine2: string;
        EXTRACTED_FIELDS_RefAddressLine3: string;
        EXTRACTED_FIELDS_RefAddressLine4: string;
        EXTRACTED_FIELDS_RefAddressCity: string;
        EXTRACTED_FIELDS_RefAddressState: string;
        EXTRACTED_FIELDS_RefAddressDistrict: string;
        EXTRACTED_FIELDS_RefAddressBuildingNumber: string;
        EXTRACTED_FIELDS_RefAddressBuildingName: string;
        EXTRACTED_FIELDS_RefAddressSubBuildingName: string;
        EXTRACTED_FIELDS_RefAddressStreet: string;
        EXTRACTED_FIELDS_RefAddressCountry: string;
        EXTRACTED_FIELDS_RefAddressPostCode: string;
        EXTRACTED_FIELDS_HealthNumber: string;
        EXTRACTED_FIELDS_Endorsements: string;
        EXTRACTED_FIELDS_Constraints: string;
        EXTRACTED_FIELDS_LicenseMarine: string;
        EXTRACTED_FIELDS_Height: string;
        EXTRACTED_FIELDS_Weight: string;
        EXTRACTED_FIELDS_HairColor: string;
        EXTRACTED_FIELDS_EyeColor: string;
        EXTRACTED_FIELDS_LensData: string;
        EXTRACTED_FIELDS_SocialSecurityNumber: string;
        EXTRACTED_FIELDS_NationalInsuranceNumber: string;
        EXTRACTED_FIELDS_Race: string;
        EXTRACTED_FIELDS_MotherName: string;
        EXTRACTED_FIELDS_FatherName: string;
        EXTRACTED_FIELDS_Parents: string;
        EXTRACTED_FIELDS_Remarks: string;
        EXTRACTED_FIELDS_DistinguishingMarks: string;
        EXTRACTED_FIELDS_PeriodOfStay: string;
        EXTRACTED_FIELDS_TaxNumber: string;
        EXTRACTED_FIELDS_Donor: string;
        EXTRACTED_FIELDS_RFIDG1: string;
        EXTRACTED_FIELDS_RFIDG2: string;
        EXTRACTED_FIELDS_RFIDG3: string;
        EXTRACTED_FIELDS_RFIDG15: string;
        EXTRACTED_FIELDS_RFIDSOD: string;
        EXTRACTED_FIELDS_PortraitPhoto: string;
        EXTRACTED_FIELDS_Title: string;
        EXTRACTED_FIELDS_IssueDate2: string;
        EXTRACTED_FIELDS_ExpiryDate2: string;
        EXTRACTED_FIELDS_LicenseCategory2: string;
        EXTRACTED_FIELDS_IssueDate3: string;
        EXTRACTED_FIELDS_ExpiryDate3: string;
        EXTRACTED_FIELDS_LicenseCategory3: string;
        EXTRACTED_FIELDS_IssueDate4: string;
        EXTRACTED_FIELDS_ExpiryDate4: string;
        EXTRACTED_FIELDS_LicenseCategory4: string;
        EXTRACTED_FIELDS_MRZCode1: string;
        EXTRACTED_FIELDS_MRZCode2: string;
        EXTRACTED_FIELDS_MRZStandardType: string;
        EXTRACTED_FIELDS_AddressStreetSuffix: string;
        EXTRACTED_FIELDS_AddressStreetType: string;
        EXTRACTED_FIELDS_AddressUnitNumber: string;
        EXTRACTED_FIELDS_LicenseNumber: string;
        EXTRACTED_FIELDS_AddressStateCode: string;
        EXTRACTED_FIELDS_AddressStreetTypeAbbreviation: string;
        EXTRACTED_FIELDS_AddressUnitType: string;
        EXTRACTED_FIELDS_AddressDeliveryPointIdentifier: string;
        EXTRACTED_FIELDS_AgeCategory: string;
        EXTRACTED_FIELDS_ChildernCount: string;
        EXTRACTED_FIELDS_EntryMode: string;
        EXTRACTED_FIELDS_VAFNumber: string;
        EXTRACTED_FIELDS_AddressLine5: string;
        EXTRACTED_FIELDS_RFIDPortraitPhoto: string;
        EXTRACTED_FIELDS_RefAddressLine5: string;
        EXTRACTED_FIELDS_RefAddressStateCode: string;
        EXTRACTED_FIELDS_RefAddressStreetType: string;
        EXTRACTED_FIELDS_RefAddressStreetTypeAbbreviation: string;
        EXTRACTED_FIELDS_RefAddressStreetSuffix: string;
        EXTRACTED_FIELDS_RefAddressUnitNumber: string;
        EXTRACTED_FIELDS_RefAddressUnitType: string;
        EXTRACTED_FIELDS_RefAddressPostcodeType: string;
        EXTRACTED_FIELDS_RefAddressDeliveryPointIdentifier: string;
        EXTRACTED_FIELDS_RefAddressPOBoxNumber: string;
        EXTRACTED_FIELDS_RefAddressDependentLocality: string;
        EXTRACTED_FIELDS_RefAddressDoubleDependentLocality: string;
        EXTRACTED_FIELDS_RefAddressThoroughfare: string;
        EXTRACTED_FIELDS_RefAddressThoroughfareDesc: string;
        EXTRACTED_FIELDS_RefAddressDependentThoroughfare: string;
        EXTRACTED_FIELDS_RefAddressDependentThoroughfareDesc: string;
        EXTRACTED_FIELDS_RefAddressSubBuildingNumber: string;
        EXTRACTED_FIELDS_AddressSubBuildingNumber: string;
        EXTRACTED_FIELDS_AddressSubBuildingName: string;
        EXTRACTED_FIELDS_AddressPostCodeType: string;
        EXTRACTED_FIELDS_IssuingAuthorityType: string;
        EXTRACTED_FIELDS_Signature: string;
        EXTRACTED_FIELDS_Hologram: string;
        EXTRACTED_FIELDS_CardNumber: string;
        EXTRACTED_FIELDS_MiddleNameInitial: string;
        EXTRACTED_FIELDS_PermitNumber: string;
        EXTRACTED_FIELDS_ReferenceNumber: string;
        EXTRACTED_FIELDS_CustomerNumber: string;
        EXTRACTED_FIELDS_BOSNumber: string;
        EXTRACTED_FIELDS_StudentID: string;
        EXTRACTED_FIELDS_MembershipNumber: string;
        EXTRACTED_FIELDS_LicenseType: string;
        EXTRACTED_FIELDS_LicenseType2: string;
        EXTRACTED_FIELDS_LicenseType3: string;
        EXTRACTED_FIELDS_LicenseType4: string;
        EXTRACTED_FIELDS_DocumentTypeCode: string;
        EXTRACTED_FIELDS_MRZDocumentNumberCheckDigit: string;
        EXTRACTED_FIELDS_MRZBirthDateCheckDigit: string;
        EXTRACTED_FIELDS_MRZExpiryDateCheckDigit: string;
        EXTRACTED_FIELDS_MRZPersonalNumberCheckDigit: string;
        EXTRACTED_FIELDS_MRZCompositeCheckDigit: string;
        EXTRACTED_FIELDS_SecondaryPortraitPhoto: string;
        EXTRACTED_FIELDS_Fingerprint: string;
        EXTRACTED_FIELDS_VersionNumber: string;
        EXTRACTED_FIELDS_Conditions: string;
        EXTRACTED_FIELDS_NickName: string;
        EXTRACTED_FIELDS_AddressApartmentNumber: string;
        EXTRACTED_FIELDS_AddressFloorNumber: string;
        EXTRACTED_FIELDS_FirstNameLocal: string;
        EXTRACTED_FIELDS_LastNameLocal: string;
        EXTRACTED_FIELDS_FullNameLocal: string;
        EXTRACTED_FIELDS_BirthPlaceLocal: string;
        EXTRACTED_FIELDS_IssuingAuthorityLocal: string;
        EXTRACTED_FIELDS_MotherNameLocal: string;
        EXTRACTED_FIELDS_FatherNameLocal: string;
        EXTRACTED_FIELDS_AddressFullLocal: string;
        EXTRACTED_FIELDS_MiddleNameLocal: string;
        EXTRACTED_FIELDS_AddressLine1Local: string;
        EXTRACTED_FIELDS_AddressLine2Local: string;
        EXTRACTED_FIELDS_AddressLine3Local: string;
        EXTRACTED_FIELDS_IndRefNumber1: string;
        EXTRACTED_FIELDS_IndRefNumber2: string;
        EXTRACTED_FIELDS_IndRefNumber3: string;
        EXTRACTED_FIELDS_IndRefNumber4: string;
        EXTRACTED_FIELDS_IndRefNumber5: string;
        EXTRACTED_FIELDS_Name1: string;
        EXTRACTED_FIELDS_Name2: string;
        EXTRACTED_FIELDS_Name3: string;
        EXTRACTED_FIELDS_Name4: string;
        EXTRACTED_FIELDS_Name5: string;
        EXTRACTED_FIELDS_RecipientName: string;
        EXTRACTED_FIELDS_RecipientName1: string;
        EXTRACTED_FIELDS_RecipientName2: string;
        EXTRACTED_FIELDS_RecipientName3: string;
        EXTRACTED_FIELDS_RecipientName4: string;
        EXTRACTED_FIELDS_RecipientAddressFull: string;
        EXTRACTED_FIELDS_Iban: string;
        EXTRACTED_FIELDS_AccountNumber: string;
        EXTRACTED_FIELDS_Issuer: string;
        EXTRACTED_FIELDS_RecipientAddressCity: string;
        EXTRACTED_FIELDS_RecipientAddressPostCode: string;
        EXTRACTED_FIELDS_Day: string;
        EXTRACTED_FIELDS_Month: string;
        EXTRACTED_FIELDS_Year: string;
        EXTRACTED_FIELDS_OptionalValue1: string;
        EXTRACTED_FIELDS_OptionalValue2: string;
        EXTRACTED_FIELDS_OptionalValue3: string;
        EXTRACTED_FIELDS_OptionalValue4: string;
        EXTRACTED_FIELDS_IssuingStateName: string;
        'EXTRACTED_FIELDS_Front Document Type ID': string;
        'EXTRACTED_FIELDS_Back Document Type ID': string;
        HASNOCAMERA_TITLE: string;
        HASNOCAMERA_DESCRIPTION: string;
      };
  getTranslation: (key: TranslationKey, props?: Record<string, any>) => string;
  private defaultTranslator;
}

export declare enum Mode {
  /**
   * Using Web mode - request will behave as it is coming from Web Channel
   */
  WEB = 'WEB',
  /**
   * Using Capture Studio mode - request will behave as it is coming from Capture Studio Channel
   */
  CAPTURESTUDIO = 'CAPTURESTUDIO',
}

/**
 * List of supported non-ID document type
 *
 * @public
 */
declare enum NonIdDocuments {
  AccountStatement = 'Account Statement',
  AgreementTenancy = 'Agreement (Tenancy)',
  BankDocument = 'Bank Document',
  BankLetter = 'Bank Letter',
  BankStatement = 'Bank Statement',
  BenefitLetter = 'Benefit Letter',
  Certificate = 'Certificate (Birth, Marriage, Civil partnership)',
  CouncilDocument = 'Council Document',
  CouncilLetter = 'Council Letter',
  CouncilTax = 'Council Tax',
  DrivingLicence = 'Driving Licence',
  DwpDocument = 'DWP Document',
  HmrcDocument = 'HMRC Document',
  InformationSheet = 'Information Sheet',
  InsuranceDocument = 'Insurance Document',
  InsuranceLetter = 'Insurance Letter',
  Invoice = 'Invoice',
  NicLetter = 'NIC Letter',
  NinoLetter = 'NINO Letter',
  OfficialDocument = 'Official Document',
  OfficialLetter = 'Official Letter',
  Repayment = 'Repayment Letter (related to Tax or Social support)',
  TaxLetter = 'Tax Letter',
  TaxStatement = 'Tax Statement',
  TelBill = 'Tel Bill',
  TelLetter = 'Tel Letter',
  TelecommunicationDocument = 'Telecommunication Document',
  TvLicence = 'TV Licence',
  UniversityLetter = 'University Letter',
  UtilityBill = 'Utility Bill',
  UtilityDocument = 'Utility Document',
  UtilityLetter = 'Utility Letter',
  WaterBill = 'Water Bil',
  WaterDocument = 'Water Document',
}

/**
 * The pro-processor to run the template string through before writing it to the
 * DOM. Please check the integration documents or the `Templates` documentation
 * for information on which properties will be passed in for processors to use,
 * and guidelines for defining templates. All pre-processors will be provided
 * with the same data unless otherwise stated.
 *
 * @public
 */
export declare enum PreProcessor {
  /**
   * Don't perform any pre-processing on the template string before writing it
   * to the DOM.
   */
  None = 'none',
  /**
   * Run the template string through the mustache HTML pre-processor before
   * writing it to the DOM. Find out more information about Mustache templates
   * here: https://github.com/janl/mustache.js.
   */
  Mustache = 'mustache',
}

/**
 * The currently required action
 *
 * @public
 */
export declare enum RequiredAction {
  /**
   * An address document is required. Currently capturing for the first time.
   */
  ADDRESSDOCUMENT_FIRST_SCAN = 'ADDRESSDOCUMENT',
  /**
   * An address document is required. Currently capturing for the second time.
   */
  ADDRESSDOCUMENT_SECOND_SCAN = 'ADDRESSDOCUMENT:SECONDSCAN',
  /**
   * An address document is required. Currently capturing for the third time.
   */
  ADDRESSDOCUMENT_THIRD_SCAN = 'ADDRESSDOCUMENT:THIRDSCAN',
  /**
   * The back side of an identity document is required. Currently capturing
   * for the first time.
   */
  BACKSIDE_FIRST_SCAN = 'BACKSIDE',
  /**
   * The back side of an identity document is required. Currently capturing
   * for the second time.
   */
  BACKSIDE_SECOND_SCAN = 'BACKSIDE:SECONDSCAN',
  /**
   * The back side of an identity document is required. Currently capturing
   * for the third time.
   */
  BACKSIDE_THIRD_SCAN = 'BACKSIDE:THIRDSCAN',
  /**
   * A self portrait image is required. Currently capturing for the first
   * time.
   */
  SELFIE_FIRST_SCAN = 'SELFIE',
  /**
   * A self portrait image is required. Currently capturing for the second
   * time.
   */
  SELFIE_SECOND_SCAN = 'SELFIE:SECONDSCAN',
  /**
   * A self portrait image is required. Currently capturing for the third
   * time.
   */
  SELFIE_THIRD_SCAN = 'SELFIE:THIRDSCAN',
  /**
   * The front side of an identity document is required. Currently capturing
   * for the first time.
   */
  FRONTSIDE_FIRST_SCAN = 'FRONTSIDE',
  /**
   * The front side of an identity document is required. Currently capturing
   * for the second time.
   */
  FRONTSIDE_SECOND_SCAN = 'FRONTSIDE:SECONDSCAN',
  /**
   * The front side of an identity document is required. Currently capturing
   * for the third time.
   */
  FRONTSIDE_THIRD_SCAN = 'FRONTSIDE:THIRDSCAN',
  /**
   * A liveness capture is required.
   */
  LIVENESS = 'LIVENESS',
  /**
   * Passive liveness capture is required.
   */
  PASSIVE_LIVENESS = 'PASSIVE_LIVENESS',
  /**
   * There is currently no required action.
   */
  /**
   * A covid document is required. Currently capturing for the first time.
   */
  COVIDPASS_FIRST_SCAN = 'COVIDPASS',
  /**
   * A covid document is required. Currently capturing for the second time.
   */
  COVIDPASS_SECOND_SCAN = 'COVIDPASS_SECOND_SCAN:SECONDSCAN',
  /**
   * A covid document is required. Currently capturing for the third time.
   */
  COVIDPASS_THIRD_SCAN = 'COVIDPASS_THIRD_SCAN:THIRDSCAN',
  NONE = 'NONE',
}

/**
 * The type of the response form the server
 *
 * @public
 */
declare enum ResponseType {
  /**
   * Raw text which needs formatting before parsing
   */
  RAW = 'RAW',
  /**
   * Refined content which can be parsed without reformatting
   */
  REFINED = 'REFINED',
}

/**
 * @public
 */
export declare enum ReticleType {
  NONE = 'NONE',
  DOCUMENT = 'DOCUMENT',
  PORTRAIT = 'PORTRAIT',
}

/**
 * The error state of the scanner.
 *
 * @public
 */
export declare enum ScannerError {
  /**
   * The scanner is currently locked for use by another agent.
   */
  IS_LOCKED = 'ScannerIsLocked',
  /**
   * The scanner is currently offline. Check the network connection between
   * the scanner client and the service, and that the printer is powered on
   * and connected to the host machine.
   */
  IS_OFFLINE = 'ScannerOffline',
  /**
   * The scanner was released by the service and is no longer available for
   * use.
   */
  IS_RELEASED = 'ScannerIsReleased',
}

/**
 * The current state of the scanner.
 *
 * @public
 */
export declare enum ScannerState {
  /**
   * The scanner service is currently busy. It may currently be in use by
   * another agent. If this state persists check the scanner service.
   */
  BUSY = 'SOURCE:BUSY',
  /**
   * The scanner service is connected and ready. You should now be able to
   * register the scanner for this instance.
   */
  CONNECTED = 'SOURCE:CONNECTED',
  /**
   * The scanner service is currently disconnected.
   */
  DISCONNECTED = 'SOURCE:DISCONNECTED',
}

/**
 * The current stage of the scanning process.
 *
 * @public
 */
export declare enum ScanProcess {
  /**
   * The scanner is not currently engaged.
   */
  EMPTY = 'EMPTY',
  /**
   * The scanner service is processing an uploaded document.
   */
  PROCESSING = 'PROCESSING',
  /**
   * The scanner is currently capturing a document.
   */
  SCANNING = 'SCANNING',
}

/**
 * The set of templates which can be overridden. Any templates which are not
 * overridden will fall back to the defaults. Take care to follow the
 * integration guide when overriding templates.
 *
 * @public
 */
export declare type TemplateDictionary = Partial<Record<Templates, ITemplateConfiguration>>;

/**
 * @public
 */
export declare type TemplateFunction = (page: string) => string;

/**
 * Possible templates which can be specified. For suggested template
 * modifications, default values and template flow, please consult the
 * integration documentation.
 *
 * @public
 */
export declare enum Templates {
  /**
   * This will be displayed when there is nothing currently being shown by the
   * instance of the SDK. An example of this would be when the SDK is loading
   * data from the server prior to the authentication checks.
   */
  None = 'none',
  /**
   * This will be displayed whilst the SDK is initialising and will be
   * overwritten by the first provider when initialised.
   */
  Initializing = 'initializing',
  /**
   * This will be displayed when the customer has elected to use the camera
   * for document capture rather than a file upload.
   */
  Camera = 'camera',
  /**
   * This will be displayed when the customer has elected to use the cropping
   * functionality offered by the SDK. The customer will be able to select
   * "Crop" to submit the cropped file, or "Cancel" to return to the capture
   * screen.
   */
  Cropper = 'cropper',
  /**
   * This will be displayed when the customer has elected to use the browser's
   * default media picker to select a document. The customer will be able to
   * either use the media picker, or drop a file onto the specified area to
   * continue.
   */
  Filesystem = 'filesystem',
  /**
   * This will be displayed when the customer has started the journey and is
   * at the front or rear document capture stage, and not using the
   * SmartCapture document capture provider.
   */
  Gateway = 'gateway',
  /**
   * This will be displayed to the customer when they are at the liveness
   * stage of the journey. Pose instructions will be automatically displayed
   * to the customer providing the required elements are present.
   */
  Liveness = 'liveness',
  PassiveLiveness = 'passiveLiveness',
  /**
   * This will be displayed at the start of the process if authentication is
   * enabled or there is no token present in the configuration.
   */
  Login = 'login',
  /**
   * This will be displayed to the customer at the end of the journey and will
   * display the outcome of the journey with any supporting information. To
   * omit pieces of information from the view, remove the element in the
   * template and it will be skipped. For information about which details will
   * be made available, please consult the integration documentation.
   */
  Result = 'result',
  /**
   * This will be displayed when the customer is at any document capture stage
   * in the journey and the scanner capture method has been specified by the
   * server. Details and status updates will be automatically displayed as and
   * when required.
   */
  Scanner = 'scanner',
  /**
   * This will be displayed to the customer when they have captured an image
   * using the camera provider or the filesystem providers. The customer can
   * choose to upload the image as is, or use the cropping functionality to
   * trim the image before uploading. To disable the cropping functionality,
   * omit the button from the template.
   */
  View = 'view',
  /**
   * This will be displayed to the customer when the smart capture provider
   * has been specified by the server. The customer can click start to begin
   * the document capture.
   */
  SmartCapture = 'smartCapture',
  /**
   * This will be displayed when presenting the user with a list of the
   * available journeys. The user will be able to see a list of the journeys
   * which are configured in the back office, and pick from one. If there is
   * only one journey available, this screen will be bypassed. If there are
   * none configured, an error message will be shown.
   */
  JourneySelect = 'journeySelect',
  TripleScanGuidance = 'tripleScanGuidance',
  HasNoCamera = 'hasNoCamera',
  Covid = 'covid',
}

/**
 * The way the template should be processed to gain the template string for use
 * in this particular UI situation. For more detailed information, please
 * consult the integration guide.
 *
 * @public
 */
export declare enum TemplateType {
  /**
   * A function, which, when executed will return the template string
   */
  Function = 'function',
  /**
   * No template has been specified for this template name
   */
  Null = 'null',
  /**
   * A promise, which, when resolves will return the template string.
   */
  Promise = 'promise',
  /**
   * The template string to use
   */
  String = 'string',
  /**
   * A URL to retrieve the template string from
   */
  Url = 'url',
}

/**
 * A collection of `TranslationKey`s and their translations
 *
 * @public
 */
export declare type TranslationDictionary = Record<TranslationKey, string>;

/**
 * These are the available translatable objects which will be referenced by the
 * SDK internally when templating the UI.
 *
 * NOTE: Some of these are none-standard as they're used to control translations
 * for values coming back from the API. Please be mindful of this when altering
 * this object.
 *
 * @public
 */
/**
 * These are the available translatable objects which will be referenced by the
 * SDK internally when templating the UI.
 *
 * NOTE: Some of these are none-standard as they're used to control translations
 * for values coming back from the API. Please be mindful of this when altering
 * this object.
 *
 * @public
 */
export declare enum TranslationKey {
  REQUIRED_ACTION_KEEP_CAPTURING = 'REQUIRED_ACTION_KeepCapturing',
  REQUIRED_ACTION_STOP_CAPTURING = 'REQUIRED_ACTION_StopCapturing',
  REQUIRED_ACTION_PAUSE_CAPTURING = 'REQUIRED_ACTION_PauseCapturing',
  REQUIRED_ACTION_CLOSE = 'REQUIRED_ACTION_Close',
  REQUIRED_ACTION_ERROR = 'REQUIRED_ACTION_Error',
  LIVENESS_ACTION_SMILE = 'LIVENESS_ACTION_Smile',
  LIVENESS_ACTION_FROWN = 'LIVENESS_ACTION_Frown',
  LIVENESS_ACTION_TILT_LEFT = 'LIVENESS_ACTION_Tilt Left',
  LIVENESS_ACTION_TILT_RIGHT = 'LIVENESS_ACTION_Tilt Right',
  LIVENESS_ACTION_TILT_UP = 'LIVENESS_ACTION_Tilt Up',
  LIVENESS_ACTION_TILT_DOWN = 'LIVENESS_ACTION_Tilt Down',
  LIVENESS_ACTION_TILT_STRAIGHT = 'LIVENESS_ACTION_Look Straight',
  LIVENESS_ACTION_NO_ACTION = 'LIVENESS_ACTION_No Action',
  LIVENESS_ACTION_PROCESSING_LIVENESS = 'LIVENESS_ACTION_Processing Liveness',
  LIVENESS_RESULT_FAILED = 'LIVENESS_RESULT_Thank you!.Failed',
  LIVENESS_RESULT_PASSED = 'LIVENESS_RESULT_Thank you!.Passed',
  LIVENESS_RESULT_ACTION_TIMED_OUT = 'LIVENESS_RESULT_Thank you!.ActionTimedOut',
  LIVENESS_RESULT_INTERRUPTED = 'LIVENESS_RESULT_Thank you!.Interrupted',
  LIVENESS_RESULT_UNDEFINED = 'LIVENESS_RESULT_Thank you!.Undefined',
  LIVENESS_ACTION_LOOK_STRAIGHT_TITLE = 'LIVENESS_ACTION_LOOK_STRAIGHT_TITLE',
  LIVENESS_ACTION_LOOK_STRAIGHT_TEXT = 'LIVENESS_ACTION_LOOK_STRAIGHT_TEXT',
  LIVENESS_ACTION_LOOK_LEFT_TITLE = 'LIVENESS_ACTION_LOOK_LEFT_TITLE',
  LIVENESS_ACTION_LOOK_LEFT_TEXT = 'LIVENESS_ACTION_LOOK_LEFT_TEXT',
  LIVENESS_ACTION_LOOK_RIGHT_TITLE = 'LIVENESS_ACTION_LOOK_RIGHT_TITLE',
  LIVENESS_ACTION_LOOK_RIGHT_TEXT = 'LIVENESS_ACTION_LOOK_RIGHT_TEXT',
  LIVENESS_ACTION_LOOK_UP_TITLE = 'LIVENESS_ACTION_LOOK_UP_TITLE',
  LIVENESS_ACTION_LOOK_UP_TEXT = 'LIVENESS_ACTION_LOOK_UP_TEXT',
  LIVENESS_ACTION_LOOK_DOWN_TITLE = 'LIVENESS_ACTION_LOOK_DOWN_TITLE',
  LIVENESS_ACTION_LOOK_DOWN_TEXT = 'LIVENESS_ACTION_LOOK_DOWN_TEXT',
  LIVENESS_ACTION_SMILE_TITLE = 'LIVENESS_ACTION_SMILE_TITLE',
  LIVENESS_ACTION_SMILE_TEXT = 'LIVENESS_ACTION_SMILE_TEXT',
  LIVENESS_ACTION_FROWN_TITLE = 'LIVENESS_ACTION_FROWN_TITLE',
  LIVENESS_ACTION_FROWN_TEXT = 'LIVENESS_ACTION_FROWN_TEXT',
  PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_CROPPED_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_CROPPED_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE_TITLE',
  PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES_TITLE = 'PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED_TITLE = 'PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED_TITLE',
  PASSIVE_LIVENESS_ERROR_UNKNOWN_TITLE = 'PASSIVE_LIVENESS_ERROR_UNKNOWN_TITLE',
  PASSIVE_LIVENESS_ERROR_INTERNAL_TITLE = 'PASSIVE_LIVENESS_ERROR_INTERNAL_TITLE',
  PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE = 'PASSIVE_LIVENESS_ERROR_FACE_TOO_CLOSE',
  PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER = 'PASSIVE_LIVENESS_ERROR_FACE_CLOSE_TO_BORDER',
  PASSIVE_LIVENESS_ERROR_FACE_CROPPED = 'PASSIVE_LIVENESS_ERROR_FACE_CROPPED',
  PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND = 'PASSIVE_LIVENESS_ERROR_FACE_NOT_FOUND',
  PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL = 'PASSIVE_LIVENESS_ERROR_FACE_TOO_SMALL',
  PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE = 'PASSIVE_LIVENESS_ERROR_FACE_ANGLE_TOO_LARGE',
  PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES = 'PASSIVE_LIVENESS_ERROR_TOO_MANY_FACES',
  PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED = 'PASSIVE_LIVENESS_ERROR_FACE_IS_OCCLUDED',
  PASSIVE_LIVENESS_ERROR_UNKNOWN = 'PASSIVE_LIVENESS_ERROR_UNKNOWN',
  PASSIVE_LIVENESS_ERROR_INTERNAL = 'PASSIVE_LIVENESS_ERROR_INTERNAL',
  INITIALIZING_TITLE = 'INITIALIZING_TITLE',
  INITIALIZING_DESCRIPTION = 'INITIALIZING_DESCRIPTION',
  JOURNEY_STATE_STARTED = 'JOURNEY_STATE_STARTED',
  JOURNEY_STATE_IN_PROGRESS = 'JOURNEY_STATE_INPROGRESS',
  JOURNEY_STATE_ENDED = 'JOURNEY_STATE_ENDED',
  INFO_JOURNEY_STATE = 'INFO_JOURNEY_STATE',
  INFO_JOURNEY_ACTION = 'INFO_JOURNEY_ACTION',
  INFO_JOURNEY_ACTION_ATTEMPT = 'INFO_JOURNEY_ACTION_ATTEMPT',
  INFO_JOURNEY_ID = 'INFO_JOURNEY_ID',
  INFO_JOURNEY_RESULT = 'INFO_JOURNEY_RESULT',
  INFO_JOURNEY_REFERENCE = 'INFO_JOURNEY_REFERENCE',
  FLOW_STATE_NONE = 'FLOW_STATE_NONE',
  FLOW_STATE_IDENTITY_FRONT = 'FLOW_STATE_IDENTITY:FRONT',
  FLOW_STATE_IDENTITY_BACK = 'FLOW_STATE_IDENTITY:BACK',
  FLOW_STATE_ADDRESS = 'FLOW_STATE_ADDRESS',
  FLOW_STATE_SELFIE = 'FLOW_STATE_SELFIE',
  FLOW_STATE_LIVENESS = 'FLOW_STATE_LIVENESS',
  FLOW_STATE_COVID = 'FLOW_STATE_COVID',
  PROVIDER_TITLE_CAMERA = 'PROVIDER_TITLE_CAMERA',
  PROVIDER_TITLE_CROPPER = 'PROVIDER_TITLE_CROPPER',
  PROVIDER_TITLE_FILESYSTEM_ID = 'PROVIDER_TITLE_FILESYSTEM_ID',
  PROVIDER_TITLE_FILESYSTEM_FACEMATCH = 'PROVIDER_TITLE_FILESYSTEM_FACEMATCH',
  PROVIDER_TITLE_FILESYSTEM_ADDRESS = 'PROVIDER_TITLE_FILESYSTEM_ADDRESS',
  PROVIDER_TITLE_FILESYSTEM_COVID = 'PROVIDER_TITLE_FILESYSTEM_COVID',
  PROVIDER_TITLE_GATEWAY = 'PROVIDER_TITLE_GATEWAY',
  PROVIDER_TITLE_LIVENESS = 'PROVIDER_TITLE_LIVENESS',
  PROVIDER_TITLE_PASSIVE_LIVENESS = 'PROVIDER_TITLE_PASSIVE_LIVENESS',
  PROVIDER_TITLE_LOGIN = 'PROVIDER_TITLE_LOGIN',
  PROVIDER_TITLE_RESULTS = 'PROVIDER_TITLE_RESULTS',
  PROVIDER_TITLE_SCANNER = 'PROVIDER_TITLE_SCANNER',
  PROVIDER_TITLE_VIEW_ID = 'PROVIDER_TITLE_VIEW_ID',
  PROVIDER_TITLE_VIEW_FACEMATCH = 'PROVIDER_TITLE_VIEW_FACEMATCH',
  PROVIDER_TITLE_VIEW_ADDRESS = 'PROVIDER_TITLE_VIEW_ADDRESS',
  PROVIDER_TITLE_VIEW_COVID = 'PROVIDER_TITLE_VIEW_COVID',
  PROVIDER_SUBTITLE_FILESYSTEM_ID = 'PROVIDER_SUBTITLE_FILESYSTEM_ID',
  PROVIDER_SUBTITLE_FILESYSTEM_FACEMATCH = 'PROVIDER_SUBTITLE_FILESYSTEM_FACEMATCH',
  PROVIDER_SUBTITLE_FILESYSTEM_ADDRESS = 'PROVIDER_SUBTITLE_FILESYSTEM_ADDRESS',
  PROVIDER_SUBTITLE_FILESYSTEM_COVID = 'PROVIDER_SUBTITLE_FILESYSTEM_COVID',
  PROVIDER_SUBTITLE_SCANNER_ID = 'PROVIDER_SUBTITLE_SCANNER_ID',
  PROVIDER_SUBTITLE_VIEW_ID = 'PROVIDER_SUBTITLE_VIEW_ID',
  PROVIDER_SUBTITLE_VIEW_FACEMATCH = 'PROVIDER_SUBTITLE_VIEW_FACEMATCH',
  PROVIDER_SUBTITLE_VIEW_ADDRESS = 'PROVIDER_SUBTITLE_VIEW_ADDRESS',
  PROVIDER_SUBTITLE_VIEW_COVID = 'PROVIDER_SUBTITLE_VIEW_COVID',
  PROVIDER_TITLE_SMART_CAPTURE = 'PROVIDER_TITLE_SMART_CAPTURE',
  PROVIDER_TITLE_JOURNEY_SELECT = 'PROVIDER_TITLE_JOURNEY_SELECT',
  FILESYSTEM_SUPPORTED_TYPES_START = 'FILESYSTEM_SUPPORTED_TYPES_START',
  FILESYSTEM_SUPPORTED_TYPES_END = 'FILESYSTEM_SUPPORTED_TYPES_END',
  FILESYSTEM_SUPPORTED_TYPES_START_SELFIE = 'FILESYSTEM_SUPPORTED_TYPES_START_SELFIE',
  FILESYSTEM_MAX_FILE_SIZE = 'FILESYSTEM_MAX_FILE_SIZE',
  FILESYSTEM_CHECK_FILE_TOO_BIG = 'FILESYSTEM_CHECK_FILE_TOO_BIG',
  FILESYSTEM_CHECK_FILE_INCORRECT_FORMAT = 'FILESYSTEM_CHECK_FILE_INCORRECT_FORMAT',
  FILESYSTEM_IDENTITY_DOCUMENT = 'FILESYSTEM_IDENTITY_DOCUMENT',
  FILESYSTEM_FACEMATCH = 'FILESYSTEM_FACEMATCH',
  FILESYSTEM_ADDRESS = 'FILESYSTEM_ADDRESS',
  FILESYSTEM_COVID = 'FILESYSTEM_COVID',
  FILESYSTEM_DRAG_DROP = 'FILESYSTEM_DRAG_DROP',
  FILESYSTEM_OR = 'FILESYSTEM_OR',
  FILESYSTEM_CHOOSE = 'FILESYSTEM_CHOOSE',
  FILESYSTEM_UPLOADING = 'FILESYSTEM_UPLOADING',
  TRIPLESCAN_GUIDANCE_TRYAGAIN = 'TRIPLESCAN_GUIDANCE_TRYAGAIN',
  FAILURE_REASON_NOT_SUPPORTED = 'FAILURE_REASON_NOT_SUPPORTED',
  FAILURE_REASON_REFER = 'FAILURE_REASON_REFER',
  FAILURE_REASON_EXPIRED = 'FAILURE_REASON_EXPIRED',
  FAILURE_REASON_NOT_ACCEPTED = 'FAILURE_REASON_NOT_ACCEPTED',
  PLEASE_TRY_AGAIN_REFER = 'PLEASE_TRY_AGAIN_REFER',
  PLEASE_TRY_AGAIN_EXPIRED = 'PLEASE_TRY_AGAIN_EXPIRED',
  PLEASE_TRY_AGAIN_NOT_ACCEPTED = 'PLEASE_TRY_AGAIN_NOT_ACCEPTED',
  PLEASE_TRY_AGAIN_NOT_SUPPORTED = 'PLEASE_TRY_AGAIN_NOT_SUPPORTED',
  BLUR_CHECK_REASON = 'BLUR_CHECK_REASON',
  GLARE_CHECK_REASON = 'GLARE_CHECK_REASON',
  RESOLUTION_CHECK_REASON = 'RESOLUTION_CHECK_REASON',
  EDGES_CHECK_REASON = 'EDGES_CHECK_REASON',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_FAILED_REASON_DOC_UNKNOWN = 'VALIDATION_FAILED_REASON_DOC_UNKNOWN',
  VALIDATION_FAILED_REASON_DOC_NOT_ACCEPTED = 'VALIDATION_FAILED_REASON_DOC_NOT_ACCEPTED',
  VALIDATION_FAILED_REASON_DOC_EXPIRED = 'VALIDATION_FAILED_REASON_DOC_EXPIRED',
  PREVIEW_INFO_TITLE_ID = 'PREVIEW_INFO_TITLE_ID',
  PREVIEW_INFO_GOOD = 'PREVIEW_INFO_GOOD',
  PREVIEW_INFO_BAD = 'PREVIEW_INFO_BAD',
  PREVIEW_INFO_GOOD_EXAMPLE_ID = 'PREVIEW_INFO_GOOD_EXAMPLE_ID',
  PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ID = 'PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ID',
  PREVIEW_INFO_BAD_EXAMPLE_COVER_ID = 'PREVIEW_INFO_BAD_EXAMPLE_COVER_ID',
  PREVIEW_INFO_BAD_EXAMPLE_BLUR_ID = 'PREVIEW_INFO_BAD_EXAMPLE_BLUR_ID',
  PREVIEW_INFO_TITLE_FACEMATCH = 'PREVIEW_INFO_TITLE_FACEMATCH',
  PREVIEW_INFO_GOOD_EXAMPLE_FACEMATCH = 'PREVIEW_INFO_GOOD_EXAMPLE_FACEMATCH',
  PREVIEW_INFO_BAD_EXAMPLE_ANGLE_FACEMATCH = 'PREVIEW_INFO_BAD_EXAMPLE_ANGLE_FACEMATCH',
  PREVIEW_INFO_BAD_EXAMPLE_COVER_FACEMATCH = 'PREVIEW_INFO_BAD_EXAMPLE_COVER_FACEMATCH',
  PREVIEW_INFO_BAD_EXAMPLE_BLUR_FACEMATCH = 'PREVIEW_INFO_BAD_EXAMPLE_BLUR_FACEMATCH',
  PREVIEW_INFO_TITLE_ADDRESS = 'PREVIEW_INFO_TITLE_ADDRESS',
  PREVIEW_INFO_GOOD_EXAMPLE_ADDRESS = 'PREVIEW_INFO_GOOD_EXAMPLE_ADDRESS',
  PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ADDRESS = 'PREVIEW_INFO_BAD_EXAMPLE_ANGLE_ADDRESS',
  PREVIEW_INFO_BAD_EXAMPLE_COVER_ADDRESS = 'PREVIEW_INFO_BAD_EXAMPLE_COVER_ADDRESS',
  PREVIEW_INFO_BAD_EXAMPLE_BLUR_ADDRESS = 'PREVIEW_INFO_BAD_EXAMPLE_BLUR_ADDRESS',
  PREVIEW_INFO_TITLE_COVID = 'PREVIEW_INFO_TITLE_COVID',
  PREVIEW_INFO_GOOD_EXAMPLE_COVID = 'PREVIEW_INFO_GOOD_EXAMPLE_COVID',
  PREVIEW_INFO_BAD_EXAMPLE_ANGLE_COVID = 'PREVIEW_INFO_BAD_EXAMPLE_ANGLE_COVID',
  PREVIEW_INFO_BAD_EXAMPLE_COVER_COVID = 'PREVIEW_INFO_BAD_EXAMPLE_COVER_COVID',
  PREVIEW_INFO_BAD_EXAMPLE_BLUR_COVID = 'PREVIEW_INFO_BAD_EXAMPLE_BLUR_COVID',
  PREVIEW_ATTEMPT_NUMBER_START = 'PREVIEW_ATTEMPT_NUMBER_START',
  PREVIEW_ATTEMPT_NUMBER_END = 'PREVIEW_ATTEMPT_NUMBER_END',
  CAMERA_CAPTURE = 'CAMERA_CAPTURE',
  CAMERA_CAPTURE_START_BUTTON = 'CAMERA_CAPTURE_START_BUTTON',
  CAMERA_CAPTURE_CAPTION = 'CAMERA_CAPTURE_CAPTION',
  CAMERA_PREVIEW_START = 'CAMERA_PREVIEW_START',
  CAMERA_CONDITION_BLUR = 'CAMERA_CONDITION_BLUR',
  CAMERA_CONDITION_CAPTURING = 'CAMERA_CONDITION_CAPTURING',
  CAMERA_CONDITION_UPLOADING = 'CAMERA_CONDITION_UPLOADING',
  CAMERA_CONDITION_ALIGNMENT = 'CAMERA_CONDITION_ALIGNMENT',
  CAMERA_CONDITION_GLARE = 'CAMERA_CONDITION_GLARE',
  VERIFYING_TITLE = 'VERIFYING_TITLE',
  PREPARING_PREVIEW_TITLE = 'PREPARING_PREVIEW_TITLE',
  CAMERA_CONDITION_LOW_RESOLUTION = 'CAMERA_CONDITION_LOW_RESOLUTION',
  CAMERA_PREVENT_GLARE_HINT = 'CAMERA_PREVENT_GLARE_HINT',
  CAMERA_PREVENT_BLUR_HINT = 'CAMERA_PREVENT_BLUR_HINT',
  CAMERA_PREVENT_LOW_RES_HINT = 'CAMERA_PREVENT_LOW_RES_HINT',
  CAMERA_SMARTCAPTURE_ON = 'CAMERA_SMARTCAPTURE_ON',
  CAMERA_SMARTCAPTURE_OFF = 'CAMERA_SMARTCAPTURE_OFF',
  CAMERA_CAPTURE_FRONT = 'CAMERA_CAPTURE_FRONT',
  CAMERA_MANUAL_CAPTURE_FRONT = 'CAMERA_MANUAL_CAPTURE_FRONT',
  CAMERA_CAPTURE_BACK = 'CAMERA_CAPTURE_BACK',
  CAMERA_CAPTURE_SELFIE_CAPTION = 'CAMERA_CAPTURE_SELFIE_CAPTION',
  CAMERA_CAPTURE_ADDRESS_CAPTION = 'CAMERA_CAPTURE_ADDRESS_CAPTION',
  CAMERA_CAPTURE_COVID_CAPTION = 'CAMERA_CAPTURE_COVID_CAPTION',
  CAMERA_LOADING = 'CAMERA_LOADING',
  CROPPER_RETRY = 'CROPPER_RETRY',
  CROPPER_UPLOAD = 'CROPPER_UPLOAD',
  CROPPER_UPLOADING = 'CROPPER_UPLOADING',
  FILESYSTEM_SELECT = 'FILESYSTEM_SELECT',
  FILESYSTEM_DROP_IMAGE = 'FILESYSTEM_DROP_IMAGE',
  GATEWAY_CAMERA = 'GATEWAY_CAMERA',
  GATEWAY_CANCEL = 'GATEWAY_CANCEL',
  LIVENESS_START = 'LIVENESS_START',
  PASSIVE_LIVENESS_START = 'PASSIVE_LIVENESS_START',
  LOGIN_USERNAME = 'LOGIN_USERNAME',
  LOGIN_PASSWORD = 'LOGIN_PASSWORD',
  LOGIN_SUBMIT = 'LOGIN_SUBMIT',
  RESULTS_DOCUMENTS = 'RESULTS_DOCUMENTS',
  RESULTS_DOCUMENTS_NONE = 'RESULTS_DOCUMENTS_NONE',
  RESULTS_DOCUMENT_TYPE = 'RESULTS_DOCUMENT_TYPE',
  RESULTS_DOCUMENT_RESULT = 'RESULTS_DOCUMENT_RESULT',
  RESULTS_EXTRACTED_FIELDS_NONE = 'RESULTS_EXTRACTED_FIELDS_NONE',
  RESULTS_DETAILS = 'RESULTS_DETAILS',
  RESULTS_DETAILS_NONE = 'RESULTS_DETAILS_NONE',
  RESULTS_NEW_JOURNEY = 'RESULTS_NEW_JOURNEY',
  RESULTS_NO_INFORMATION = 'RESULTS_NO_INFORMATION',
  RESULTS_LOGOUT = 'RESULTS_LOGOUT',
  RESULTS_HIGH_LEVEL_ABORTED = 'RESULTS_HIGH_LEVEL_Aborted',
  RESULTS_HIGH_LEVEL_EXPIRED = 'RESULTS_HIGH_LEVEL_Expired',
  RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE = 'RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE',
  RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE_VALUE = 'RESULTS_HIGH_LEVEL_EXPIRED_MESSAGE_VALUE',
  RESULTS_HIGH_LEVEL_NOT_ACCEPTED = 'RESULTS_HIGH_LEVEL_NotAccepted',
  RESULTS_HIGH_LEVEL_NOT_SUPPORTED = 'RESULTS_HIGH_LEVEL_NotSupported',
  RESULTS_HIGH_LEVEL_NOTSUPPORTED = 'RESULTS_HIGH_LEVEL_Notsupported',
  RESULTS_HIGH_LEVEL_PASSED = 'RESULTS_HIGH_LEVEL_Passed',
  RESULTS_HIGH_LEVEL_REFER = 'RESULTS_HIGH_LEVEL_Refer',
  RESULTS_HIGH_LEVEL_UNDEFINED = 'RESULTS_HIGH_LEVEL_Undefined',
  RESULTS_HIGH_LEVEL_DETAIL_ACCUMULATIVE_LIVENESS_RESULT = 'RESULTS_HIGH_LEVEL_DETAIL_ACCUMULATIVELIVENESSRESULT',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_FRONT_SIDE_TYPE_CHECK = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTFRONTSIDETYPECHECK',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_BACK_SIDE_TYPE_CHECK = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDETYPECHECK',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_BACK_SIDE_CHECK = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBACKSIDECHECK',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_BLOCKING_POLICY = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTBLOCKINGPOLICY',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_OVERALL_VALIDATION = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTOVERALLVALIDATION',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_EXPIRY = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTEXPIRY',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_SUPPORT = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTSUPPORT',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_VALIDATION = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTVALIDATION',
  RESULTS_HIGH_LEVEL_DETAIL_DOCUMENT_PROOF_POLICY = 'RESULTS_HIGH_LEVEL_DETAIL_DOCUMENTPROOFPOLICY',
  RESULTS_HIGH_LEVEL_DETAIL_FACEMATCH_VALIDATION = 'RESULTS_HIGH_LEVEL_DETAIL_FACEMATCHVALIDATION',
  RESULTS_HIGH_LEVEL_DETAIL_UNDERAGE_RULE = 'RESULTS_HIGH_LEVEL_DETAIL_UNDERAGERULE',
  RESULTS_HIGH_LEVEL_DETAIL_VALUE_SUCCESS_NEEDED = 'RESULTS_HIGH_LEVEL_DETAIL_VALUE_SUCCESSNEEDED',
  RESULTS_HIGH_LEVEL_DETAIL_VALUE_FAILED = 'RESULTS_HIGH_LEVEL_DETAIL_VALUE_FAILED',
  RESULTS_HIGH_LEVEL_DETAIL_VALUE_NOTNEEDED = 'RESULTS_HIGH_LEVEL_DETAIL_VALUE_NOTNEEDED',
  RESULTS_HIGH_LEVEL_DETAIL_VALUE_PASSED = 'RESULTS_HIGH_LEVEL_DETAIL_VALUE_PASSED',
  RESULTS_HIGH_LEVEL_DETAIL_VALUE_SKIPPED = 'RESULTS_HIGH_LEVEL_DETAIL_VALUE_SKIPPED',
  RESULTS_HIGH_LEVEL_DETAIL_COVID_PASS_CROSSCHECK = 'RESULTS_HIGH_LEVEL_DETAIL_COVIDPASSCROSSCHECKRESULT',
  VIEW_RETRY = 'VIEW_RETRY',
  VIEW_CROP = 'VIEW_CROP',
  VIEW_CROPPING = 'VIEW_CROPPING',
  VIEW_UPLOAD = 'VIEW_UPLOAD',
  VIEW_UPLOADING = 'VIEW_UPLOADING',
  SMART_CAPTURE_INITIALIZING = 'SMART_CAPTURE_INITIALIZING',
  SMART_CAPTURE_START = 'SMART_CAPTURE_START',
  SCANNER_DESC_AVAILABLE = 'SCANNER_DESC_AVAILABLE',
  SCANNER_DESC_PROCESSING = 'SCANNER_DESC_PROCESSING',
  SCANNER_DESC_SCANNING = 'SCANNER_DESC_SCANNING',
  SCANNER_DESC_DISCONNECTED = 'SCANNER_DESC_DISCONNECTED',
  SCANNER_DESC_NOT_CONNECTED = 'SCANNER_DESC_NOT_CONNECTED',
  SCANNER_DESC_OFFLINE = 'SCANNER_DESC_OFFLINE',
  SCANNER_DESC_BUSY = 'SCANNER_DESC_BUSY',
  SCANNER_DESC_WAITING = 'SCANNER_DESC_WAITING',
  SCANNER_DESC_LOADING = 'SCANNER_DESC_LOADING',
  SCANNER_TITLE_AVAILABLE = 'SCANNER_TITLE_AVAILABLE',
  SCANNER_TITLE_PROCESSING = 'SCANNER_TITLE_PROCESSING',
  SCANNER_TITLE_SCANNING = 'SCANNER_TITLE_SCANNING',
  SCANNER_TITLE_DISCONNECTED = 'SCANNER_TITLE_DISCONNECTED',
  SCANNER_TITLE_NOT_CONNECTED = 'SCANNER_TITLE_NOT_CONNECTED',
  SCANNER_TITLE_OFFLINE = 'SCANNER_TITLE_OFFLINE',
  SCANNER_TITLE_BUSY = 'SCANNER_TITLE_BUSY',
  SCANNER_TITLE_WAITING = 'SCANNER_TITLE_WAITING',
  SCANNER_ACTION_REGISTER = 'SCANNER_ACTION_REGISTER',
  SCANNER_ACTION_RELEASE = 'SCANNER_ACTION_RELEASE',
  CANCEL_JOURNEY = 'CANCEL_JOURNEY',
  MANUAL_PHOTO_UPLOAD_TOGGLE_FALSE = 'MANUAL_PHOTO_UPLOAD_TOGGLE_FALSE',
  MANUAL_PHOTO_UPLOAD_TOGGLE_TRUE = 'MANUAL_PHOTO_UPLOAD_TOGGLE_TRUE',
  JOURNEY_SELECT_CONTINUE = 'JOURNEY_SELECT_CONTINUE',
  HELP_MODAL_AUTOCAPTURE_TITLE = 'HELP_MODAL_AUTOCAPTURE_TITLE',
  HELP_MODAL_AUTOCAPTURE_SUBTITLE = 'HELP_MODAL_AUTOCAPTURE_SUBTITLE',
  HELP_MODAL_AUTOCAPTURE_TIPS = 'HELP_MODAL_AUTOCAPTURE_TIPS',
  HELP_MODAL_AUTOCAPTURE_GLARE_TITLE = 'HELP_MODAL_AUTOCAPTURE_GLARE_TITLE',
  HELP_MODAL_AUTOCAPTURE_GLARE_SUBTITLE = 'HELP_MODAL_AUTOCAPTURE_GLARE_SUBTITLE',
  HELP_MODAL_AUTOCAPTURE_FAR_TITLE = 'HELP_MODAL_AUTOCAPTURE_FAR_TITLE',
  HELP_MODAL_AUTOCAPTURE_FAR_SUBTITLE = 'HELP_MODAL_AUTOCAPTURE_FAR_SUBTITLE',
  HELP_MODAL_AUTOCAPTURE_BLUR_TITLE = 'HELP_MODAL_AUTOCAPTURE_BLUR_TITLE',
  HELP_MODAL_AUTOCAPTURE_BLUR_SUBTITLE = 'HELP_MODAL_AUTOCAPTURE_BLUR_SUBTITLE',
  HELP_MODAL_AUTOCAPTURE_MANUAL_CAPTURE = 'HELP_MODAL_AUTOCAPTURE_MANUAL_CAPTURE',
  HELP_MODAL_AUTOCAPTURE_TURN_MANUAL_CAPTURE = 'HELP_MODAL_AUTOCAPTURE_TURN_MANUAL_CAPTURE',
  HELP_MODAL_SELFIE_TITLE = 'HELP_MODAL_SELFIE_TITLE',
  HELP_MODAL_SELFIE_SUBTITLE = 'HELP_MODAL_SELFIE_SUBTITLE',
  HELP_MODAL_POA_TITLE = 'HELP_MODAL_POA_TITLE',
  HELP_MODAL_POA_SUBTITLE = 'HELP_MODAL_POA_SUBTITLE',
  HELP_MODAL_POA_TIPS = 'HELP_MODAL_POA_TIPS',
  HELP_MODAL_POA_GLARE_TITLE = 'HELP_MODAL_POA_GLARE_TITLE',
  HELP_MODAL_POA_GLARE_SUBTITLE = 'HELP_MODAL_POA_GLARE_SUBTITLE',
  HELP_MODAL_POA_FAR_TITLE = 'HELP_MODAL_POA_FAR_TITLE',
  HELP_MODAL_POA_FAR_SUBTITLE = 'HELP_MODAL_POA_FAR_SUBTITLE',
  HELP_MODAL_POA_BLUR_TITLE = 'HELP_MODAL_POA_BLUR_TITLE',
  HELP_MODAL_POA_BLUR_SUBTITLE = 'HELP_MODAL_POA_BLUR_SUBTITLE',
  HELP_MODAL_POA_MANUAL_CAPTURE = 'HELP_MODAL_POA_MANUAL_CAPTURE',
  HELP_MODAL_POA_TURN_MANUAL_CAPTURE = 'HELP_MODAL_POA_TURN_MANUAL_CAPTURE',
  HELP_MODAL_NEED_HELP = 'HELP_MODAL_NEED_HELP',
  EXCEPTION = 'EXCEPTION',
  EXCEPTION_AUTHORIZATION = 'EXCEPTION_AUTHORIZATION',
  EXCEPTION_AUTHORIZATION_ACCOUNT_NOT_AUTHORIZED = 'EXCEPTION_AUTHORIZATION_ACCOUNT_NOT_AUTHORIZED',
  EXCEPTION_AUTHORIZATION_AUTH_DETAILS_INVALID = 'EXCEPTION_AUTHORIZATION_AUTH_DETAILS_INVALID',
  EXCEPTION_AUTHORIZATION_AUTH_NOT_ENABLED = 'EXCEPTION_AUTHORIZATION_AUTH_NOT_ENABLED',
  EXCEPTION_AUTHORIZATION_PROCESS_NOT_AUTHORIZED = 'EXCEPTION_AUTHORIZATION_PROCESS_NOT_AUTHORIZED',
  EXCEPTION_BAD_REQUEST = 'EXCEPTION_BAD_REQUEST',
  EXCEPTION_BAD_REQUEST_INVALID_IMAGE = 'EXCEPTION_BAD_REQUEST_INVALID_IMAGE',
  EXCEPTION_BAD_REQUEST_WAITING_FOR_RESPONSE = 'EXCEPTION_BAD_REQUEST_WAITING_FOR_RESPONSE',
  EXCEPTION_FLOW_STATE_JOURNEY_ENDED = 'EXCEPTION_FLOW_STATE_JOURNEY_ENDED',
  EXCEPTION_FLOW_STATE_MISSING = 'EXCEPTION_FLOW_STATE_MISSING',
  EXCEPTION_INVALID_PARAMETER_CALLBACK_MUST_BE_FUNCTION = 'EXCEPTION_INVALID_PARAMETER_CALLBACK_MUST_BE_FUNCTION',
  EXCEPTION_INVALID_PARAMETER_NAME_MUST_BE_STRING = 'EXCEPTION_INVALID_PARAMETER_NAME_MUST_BE_STRING',
  EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_NUMBER = 'EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_NUMBER',
  EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_POSITIVE_NUMBER = 'EXCEPTION_INVALID_PARAMETER_PRIORITY_MUST_BE_POSITIVE_NUMBER',
  EXCEPTION_INVALID_PARAMETER_SHOULD_BE_ELEMENT_OR_SELECTOR = 'EXCEPTION_INVALID_PARAMETER_SHOULD_BE_ELEMENT_OR_SELECTOR',
  EXCEPTION_INVALID_PARAMETER_VALUE_NOT_VALID = 'EXCEPTION_INVALID_PARAMETER_VALUE_NOT_VALID',
  EXCEPTION_INVALID_PARAMETER_VALUE_DAMAGED = 'EXCEPTION_INVALID_PARAMETER_VALUE_DAMAGED',
  EXCEPTION_MISSING_PARAMETER_BACKEND_URL_MISSING = 'EXCEPTION_MISSING_PARAMETER_BACKEND_URL_MISSING',
  EXCEPTION_MISSING_PARAMETER_COORDINATES_MISSING = 'EXCEPTION_MISSING_PARAMETER_COORDINATES_MISSING',
  EXCEPTION_MISSING_PARAMETER_IMAGES_MISSING = 'EXCEPTION_MISSING_PARAMETER_IMAGES_MISSING',
  EXCEPTION_MISSING_PARAMETER_PASSWORD_MISSING = 'EXCEPTION_MISSING_PARAMETER_PASSWORD_MISSING',
  EXCEPTION_MISSING_PARAMETER_USERNAME_MISSING = 'EXCEPTION_MISSING_PARAMETER_USERNAME_MISSING',
  EXCEPTION_JOURNEY_DEFINITIONS_MISSING = 'EXCEPTION_JOURNEY_DEFINITIONS_MISSING',
  EXCEPTION_NETWORK = 'EXCEPTION_NETWORK',
  EXCEPTION_PLATFORM_BROWSER_ONLY = 'EXCEPTION_PLATFORM_BROWSER_ONLY',
  EXCEPTION_PLATFORM_UNSUPPORTED = 'EXCEPTION_PLATFORM_UNSUPPORTED',
  EXCEPTION_PLATFORM_CAMERA_PERMISSION_DENIED = 'EXCEPTION_PLATFORM_CAMERA_PERMISSION_DENIED',
  EXCEPTION_PLATFORM_CAMERA_PERMISSION_UNAVAILABLE = 'EXCEPTION_PLATFORM_CAMERA_PERMISSION_UNAVAILABLE',
  EXCEPTION_PLATFORM_CAMERA_NOT_READABLE = 'EXCEPTION_PLATFORM_CAMERA_NOT_READABLE',
  EXCEPTION_PLATFORM_CAMERA_NONE_SUITABLE = 'EXCEPTION_PLATFORM_CAMERA_NONE_SUITABLE',
  EXCEPTION_SERVER = 'EXCEPTION_SERVER',
  EXCEPTION_SERVER_UNREACHABLE = 'EXCEPTION_SERVER_UNREACHABLE',
  EXCEPTION_SERVER_DATA_NOT_PERSISTED = 'EXCEPTION_SERVER_DATA_NOT_PERSISTED',
  EXCEPTION_SERVER_RESULT_NOT_PASSING = 'EXCEPTION_SERVER_RESULT_NOT_PASSING',
  EXCEPTION_TEMPLATE_CANVAS_CONTEXT_UNAVAILABLE = 'EXCEPTION_TEMPLATE_CANVAS_CONTEXT_UNAVAILABLE',
  EXCEPTION_TEMPLATE_CONTAINER_MISSING = 'EXCEPTION_TEMPLATE_CONTAINER_MISSING',
  EXCEPTION_TEMPLATE_ELEMENTS_MISSING = 'EXCEPTION_TEMPLATE_ELEMENTS_MISSING',
  EXCEPTION_TEMPLATE_MISSING = 'EXCEPTION_TEMPLATE_MISSING',
  EXCEPTION_TEMPLATE_SOURCE_ELEMENT_MISSING = 'EXCEPTION_TEMPLATE_SOURCE_ELEMENT_MISSING',
  EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_CANNOT_RETRIEVE = 'EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_CANNOT_RETRIEVE',
  EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NONE_SPECIFIED = 'EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NONE_SPECIFIED',
  EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NOT_AVAILABLE = 'EXCEPTION_UNAVAILABLE_INPUT_PROVIDER_NOT_AVAILABLE',
  SUPPORTED_DOCUMENT_ACCOUNT_STATEMENT = 'SUPPORTED_DOCUMENT_Account Statement',
  SUPPORTED_DOCUMENT_AGREEMENT_TENANCY = 'SUPPORTED_DOCUMENT_Agreement (Tenancy)',
  SUPPORTED_DOCUMENT_BANK_DOCUMENT = 'SUPPORTED_DOCUMENT_Bank Document',
  SUPPORTED_DOCUMENT_BANK_LETTER = 'SUPPORTED_DOCUMENT_Bank Letter',
  SUPPORTED_DOCUMENT_BANK_STATEMENT = 'SUPPORTED_DOCUMENT_Bank Statement',
  SUPPORTED_DOCUMENT_BENEFIT_LETTER = 'SUPPORTED_DOCUMENT_Benefit Letter',
  SUPPORTED_DOCUMENT_CERTIFICATE = 'SUPPORTED_DOCUMENT_Certificate (Birth, Marriage, Civil partnership)',
  SUPPORTED_DOCUMENT_COUNCIL_DOCUMENT = 'SUPPORTED_DOCUMENT_Council Document',
  SUPPORTED_DOCUMENT_COUNCIL_LETTER = 'SUPPORTED_DOCUMENT_Council Letter',
  SUPPORTED_DOCUMENT_COUNCIL_TAX = 'SUPPORTED_DOCUMENT_Council Tax',
  SUPPORTED_DOCUMENT_DRIVING_LICENSE = 'SUPPORTED_DOCUMENT_Driving License',
  SUPPORTED_DOCUMENT_DRIVING_LICENCE = 'SUPPORTED_DOCUMENT_Driving Licence',
  SUPPORTED_DOCUMENT_DWP_DOCUMENT = 'SUPPORTED_DOCUMENT_DWP Document',
  SUPPORTED_DOCUMENT_HMRC_DOCUMENT = 'SUPPORTED_DOCUMENT_HMRC Document',
  SUPPORTED_DOCUMENT_INFORMATION_SHEET = 'SUPPORTED_DOCUMENT_Information Sheet',
  SUPPORTED_DOCUMENT_INSURANCE_DOCUMENT = 'SUPPORTED_DOCUMENT_Insurance Document',
  SUPPORTED_DOCUMENT_INSURANCE_LETTER = 'SUPPORTED_DOCUMENT_Insurance Letter',
  SUPPORTED_DOCUMENT_INVOICE = 'SUPPORTED_DOCUMENT_Invoice',
  SUPPORTED_DOCUMENT_NIC_LETTER = 'SUPPORTED_DOCUMENT_NIC Letter',
  SUPPORTED_DOCUMENT_NINO_LETTER = 'SUPPORTED_DOCUMENT_NINO Letter',
  SUPPORTED_DOCUMENT_OFFICIAL_DOCUMENT = 'SUPPORTED_DOCUMENT_Official Document',
  SUPPORTED_DOCUMENT_OFFICIAL_LETTER = 'SUPPORTED_DOCUMENT_Official Letter',
  SUPPORTED_DOCUMENT_REPAYMENT = 'SUPPORTED_DOCUMENT_Repayment Letter (related to Tax or Social support)',
  SUPPORTED_DOCUMENT_TAX_LETTER = 'SUPPORTED_DOCUMENT_Tax Letter',
  SUPPORTED_DOCUMENT_TAX_STATEMENT = 'SUPPORTED_DOCUMENT_Tax Statement',
  SUPPORTED_DOCUMENT_TEL_BILL = 'SUPPORTED_DOCUMENT_Tel Bill',
  SUPPORTED_DOCUMENT_TEL_LETTER = 'SUPPORTED_DOCUMENT_Tel Letter',
  SUPPORTED_DOCUMENT_TELECOMMUNICATION_DOCUMENT = 'SUPPORTED_DOCUMENT_Telecommunication Document',
  SUPPORTED_DOCUMENT_TV_LICENSE = 'SUPPORTED_DOCUMENT_TV Licence',
  SUPPORTED_DOCUMENT_UNIVERSITY_LETTER = 'SUPPORTED_DOCUMENT_University Letter',
  SUPPORTED_DOCUMENT_UTILITY_BILL = 'SUPPORTED_DOCUMENT_Utility Bill',
  SUPPORTED_DOCUMENT_UTILITY_DOCUMENT = 'SUPPORTED_DOCUMENT_Utility Document',
  SUPPORTED_DOCUMENT_UTILITY_LETTER = 'SUPPORTED_DOCUMENT_Utility Letter',
  SUPPORTED_DOCUMENT_WATER_BILL = 'SUPPORTED_DOCUMENT_Water Bil',
  SUPPORTED_DOCUMENT_WATER_DOCUMENT = 'SUPPORTED_DOCUMENT_Water Document',
  SUPPORTED_DOCUMENT_AGENTS_LICENCE = 'SUPPORTED_DOCUMENT_Agents License',
  SUPPORTED_DOCUMENT_ELECTORAL_CARD = 'SUPPORTED_DOCUMENT_Electoral Card',
  SUPPORTED_DOCUMENT_FOREIGNER_IDENTIFICATION_CARD = 'SUPPORTED_DOCUMENT_Foreigner Identification Card',
  SUPPORTED_DOCUMENT_HEALTH_CARD = 'SUPPORTED_DOCUMENT_Health Card',
  SUPPORTED_DOCUMENT_JOB_LICENCE = 'SUPPORTED_DOCUMENT_Job License ',
  SUPPORTED_DOCUMENT_MEMBERSHIP_IDENTIFICATION_CARD = 'SUPPORTED_DOCUMENT_Membership Identification Card',
  SUPPORTED_DOCUMENT_MILITARY_IDENTIFICATION_CARD = 'SUPPORTED_DOCUMENT_Military Identification Card',
  SUPPORTED_DOCUMENT_NATIONAL_IDENTIFICATION_CARD = 'SUPPORTED_DOCUMENT_National Identification Card',
  SUPPORTED_DOCUMENT_PASSPORT = 'SUPPORTED_DOCUMENT_Passport',
  SUPPORTED_DOCUMENT_TRAVEL_PERMIT = 'SUPPORTED_DOCUMENT_Travel Permit',
  SUPPORTED_DOCUMENT_VISA = 'SUPPORTED_DOCUMENT_Visa',
  SUPPORTED_DOCUMENT_WEAPONS_LICENCE = 'SUPPORTED_DOCUMENT_Weapons Licence',
  SUPPORTED_DOCUMENT_SELFIE_PHOTO = 'SUPPORTED_DOCUMENT_Selfie Photo',
  SUPPORTED_DOCUMENT_UNKNOWN = 'SUPPORTED_DOCUMENT_Unknown',
  SUPPORTED_DOCUMENT_COVIDPASS = 'SUPPORTED_DOCUMENT_CovidPass',
  EXTRACTED_FIELDS_ADDRESS_FULL = 'EXTRACTED_FIELDS_AddressFull',
  EXTRACTED_FIELDS_ADDRESS_CITY = 'EXTRACTED_FIELDS_AddressCity',
  EXTRACTED_FIELDS_ADDRESS_POSTCODE = 'EXTRACTED_FIELDS_AddressPostCode',
  EXTRACTED_FIELDS_LASTNAME_FIRST_PART = 'EXTRACTED_FIELDS_LastNameFirstPart',
  EXTRACTED_FIELDS_SEX = 'EXTRACTED_FIELDS_Sex',
  EXTRACTED_FIELDS_BIRTH_PLACE = 'EXTRACTED_FIELDS_BirthPlace',
  EXTRACTED_FIELDS_ISSUE_NUMBER = 'EXTRACTED_FIELDS_IssueNumber',
  EXTRACTED_FIELDS_DOCUMENT_NUMBER_CHECK_DIGIT = 'EXTRACTED_FIELDS_DocumentNumberCheckDigit',
  EXTRACTED_FIELDS_BIRTH_DATE = 'EXTRACTED_FIELDS_BirthDate',
  EXTRACTED_FIELDS_DOCUMENT_NUMBER = 'EXTRACTED_FIELDS_DocumentNumber',
  EXTRACTED_FIELDS_COVIDPASSCROSSCHECKRESULT = 'EXTRACTED_FIELDS_COVIDPASSCROSSCHECKRESULT',
  EXTRACTED_FIELDS_FIRST_NAME = 'EXTRACTED_FIELDS_FirstName',
  EXTRACTED_FIELDS_ARBITRARY_DIGIT = 'EXTRACTED_FIELDS_ArbitraryDigit',
  EXTRACTED_FIELDS_FIRST_NAME_INITIAL = 'EXTRACTED_FIELDS_FirstNameInitial',
  EXTRACTED_FIELDS_EXPIRY_DATE = 'EXTRACTED_FIELDS_ExpiryDate',
  EXTRACTED_FIELDS_ISSUE_DATE = 'EXTRACTED_FIELDS_IssueDate',
  EXTRACTED_FIELDS_LAST_NAME = 'EXTRACTED_FIELDS_LastName',
  EXTRACTED_FIELDS_LICENSE_CATEGORY = 'EXTRACTED_FIELDS_LicenseCategory',
  EXTRACTED_FIELDS_DOCUMENT_CATEGORY = 'EXTRACTED_FIELDS_DocumentCategory',
  EXTRACTED_FIELDS_DOCUMENT_TYPE = 'EXTRACTED_FIELDS_DocumentType',
  EXTRACTED_FIELDS_NATIONALITY_CODE = 'EXTRACTED_FIELDS_NationalityCode',
  EXTRACTED_FIELDS_MIDDLE_NAME = 'EXTRACTED_FIELDS_MiddleName',
  EXTRACTED_FIELDS_FIRST_ISSUANCE_DATE = 'EXTRACTED_FIELDS_FirstIssuanceDate',
  EXTRACTED_FIELDS_SECOND_LAST_NAME = 'EXTRACTED_FIELDS_SecondLastName',
  EXTRACTED_FIELDS_FULL_NAME = 'EXTRACTED_FIELDS_FullName',
  EXTRACTED_FIELDS_PERSONAL_NUMBER = 'EXTRACTED_FIELDS_PersonalNumber',
  EXTRACTED_FIELDS_NATIONALITY_NAME = 'EXTRACTED_FIELDS_NationalityName',
  EXTRACTED_FIELDS_BARCODE_ITEMS = 'EXTRACTED_FIELDS_BarcodeItems',
  EXTRACTED_FIELDS_BIRTH_PLACE_CITY = 'EXTRACTED_FIELDS_BirthPlaceCity',
  EXTRACTED_FIELDS_BIRTH_PLACE_STATE = 'EXTRACTED_FIELDS_BirthPlaceState',
  EXTRACTED_FIELDS_BIRTH_PLACE_COUNTRY = 'EXTRACTED_FIELDS_BirthPlaceCountry',
  EXTRACTED_FIELDS_MRZ_FULL = 'EXTRACTED_FIELDS_MRZFull',
  EXTRACTED_FIELDS_MRZ_LINE_1 = 'EXTRACTED_FIELDS_MRZLine1',
  EXTRACTED_FIELDS_MRZ_LINE_2 = 'EXTRACTED_FIELDS_MRZLine2',
  EXTRACTED_FIELDS_MRZ_LINE_3 = 'EXTRACTED_FIELDS_MRZLine3',
  EXTRACTED_FIELDS_OBSERVATION_PAGE = 'EXTRACTED_FIELDS_ObservationPage',
  EXTRACTED_FIELDS_ISSUING_AUTHORITY = 'EXTRACTED_FIELDS_IssuingAuthority',
  EXTRACTED_FIELDS_ISSUING_LOCATION = 'EXTRACTED_FIELDS_IssuingLocation',
  EXTRACTED_FIELDS_MARITAL_STATUS = 'EXTRACTED_FIELDS_MaritalStatus',
  EXTRACTED_FIELDS_OCCUPATION = 'EXTRACTED_FIELDS_Occupation',
  EXTRACTED_FIELDS_ALIEN_NUMBER = 'EXTRACTED_FIELDS_AlienNumber',
  EXTRACTED_FIELDS_EMPLOYER = 'EXTRACTED_FIELDS_Employer',
  EXTRACTED_FIELDS_ADDRESS_LINE_1 = 'EXTRACTED_FIELDS_AddressLine1',
  EXTRACTED_FIELDS_ADDRESS_LINE_2 = 'EXTRACTED_FIELDS_AddressLine2',
  EXTRACTED_FIELDS_ADDRESS_LINE_3 = 'EXTRACTED_FIELDS_AddressLine3',
  EXTRACTED_FIELDS_ADDRESS_LINE_4 = 'EXTRACTED_FIELDS_AddressLine4',
  EXTRACTED_FIELDS_ADDRESS_STATE = 'EXTRACTED_FIELDS_AddressState',
  EXTRACTED_FIELDS_ADDRESS_DISTRICT = 'EXTRACTED_FIELDS_AddressDistrict',
  EXTRACTED_FIELDS_ADDRESS_BUILDING_NUM = 'EXTRACTED_FIELDS_AddressBuildingNumber',
  EXTRACTED_FIELDS_ADDRESS_BUILDING_NAME = 'EXTRACTED_FIELDS_AddressBuildingName',
  EXTRACTED_FIELDS_ADDRESS_STREET = 'EXTRACTED_FIELDS_AddressStreet',
  EXTRACTED_FIELDS_ADDRESS_COUNTRY = 'EXTRACTED_FIELDS_AddressCountry',
  EXTRACTED_FIELDS_REF_ADDRESS_FULL = 'EXTRACTED_FIELDS_RefAddressFull',
  EXTRACTED_FIELDS_REF_ADDRESS_LINE_1 = 'EXTRACTED_FIELDS_RefAddressLine1',
  EXTRACTED_FIELDS_REF_ADDRESS_LINE_2 = 'EXTRACTED_FIELDS_RefAddressLine2',
  EXTRACTED_FIELDS_REF_ADDRESS_LINE_3 = 'EXTRACTED_FIELDS_RefAddressLine3',
  EXTRACTED_FIELDS_REF_ADDRESS_LINE_4 = 'EXTRACTED_FIELDS_RefAddressLine4',
  EXTRACTED_FIELDS_REF_ADDRESS_CITY = 'EXTRACTED_FIELDS_RefAddressCity',
  EXTRACTED_FIELDS_REF_ADDRESS_STATE = 'EXTRACTED_FIELDS_RefAddressState',
  EXTRACTED_FIELDS_REF_ADDRESS_DISTRICT = 'EXTRACTED_FIELDS_RefAddressDistrict',
  EXTRACTED_FIELDS_REF_ADDRESS_BUILTING_NUM = 'EXTRACTED_FIELDS_RefAddressBuildingNumber',
  EXTRACTED_FIELDS_REF_ADDRESS_BUILDING_NAME = 'EXTRACTED_FIELDS_RefAddressBuildingName',
  EXTRACTED_FIELDS_REF_ADDRESS_SUB_BUILDING_NAME = 'EXTRACTED_FIELDS_RefAddressSubBuildingName',
  EXTRACTED_FIELDS_REF_ADDRESS_STREET = 'EXTRACTED_FIELDS_RefAddressStreet',
  EXTRACTED_FIELDS_REF_ADDRESS_COUNTRY = 'EXTRACTED_FIELDS_RefAddressCountry',
  EXTRACTED_FIELDS_REF_ADDRESS_POST_CODE = 'EXTRACTED_FIELDS_RefAddressPostCode',
  EXTRACTED_FIELDS_HEALTH_NUMBER = 'EXTRACTED_FIELDS_HealthNumber',
  EXTRACTED_FIELDS_ENDORSMENTS = 'EXTRACTED_FIELDS_Endorsements',
  EXTRACTED_FIELDS_CONSTRAINTS = 'EXTRACTED_FIELDS_Constraints',
  EXTRACTED_FIELDS_LICENSE_MARINE = 'EXTRACTED_FIELDS_LicenseMarine',
  EXTRACTED_FIELDS_HEIGHT = 'EXTRACTED_FIELDS_Height',
  EXTRACTED_FIELDS_WEIGHT = 'EXTRACTED_FIELDS_Weight',
  EXTRACTED_FIELDS_HAIR_COLOR = 'EXTRACTED_FIELDS_HairColor',
  EXTRACTED_FIELDS_EYE_COLOR = 'EXTRACTED_FIELDS_EyeColor',
  EXTRACTED_FIELDS_LENS_DATA = 'EXTRACTED_FIELDS_LensData',
  EXTRACTED_FIELDS_SOCIAL_SECURITY_NUM = 'EXTRACTED_FIELDS_SocialSecurityNumber',
  EXTRACTED_FIELDS_NATIONAL_INSURANCE_NUM = 'EXTRACTED_FIELDS_NationalInsuranceNumber',
  EXTRACTED_FIELDS_RACE = 'EXTRACTED_FIELDS_Race',
  EXTRACTED_FIELDS_MOTHER_NAME = 'EXTRACTED_FIELDS_MotherName',
  EXTRACTED_FIELDS_FATHER_NAME = 'EXTRACTED_FIELDS_FatherName',
  EXTRACTED_FIELDS_PARENTS = 'EXTRACTED_FIELDS_Parents',
  EXTRACTED_FIELDS_REMARKS = 'EXTRACTED_FIELDS_Remarks',
  EXTRACTED_FIELDS_DISTINGUISHING_MARKS = 'EXTRACTED_FIELDS_DistinguishingMarks',
  EXTRACTED_FIELDS_PERIOD_OF_STAY = 'EXTRACTED_FIELDS_PeriodOfStay',
  EXTRACTED_FIELDS_TAX_NUMBER = 'EXTRACTED_FIELDS_TaxNumber',
  EXTRACTED_FIELDS_DONOR = 'EXTRACTED_FIELDS_Donor',
  EXTRACTED_FIELDS_RFIDG1 = 'EXTRACTED_FIELDS_RFIDG1',
  EXTRACTED_FIELDS_RFIDG2 = 'EXTRACTED_FIELDS_RFIDG2',
  EXTRACTED_FIELDS_RFIDG3 = 'EXTRACTED_FIELDS_RFIDG3',
  EXTRACTED_FIELDS_RFIDG15 = 'EXTRACTED_FIELDS_RFIDG15',
  EXTRACTED_FIELDS_RFIDSOD = 'EXTRACTED_FIELDS_RFIDSOD',
  EXTRACTED_FIELDS_PORTRAIT_PHOTO = 'EXTRACTED_FIELDS_PortraitPhoto',
  EXTRACTED_FIELDS_TITLE = 'EXTRACTED_FIELDS_Title',
  EXTRACTED_FIELDS_ISSUE_DATE_2 = 'EXTRACTED_FIELDS_IssueDate2',
  EXTRACTED_FIELDS_EXPIRY_DATE_2 = 'EXTRACTED_FIELDS_ExpiryDate2',
  EXTRACTED_FIELDS_LICENSE_CATEGORY_2 = 'EXTRACTED_FIELDS_LicenseCategory2',
  EXTRACTED_FIELDS_ISSUE_DATE_3 = 'EXTRACTED_FIELDS_IssueDate3',
  EXTRACTED_FIELDS_EXPIRY_DATE_3 = 'EXTRACTED_FIELDS_ExpiryDate3',
  EXTRACTED_FIELDS_LICENSE_CATEGORY_3 = 'EXTRACTED_FIELDS_LicenseCategory3',
  EXTRACTED_FIELDS_ISSUE_DATE_4 = 'EXTRACTED_FIELDS_IssueDate4',
  EXTRACTED_FIELDS_EXPIRY_DATE_4 = 'EXTRACTED_FIELDS_ExpiryDate4',
  EXTRACTED_FIELDS_LICENSE_CATEGORY_4 = 'EXTRACTED_FIELDS_LicenseCategory4',
  EXTRACTED_FIELDS_MRZ_CODE_1 = 'EXTRACTED_FIELDS_MRZCode1',
  EXTRACTED_FIELDS_MRZ_CODE_2 = 'EXTRACTED_FIELDS_MRZCode2',
  EXTRACTED_FIELDS_MRZ_STANDARD_TYPE = 'EXTRACTED_FIELDS_MRZStandardType',
  EXTRACTED_FIELDS_ADDRESS_STREET_SUFFIX = 'EXTRACTED_FIELDS_AddressStreetSuffix',
  EXTRACTED_FIELDS_ADDRESS_STREET_TYPE = 'EXTRACTED_FIELDS_AddressStreetType',
  EXTRACTED_FIELDS_ADDRESS_UNIT_NUMBER = 'EXTRACTED_FIELDS_AddressUnitNumber',
  EXTRACTED_FIELDS_LICENSE_NUMBER = 'EXTRACTED_FIELDS_LicenseNumber',
  EXTRACTED_FIELDS_ADDRESS_STATE_CODE = 'EXTRACTED_FIELDS_AddressStateCode',
  EXTRACTED_FIELDS_ADDRESS_STREET_TYPE_ABBREVIATION = 'EXTRACTED_FIELDS_AddressStreetTypeAbbreviation',
  EXTRACTED_FIELDS_ADDRESS_UNIT_TYPE = 'EXTRACTED_FIELDS_AddressUnitType',
  EXTRACTED_FIELDS_ADDRESS_DELIVERY_POINT_ID = 'EXTRACTED_FIELDS_AddressDeliveryPointIdentifier',
  EXTRACTED_FIELDS_AGE_CATEGORY = 'EXTRACTED_FIELDS_AgeCategory',
  EXTRACTED_FIELDS_CHILDREN_COUNT = 'EXTRACTED_FIELDS_ChildernCount',
  EXTRACTED_FIELDS_ENTRY_MODE = 'EXTRACTED_FIELDS_EntryMode',
  EXTRACTED_FIELDS_VAF_NUM = 'EXTRACTED_FIELDS_VAFNumber',
  EXTRACTED_FIELDS_ADDRESS_LINE_5 = 'EXTRACTED_FIELDS_AddressLine5',
  EXTRACTED_FIELDS_RFID_PORTRAIT_PHOTO = 'EXTRACTED_FIELDS_RFIDPortraitPhoto',
  EXTRACTED_FIELDS_REF_ADDRESS_LINE_5 = 'EXTRACTED_FIELDS_RefAddressLine5',
  EXTRACTED_FIELDS_REF_ADDRESS_STATE_CODE = 'EXTRACTED_FIELDS_RefAddressStateCode',
  EXTRACTED_FIELDS_REF_ADDRESS_STREET_TYPE = 'EXTRACTED_FIELDS_RefAddressStreetType',
  EXTRACTED_FIELDS_REF_ADDRESS_STREET_TYPE_ABBREVIATION = 'EXTRACTED_FIELDS_RefAddressStreetTypeAbbreviation',
  EXTRACTED_FIELDS_REF_ADDRESS_STREET_SUFFIX = 'EXTRACTED_FIELDS_RefAddressStreetSuffix',
  EXTRACTED_FIELDS_REF_ADDRESS_UNIT_NUM = 'EXTRACTED_FIELDS_RefAddressUnitNumber',
  EXTRACTED_FIELDS_REF_ADDRESS_UNIT_TYPE = 'EXTRACTED_FIELDS_RefAddressUnitType',
  EXTRACTED_FIELDS_REF_ADDRESS_POST_CODE_TYPE = 'EXTRACTED_FIELDS_RefAddressPostcodeType',
  EXTRACTED_FIELDS_REF_ADDRESS_DELIVERY_POINT_ID = 'EXTRACTED_FIELDS_RefAddressDeliveryPointIdentifier',
  EXTRACTED_FIELDS_REF_ADDRESS_PO_BOX_NUM = 'EXTRACTED_FIELDS_RefAddressPOBoxNumber',
  EXTRACTED_FIELDS_REF_ADDRESS_DEPENDENT_LOCALITY = 'EXTRACTED_FIELDS_RefAddressDependentLocality',
  EXTRACTED_FIELDS_REF_ADDRESS_DOUBLE_DEPENDENT_LOCALITY = 'EXTRACTED_FIELDS_RefAddressDoubleDependentLocality',
  EXTRACTED_FIELDS_REF_ADDRESS_THOROUGHFARE = 'EXTRACTED_FIELDS_RefAddressThoroughfare',
  EXTRACTED_FIELDS_REF_ADDRESS_THOROUGHFARE_DESC = 'EXTRACTED_FIELDS_RefAddressThoroughfareDesc',
  EXTRACTED_FIELDS_REF_ADDRESS_DEPENDENT_THOROUGHFARE = 'EXTRACTED_FIELDS_RefAddressDependentThoroughfare',
  EXTRACTED_FIELDS_REF_ADDRESS_DEPENDENT_THOROUGHFARE_DESC = 'EXTRACTED_FIELDS_RefAddressDependentThoroughfareDesc',
  EXTRACTED_FIELDS_REF_ADDRESS_SUB_BUILDING_NUM = 'EXTRACTED_FIELDS_RefAddressSubBuildingNumber',
  EXTRACTED_FIELDS_ADDRESS_SUB_BUILDING_NUM = 'EXTRACTED_FIELDS_AddressSubBuildingNumber',
  EXTRACTED_FIELDS_ADDRESS_SUB_BUILDING_NAME = 'EXTRACTED_FIELDS_AddressSubBuildingName',
  EXTRACTED_FIELDS_ADDRESS_POST_CODE_TYPE = 'EXTRACTED_FIELDS_AddressPostCodeType',
  EXTRACTED_FIELDS_ISSUING_AUTHORITY_TYPE = 'EXTRACTED_FIELDS_IssuingAuthorityType',
  EXTRACTED_FIELDS_SIGNATURE = 'EXTRACTED_FIELDS_Signature',
  EXTRACTED_FIELDS_HOLOGRAM = 'EXTRACTED_FIELDS_Hologram',
  EXTRACTED_FIELDS_CARD_NUMBER = 'EXTRACTED_FIELDS_CardNumber',
  EXTRACTED_FIELDS_MIDDLE_NAME_INITIAL = 'EXTRACTED_FIELDS_MiddleNameInitial',
  EXTRACTED_FIELDS_PERMIT_NUM = 'EXTRACTED_FIELDS_PermitNumber',
  EXTRACTED_FIELDS_REFERENCE_NUM = 'EXTRACTED_FIELDS_ReferenceNumber',
  EXTRACTED_FIELDS_CUSTOMER_NUM = 'EXTRACTED_FIELDS_CustomerNumber',
  EXTRACTED_FIELDS_BOS_NUM = 'EXTRACTED_FIELDS_BOSNumber',
  EXTRACTED_FIELDS_STUDENT_ID = 'EXTRACTED_FIELDS_StudentID',
  EXTRACTED_FIELDS_MEMBERSHIP_NUMBER = 'EXTRACTED_FIELDS_MembershipNumber',
  EXTRACTED_FIELDS_LICENSE_TYPE = 'EXTRACTED_FIELDS_LicenseType',
  EXTRACTED_FIELDS_LICENSE_TYPE_2 = 'EXTRACTED_FIELDS_LicenseType2',
  EXTRACTED_FIELDS_LICENSE_TYPE_3 = 'EXTRACTED_FIELDS_LicenseType3',
  EXTRACTED_FIELDS_LICENSE_TYPE_4 = 'EXTRACTED_FIELDS_LicenseType4',
  EXTRACTED_FIELDS_DOCUMENT_TYPE_CODE = 'EXTRACTED_FIELDS_DocumentTypeCode',
  EXTRACTED_FIELDS_MRZ_DOCUMENT_NUMBER_CHECK_DIGIT = 'EXTRACTED_FIELDS_MRZDocumentNumberCheckDigit',
  EXTRACTED_FIELDS_MRZ_BIRTH_DATE_CHECK_DIGIT = 'EXTRACTED_FIELDS_MRZBirthDateCheckDigit',
  EXTRACTED_FIELDS_MRZ_EXPORY_DATE_CHECK_DIGIT = 'EXTRACTED_FIELDS_MRZExpiryDateCheckDigit',
  EXTRACTED_FIELDS_MRZ_PERSONAL_NUMBER_CHECK_DIGIT = 'EXTRACTED_FIELDS_MRZPersonalNumberCheckDigit',
  EXTRACTED_FIELDS_MRZ_COMPOSITE_CHECK_DIGIT = 'EXTRACTED_FIELDS_MRZCompositeCheckDigit',
  EXTRACTED_FIELDS_SECONDARY_PORTRAIT_PHOTO = 'EXTRACTED_FIELDS_SecondaryPortraitPhoto',
  EXTRACTED_FIELDS_FINGERPRINT = 'EXTRACTED_FIELDS_Fingerprint',
  EXTRACTED_FIELDS_VERSION_NUMBER = 'EXTRACTED_FIELDS_VersionNumber',
  EXTRACTED_FIELDS_CONDITIONS = 'EXTRACTED_FIELDS_Conditions',
  EXTRACTED_FIELDS_NICKNAME = 'EXTRACTED_FIELDS_NickName',
  EXTRACTED_FIELDS_ADDRESS_APARTMENT_NUMBER = 'EXTRACTED_FIELDS_AddressApartmentNumber',
  EXTRACTED_FIELDS_ADDRESS_FLOOR_NUM = 'EXTRACTED_FIELDS_AddressFloorNumber',
  EXTRACTED_FIELDS_FIRST_NAME_LOCAL = 'EXTRACTED_FIELDS_FirstNameLocal',
  EXTRACTED_FIELDS_LAST_NAME_LOCAL = 'EXTRACTED_FIELDS_LastNameLocal',
  EXTRACTED_FIELDS_FULL_NAME_LOCAL = 'EXTRACTED_FIELDS_FullNameLocal',
  EXTRACTED_FIELDS_BIRTH_PLACE_LOCAL = 'EXTRACTED_FIELDS_BirthPlaceLocal',
  EXTRACTED_FIELDS_ISSUING_AUTHORITY_LOCAL = 'EXTRACTED_FIELDS_IssuingAuthorityLocal',
  EXTRACTED_FIELDS_MOTHER_NAME_LOCAL = 'EXTRACTED_FIELDS_MotherNameLocal',
  EXTRACTED_FIELDS_FATHER_NAME_LOCAL = 'EXTRACTED_FIELDS_FatherNameLocal',
  EXTRACTED_FIELDS_ADDRESS_FULL_LOCAL = 'EXTRACTED_FIELDS_AddressFullLocal',
  EXTRACTED_FIELDS_MIDDLE_NAME_LOCAL = 'EXTRACTED_FIELDS_MiddleNameLocal',
  EXTRACTED_FIELDS_ADDRESS_LINE_1_LOCAL = 'EXTRACTED_FIELDS_AddressLine1Local',
  EXTRACTED_FIELDS_ADDRESS_LINE_2_LOCAL = 'EXTRACTED_FIELDS_AddressLine2Local',
  EXTRACTED_FIELDS_ADDRESS_LINE_3_LOCAL = 'EXTRACTED_FIELDS_AddressLine3Local',
  EXTRACTED_FIELDS_IND_REF_NUMBER_1 = 'EXTRACTED_FIELDS_IndRefNumber1',
  EXTRACTED_FIELDS_IND_REF_NUMBER_2 = 'EXTRACTED_FIELDS_IndRefNumber2',
  EXTRACTED_FIELDS_IND_REF_NUMBER_3 = 'EXTRACTED_FIELDS_IndRefNumber3',
  EXTRACTED_FIELDS_IND_REF_NUMBER_4 = 'EXTRACTED_FIELDS_IndRefNumber4',
  EXTRACTED_FIELDS_IND_REF_NUMBER_5 = 'EXTRACTED_FIELDS_IndRefNumber5',
  EXTRACTED_FIELDS_NAME_1 = 'EXTRACTED_FIELDS_Name1',
  EXTRACTED_FIELDS_NAME_2 = 'EXTRACTED_FIELDS_Name2',
  EXTRACTED_FIELDS_NAME_3 = 'EXTRACTED_FIELDS_Name3',
  EXTRACTED_FIELDS_NAME_4 = 'EXTRACTED_FIELDS_Name4',
  EXTRACTED_FIELDS_NAME_5 = 'EXTRACTED_FIELDS_Name5',
  EXTRACTED_FIELDS_RECIPIENT_NAME = 'EXTRACTED_FIELDS_RecipientName',
  EXTRACTED_FIELDS_RECIPIENT_NAME_1 = 'EXTRACTED_FIELDS_RecipientName1',
  EXTRACTED_FIELDS_RECIPIENT_NAME_2 = 'EXTRACTED_FIELDS_RecipientName2',
  EXTRACTED_FIELDS_RECIPIENT_NAME_3 = 'EXTRACTED_FIELDS_RecipientName3',
  EXTRACTED_FIELDS_RECIPIENT_NAME_4 = 'EXTRACTED_FIELDS_RecipientName4',
  EXTRACTED_FIELDS_RECIPIENT_ADDRESS_FULL = 'EXTRACTED_FIELDS_RecipientAddressFull',
  EXTRACTED_FIELDS_IBAN = 'EXTRACTED_FIELDS_Iban',
  EXTRACTED_FIELDS_ACCOUNT_NUM = 'EXTRACTED_FIELDS_AccountNumber',
  EXTRACTED_FIELDS_ISSUER = 'EXTRACTED_FIELDS_Issuer',
  EXTRACTED_FIELDS_RECIPIENT_ADDRESS_CITY = 'EXTRACTED_FIELDS_RecipientAddressCity',
  EXTRACTED_FIELDS_RECIPIENT_ADDRESS_POST_CODE = 'EXTRACTED_FIELDS_RecipientAddressPostCode',
  EXTRACTED_FIELDS_DAY = 'EXTRACTED_FIELDS_Day',
  EXTRACTED_FIELDS_MONTH = 'EXTRACTED_FIELDS_Month',
  EXTRACTED_FIELDS_YEAR = 'EXTRACTED_FIELDS_Year',
  EXTRACTED_FIELDS_OPTIONAL_VALUE_1 = 'EXTRACTED_FIELDS_OptionalValue1',
  EXTRACTED_FIELDS_OPTIONAL_VALUE_2 = 'EXTRACTED_FIELDS_OptionalValue2',
  EXTRACTED_FIELDS_OPTIONAL_VALUE_3 = 'EXTRACTED_FIELDS_OptionalValue3',
  EXTRACTED_FIELDS_OPTIONAL_VALUE_4 = 'EXTRACTED_FIELDS_OptionalValue4',
  EXTRACTED_FIELDS_ISSUING_STATE_NAME = 'EXTRACTED_FIELDS_IssuingStateName',
  EXTRACTED_FIELDS_FRONT_DOCUMENT_TYPE_ID = 'EXTRACTED_FIELDS_Front Document Type ID',
  EXTRACTED_FIELDS_BACK_DOCUMENT_TYPE_ID = 'EXTRACTED_FIELDS_Back Document Type ID',
  HASNOCAMERA_TITLE = 'HASNOCAMERA_TITLE',
  HASNOCAMERA_DESCRIPTION = 'HASNOCAMERA_DESCRIPTION',
}

/**
 * Function which accepts a key, language and props to produce a translated
 * string
 *
 * @public
 */
export declare type Translator = (key: TranslationKey, language: string, props: Record<string, any>) => string;

export {};
