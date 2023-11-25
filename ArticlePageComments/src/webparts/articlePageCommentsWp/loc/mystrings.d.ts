declare interface IArticlePageCommentsWpWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  TextSentimentApiKey:string;
  ChosenSentiment:string;
}

declare module 'ArticlePageCommentsWpWebPartStrings' {
  const strings: IArticlePageCommentsWpWebPartStrings;
  export = strings;
}
