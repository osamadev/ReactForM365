import {WebPartContext} from "@microsoft/sp-webpart-base";

export interface IArticlePageCommentsWpProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  textSentimentApiKey: string;
  chosenSentiment?: string;
}
