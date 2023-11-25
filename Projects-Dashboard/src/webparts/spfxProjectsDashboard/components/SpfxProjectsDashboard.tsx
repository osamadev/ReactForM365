import * as React from 'react';
import styles from './SpfxProjectsDashboard.module.scss';
import type { ISpfxProjectsDashboardProps } from './ISpfxProjectsDashboardProps';
import { Projects } from './Projects/projects';

export default class SpfxProjectsDashboard extends React.Component<ISpfxProjectsDashboardProps, {}> {
  public render(): React.ReactElement<ISpfxProjectsDashboardProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.spfxProjectsDashboard} ${hasTeamsContext ? styles.teams : ''}`}>
            <Projects context={this.props.context}></Projects>
      </section>
    );
  }
}
