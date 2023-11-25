import * as React from 'react';
import styles from './ArticlePageCommentsWp.module.scss';
import type { IArticlePageCommentsWpProps } from './IArticlePageCommentsWpProps';
import { IArticlePageCommentsState } from './IArticlePageCommentsState';
import {IPageComment} from './IPageComment';
import { SentimentService } from "../Services/SentimentService";

export default class ArticlePageCommentsWp extends React.Component<IArticlePageCommentsWpProps, IArticlePageCommentsState> {
  private sentimentService: SentimentService;

  constructor(props: IArticlePageCommentsWpProps, state: IArticlePageCommentsState) {
    super(props);
    this.sentimentService = new SentimentService(props.context.pageContext.web.absoluteUrl,
      props.context.spHttpClient,
      props.context.httpClient,
      props.textSentimentApiKey,
      props.context.pageContext.list?.id.toString(),
      props.context.pageContext.listItem?.id.toString()
      );
    this.state = {
      comments: []
    };
  }

  public componentDidMount(): void {
      this.sentimentService.getCommentsAndCalcSentiments().then(c => 
        this.setState({
          comments: c
        })
      ).catch(error => console.log(`Error while fetching the comments: ${error}`));
  }

  public render(): React.ReactElement<IArticlePageCommentsWpProps> {
    let validItems = this.state.comments.filter(item => item.sentiment == this.props.chosenSentiment);

    const items = validItems.map((item: IPageComment) => <li key={item.id}>{item.comment}  ({item.language}, 
    {item.sentiment} - confidence: {item.confidence})</li>);
    return (
      <div className={styles.articlePageCommentsWp}>
        <span>
          There are {items.length} comments as follows:
        </span>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}
