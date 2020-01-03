const prod = {
      API_URL: 'https://jobtrackerboard.herokuapp.com'
};

const dev = {
   API_URL: 'http://127.0.0.1:8000'
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;