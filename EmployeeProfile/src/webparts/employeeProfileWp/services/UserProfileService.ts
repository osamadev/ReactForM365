import { SPHttpClient } from '@microsoft/sp-http';
import { IUserProfile } from '../components/IUserProfile';

export class UserProfileService {
    private baseUrl: string;
    private spHttpClient: SPHttpClient;

    constructor(baseUrl: string, spHttpClient: SPHttpClient) {
        this.baseUrl = baseUrl;
        this.spHttpClient = spHttpClient;
    }

    private async getCurrentUserProfile(): Promise<IUserProfile> {
        const endpoint = `${this.baseUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;
        let response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1, 
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            });
        return response.json();
    }

    public async getMyUserProfile() : Promise<IUserProfile>{
        let userProfile = await this.getCurrentUserProfile();
        for(let i: number =0; i < userProfile.UserProfileProperties.length; i++){
            if (userProfile.UserProfileProperties[i].Key == "FirstName")
                userProfile.FirstName = userProfile.UserProfileProperties[i].Value;

            else if (userProfile.UserProfileProperties[i].Key == "LastName")
                userProfile.LastName = userProfile.UserProfileProperties[i].Value;

            else if (userProfile.UserProfileProperties[i].Key == "Department")
                userProfile.Department = userProfile.UserProfileProperties[i].Value;

            else if (userProfile.UserProfileProperties[i].Key == "WorkPhone")
                userProfile.WorkPhone = userProfile.UserProfileProperties[i].Value;

            if (userProfile.UserProfileProperties[i].Key == "PictureURL")
                userProfile.PictureURL = userProfile.UserProfileProperties[i].Value;

        }
        return userProfile;
    }
}
