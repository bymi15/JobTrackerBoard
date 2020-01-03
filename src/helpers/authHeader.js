export const authHeader = getState => {
   const token = getState().api_auth.token;
   if (token) {
      return {'Authorization' : `Token ${token}`};
   } else {
      return null;
   }
}