import * as React from 'react';
import styles from './EmployeeProfileWp.module.scss';
import type { IEmployeeProfileWpProps } from './IEmployeeProfileWpProps';
import { IUserProfileState } from './IUserProfileState';
import { UserProfileService } from '../services/UserProfileService';

export default class EmployeeProfileWp extends React.Component<
  IEmployeeProfileWpProps,
  IUserProfileState
> {
  private service: UserProfileService;
  /**
   *
   */
  constructor(props: IEmployeeProfileWpProps, state: IUserProfileState) {
    super(props);

    this.service = new UserProfileService(
      props.context.pageContext.web.absoluteUrl,
      props.context.spHttpClient
    );
  }

  public componentDidMount(): void {
    this.service
      .getMyUserProfile()
      .then((u) =>
        this.setState({
          profile: u,
        })
      )
      .catch((error) =>
        console.log(
          `Error while fetching the user profile with the following error: ${error}`
        )
      );
  }

  public render(): React.ReactElement<IEmployeeProfileWpProps> {
    if(this.state){
      return (
        <div className={styles.employeeProfileWp}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <span className={styles.title}>
                  Welcome to SharePoint!
                </span>
                <p className={styles.subTitle}>Fetching User Profile Properties</p>
                <img src={this.state.profile?.PictureURL}></img>
                <p>
                  Name: {this.state.profile?.LastName}, {this.state.profile?.FirstName}
                </p>
                <p>
                  WorkPhone: {this.state.profile?.WorkPhone}
                </p>
                <p>
                  Department: {this.state.profile?.Department}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else{
      return (
        <div className={styles.employeeProfileWp}>
          <span>
            Fetching user profile data ....
          </span>
        </div>
      );
    }

    
  }
}
