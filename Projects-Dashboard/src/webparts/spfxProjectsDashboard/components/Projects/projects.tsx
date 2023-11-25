import * as React from "react";
import { ProjectsProps } from "./ProjectsProps";
import { ProjectsState } from "./ProjectsState";
import {SPHttpClient, SPHttpClientResponse} from "@microsoft/sp-http";
import {DocumentCard, DocumentCardDetails, DocumentCardTitle}  from "@fluentui/react";

export class Projects extends React.Component<ProjectsProps, ProjectsState>{
/**
 *
 */
constructor(props: ProjectsProps, state: ProjectsState) {
    super(props);
    this.state = {
        items: []
    }
}

public getItems(filterVal: string) : void {
    if(filterVal === "*"){
        this.props.context.spHttpClient.get(
            `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Projects')/Items?$expand=ProjectManager&$select=*,ProjectManager,ProjectManager/EMail,ProjectManager/Title`,
            SPHttpClient.configurations.v1
        ).then(
            (response: SPHttpClientResponse): Promise<{value: any[]}> => {
                return response.json();
            }
        ).then(
            (response: {value: any[]}) => {
                var _items : any[];
                _items = [];
                _items = _items.concat(response.value);
                this.setState({
                    items:_items
                });
            }
        )
    }
    else{
        this.props.context.spHttpClient.get(
            `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Projects')/Items?$expand=ProjectManager&$select=*,ProjectManager,ProjectManager/EMail,ProjectManager/Title&$filter=Status eq %27${filterVal}%27`,
            SPHttpClient.configurations.v1
        ).then(
            (response: SPHttpClientResponse): Promise<{value: any[]}> => {
                return response.json();
            }
        ).then(
            (response: {value: any[]}) => {
                var _items : any[];
                _items = [];
                _items = _items.concat(response.value);
                this.setState({
                    items:_items
                });
            }
        )
    }
}

public componentDidMount(): void {
    var allprojects = "*";
    this.getItems(allprojects);    
}

public applyFilter(filterVal: string){
    return this.getItems(filterVal);
}

render() : React.ReactElement<ProjectsProps> {
    var allProjects = "*";
    var inProgress = "In Progress";
    var onHold = "On Hold";
    var completed = "Completed";
    var notStarted = "Not Started";
    return <div>
        <div>
            <button onClick={() => this.applyFilter(allProjects)}>
                All Projects
            </button>
            <button onClick={() => this.applyFilter(notStarted)}>
                Not Started
            </button>
            <button onClick={() => this.applyFilter(inProgress)}>
                In Progress
            </button>
            <button onClick={() => this.applyFilter(onHold)}>
                On Hold
            </button>
            <button onClick={() => this.applyFilter(completed)}>
                Completed
            </button>
        </div>
        <div>
            {this.state.items.map((item: any, key: any) => 
                <DocumentCard>
                    <DocumentCardTitle  title={item.Title}></DocumentCardTitle>
                    <DocumentCardDetails>
                        <div>{item.ProjectManager.Title}</div>
                        <div>{item.Status}</div>
                    </DocumentCardDetails>
                </DocumentCard>
            )}
        </div>
    </div>
}

}