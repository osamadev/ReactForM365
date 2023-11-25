import { SPHttpClient, SPHttpClientResponse, HttpClient, HttpClientResponse, IHttpClientOptions } from "@microsoft/sp-http";
import { IPageComment } from "../components/IPageComment";


export class SentimentService {

    private _baseURL: string;
    private _listId?: string;
    private _listItemId?: string;
    private _spHttpClient: SPHttpClient;
    private _ApiHttpClient: HttpClient;

    private  _apiURL: string = "https://ai-services-instance.cognitiveservices.azure.com/text/analytics/v3.0/";
    private _textSentimentApiKey: string;

    constructor(baseUrl: string, spHttpClient: SPHttpClient, 
        apiHttpClient: HttpClient, textSentimentApiKey: string, listId?: string, listItemId?: string) {
        
        console.log(textSentimentApiKey);
        this._baseURL = baseUrl;
        this._listId = listId;
        this._listItemId = listItemId;
        this._spHttpClient = spHttpClient;
        this._ApiHttpClient = apiHttpClient;
        this._textSentimentApiKey = textSentimentApiKey;
    }

    private async getPageComments(): Promise<IPageComment[]> {
        const _apiURL: string = `${this._baseURL}/_api/web/lists('${this._listId}')/GetItemById('${this._listItemId}')/comments?$top=5&inlineCount=AllPages`;
        const response: SPHttpClientResponse = await this._spHttpClient.get(_apiURL, SPHttpClient.configurations.v1);
        let pageComments: IPageComment[] = new Array<IPageComment>;
        if (response.ok) {
            const responseJson = await response.json();
            pageComments = responseJson.value.map((c: any) => {
                const comment: IPageComment = {
                    id: c.id,
                    author: c.author.name,
                    comment: c.text,
                    sentiment: "undefined",
                    language: "unknown",
                    confidence: 1
                };
                return comment;
            });
        }
        else {
            console.log(`Errro while fetching the article comments with the following error: ${response.statusText}`);
        }
        return pageComments;
    }

    public async getCommentsAndCalcSentiments(): Promise<IPageComment[]> {
        const comments = await this.getPageComments();
        return await this._calculateSentiment(comments);
    }

    private async _calculateSentiment(comments: IPageComment[]): Promise<IPageComment[]> {
        for (let i = 0; i < comments.length; i++) {
            comments[i] = await this._getSentimentFromComment(comments[i]);
        }
        return comments;
    }

    private async _getSentimentFromComment(comment: IPageComment): Promise<IPageComment> {
        const detectedLanguage: string = await this._detectLanguage(comment);
        console.log(detectedLanguage);
        const httpOptions: IHttpClientOptions = this._prepareHttpOptionsForApi(comment, detectedLanguage);

        const coginitiveResponse: HttpClientResponse = await this._ApiHttpClient.post(
            `${this._apiURL}sentiment`,
            HttpClient.configurations.v1,
            httpOptions
        );
        let responseJson: any;
        if (coginitiveResponse.ok) {
            responseJson = await coginitiveResponse.json();
            if (responseJson.documents.length === 1) {
                comment.language = detectedLanguage;
                comment.sentiment = responseJson.documents[0].sentiment;
                switch (comment.sentiment) {
                    case "positive":
                        comment.confidence = responseJson.documents[0].confidenceScores.positive;
                        break;
                    case "negative":
                        comment.confidence = responseJson.documents[0].confidenceScores.negative;
                        break;
                    case "neutral":
                        comment.confidence = responseJson.documents[0].confidenceScores.neutral;
                        break;
                }
            }
            else {
                comment.sentiment = "undefined";
                comment.language = "unknown";
                comment.confidence = 1;
            }
        }
        return comment;
    }

    private _prepareHttpOptionsForApi(comment: IPageComment, detectedLanguage?: string): IHttpClientOptions {
        const body: any = {
            documents: [
                {
                    id: comment.id,
                    text: comment.comment
                }
            ]
        };
        if (detectedLanguage)
            body.language = detectedLanguage;
        const httpOptions: IHttpClientOptions = {
            body: JSON.stringify(body),
            headers: this._prepareHeadersForTextApi()
        }

        return httpOptions;
    }
    private _prepareHeadersForTextApi(): Headers {
        const requestHeaders : Headers = new Headers();
        requestHeaders.append("content-type", "application/json");
        requestHeaders.append("accept", "application/json");
        requestHeaders.append("cache-control", "no-cache");
        requestHeaders.append("Ocp-Apim-Subscription-Key", this._textSentimentApiKey);
        return requestHeaders;
    }

    private async _detectLanguage(comment: IPageComment): Promise<string> {
        const response: HttpClientResponse = await this._ApiHttpClient.post(
            `${this._apiURL}languages`,
            HttpClient.configurations.v1,
            this._prepareHttpOptionsForApi(comment)
        );

        if(response.ok){
            return (await response.json()).documents[0].detectedLanguage.iso6391Name;
        }
        else{
            return "unknown";
        }
    }
}
