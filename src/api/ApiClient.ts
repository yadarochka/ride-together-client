import { User } from "./type";

class ApiAuthClient {
    baseUrl = 'http://localhost:5000/api/auth/';

    async register(newUserData:User){
        const response = await fetch(this.baseUrl + 'register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserData)
        });

        return await response.json()
    }
    
    async get(endpoint: string) {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    }
    
    async post(endpoint: string, data: any) {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    }
    
}

export default new ApiAuthClient()