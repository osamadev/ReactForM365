import * as React from 'react';
import styles from './UserDetailsWp.module.scss';
import type { IUserDetailsWpProps } from './IUserDetailsWpProps';
import { IUserProfileState } from './IUserProfileState';
import {MSGraphClientV3}  from '@microsoft/sp-http';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import * as commonLibrary from 'sp-project-common';

export default class UserDetailsWp extends React.Component<IUserDetailsWpProps, IUserProfileState> {

  

  /**
   *
   */
  constructor(props: IUserDetailsWpProps, state: IUserProfileState) {
    super(props);
    this.state = {
      profile: null,
      nbTeams : -1
    };
  }  


  public componentDidMount() : void{
    this.props.context.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3): void => {
        // get information about the current user from the Microsoft Graph
        client
          .api("/me")
          .get((error, user: MicrosoftGraph.User) => {
            if(error){
              console.log(error);
              return;
            }
            this.setState({ profile: user });
          });

          client
          .api("/me/joinedTeams")
          .get((error, response: any) => {
            if(error){
              console.log(error);
              return;
            }
            this.setState({ nbTeams: Object.keys(response).length });
          });
      });
  }
  public render(): React.ReactElement<IUserDetailsWpProps> {
    let commonLib : commonLibrary.CommonHelperLibLibrary = new commonLibrary.CommonHelperLibLibrary();

    if(this.state){
      return (
        <section className={styles.userDetailsWp}>
          <div className={styles.welcome}>
            This section shows the summary of your user profile
          </div>
          <div className={styles.welcome}>Display Name: {this.state.profile?.displayName}</div>
          <div className={styles.welcome}>Email: {this.state.profile?.mail}</div>
          <div className={styles.welcome}>Mobile Number: {this.state.profile?.mobilePhone}</div>
          <div className={styles.welcome}>Number Of Teams: {this.state.nbTeams} Teams</div>
          <div>{commonLib.getCurrentTime()}</div>
        </section>
      );
    }
    else{
      return (
        <section className={styles.userDetailsWp}>
          <div className={styles.welcome}>
          This section shows the summary of your user profile
          </div>
          <div className={styles.welcome}>Retrieving the user profile details ....</div>
          </section>
      );
    }
  }
}
